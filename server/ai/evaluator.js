/**
 * Real-Time Collaborative Code Interview Platform
 * AI Evaluation Service: Multi-Provider LLM & Heuristic Router
 */

const https = require('https');
const { EVALUATION_SYSTEM_PROMPT, buildEvaluationUserPrompt } = require('./prompts');
const { generateHeuristicReport } = require('./heuristics');

/**
 * Auto-detect active AI provider based on environment configuration
 */
function getResolvedProvider() {
  const explicit = (process.env.AI_EVALUATION_PROVIDER || '').trim().toLowerCase();
  if (explicit && explicit !== 'heuristic') {
    return explicit;
  }

  // Auto-detect based on presence of API keys
  if (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY) {
    return 'azure';
  }
  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }
  if (process.env.GEMINI_API_KEY) {
    return 'gemini';
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return 'anthropic';
  }
  return 'heuristic';
}

/**
 * Make HTTPS JSON POST request
 */
function makeJsonRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } catch (err) {
          resolve({ status: res.statusCode, data: { raw: data, error: `Non-JSON response: ${data.slice(0, 300)}` }, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    req.end();
  });
}

/**
 * Call Gemini REST API
 */
async function callGemini(promptText, apiKey) {
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const payload = {
    contents: [
      {
        parts: [
          { text: `${EVALUATION_SYSTEM_PROMPT}\n\n${promptText}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  };

  const res = await makeJsonRequest(options, payload);
  if (res.status === 200 && res.data && res.data.candidates && res.data.candidates[0]) {
    const contentText = res.data.candidates[0].content.parts[0].text;
    return JSON.parse(contentText);
  }
  throw new Error(`Gemini API returned error: ${JSON.stringify(res.data)}`);
}

/**
 * Call OpenAI REST API
 */
async function callOpenAI(promptText, apiKey) {
  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  };

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: EVALUATION_SYSTEM_PROMPT },
      { role: 'user', content: promptText }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  };

  const res = await makeJsonRequest(options, payload);
  if (res.status === 200 && res.data && res.data.choices && res.data.choices[0]) {
    return JSON.parse(res.data.choices[0].message.content);
  }
  throw new Error(`OpenAI API returned error: ${JSON.stringify(res.data)}`);
}

/**
 * Call Anthropic REST API
 */
async function callAnthropic(promptText, apiKey) {
  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }
  };

  const payload = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: EVALUATION_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: promptText }
    ]
  };

  const res = await makeJsonRequest(options, payload);
  if (res.status === 200 && res.data && res.data.content && res.data.content[0]) {
    const rawText = res.data.content[0].text;
    // Extract JSON block if wrapped
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return JSON.parse(rawText);
  }
  throw new Error(`Anthropic API returned error: ${JSON.stringify(res.data)}`);
}

/**
 * Helper to retrieve Azure OpenAI configuration from environment variables
 * Supports multiple standard alias names for model / deployment
 */
function getAzureEnvConfig() {
  const apiKey = (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY || '').trim();
  const endpoint = (process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_ENDPOINT || '').trim();
  const deployment = (
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
    process.env.AZURE_DEPLOYMENT_NAME ||
    process.env.AZURE_OPENAI_MODEL ||
    process.env.AZURE_MODEL ||
    process.env.AZURE_AI_MODEL ||
    process.env.MODEL_NAME ||
    process.env.AI_MODEL ||
    ''
  ).trim() || null;
  const version = (process.env.AZURE_OPENAI_API_VERSION || process.env.AZURE_API_VERSION || '').trim() || null;

  return { apiKey, endpoint, deployment, version };
}

let cachedDiscoveredDeployments = null;
let cachedWorkingDeployment = null;

/**
 * Auto-discover deployed models from Azure endpoints
 */
async function discoverAzureDeployments(endpoint, apiKey, apiVersion) {
  if (cachedDiscoveredDeployments && cachedDiscoveredDeployments.length > 0) {
    return cachedDiscoveredDeployments;
  }

  let urlStr = (endpoint || '').trim();
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = `https://${urlStr}`;
  }
  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch (_) {
    return [];
  }

  const results = [];
  const basePath = parsed.pathname.replace(/\/chat\/completions.*/, '').replace(/\/$/, '');
  const isV1 = parsed.pathname.includes('/openai/v1') || parsed.pathname.endsWith('/v1');
  const isProject = parsed.hostname.includes('services.ai.azure.com') || parsed.pathname.includes('/api/projects/');

  const probePaths = [];
  if (isV1) {
    const v1Base = basePath.includes('/openai/v1') ? basePath : (basePath.endsWith('/v1') ? basePath : `${basePath}/openai/v1`);
    probePaths.push(`${v1Base}/models`);
  }
  if (isProject) {
    probePaths.push(`${basePath}/models`);
  }
  probePaths.push(`/openai/deployments?api-version=${encodeURIComponent(apiVersion || '2024-06-01')}`);
  probePaths.push(`/openai/models?api-version=${encodeURIComponent(apiVersion || '2024-06-01')}`);

  for (const probePath of probePaths) {
    try {
      const options = {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: probePath,
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'Authorization': `Bearer ${apiKey}`
        }
      };

      const res = await makeJsonRequest(options, null);
      if (res.status === 200 && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        for (const item of res.data.data) {
          const id = item.id || item.name || item.model;
          if (id && typeof id === 'string') {
            const lower = id.toLowerCase();
            if (!lower.includes('embedding') && !lower.includes('dall-e') && !lower.includes('whisper') && !lower.includes('tts')) {
              results.push(id);
            }
          }
        }
        if (results.length > 0) {
          console.log(`[Azure AI] Auto-discovered models on ${parsed.hostname}: ${results.join(', ')}`);
          cachedDiscoveredDeployments = Array.from(new Set(results));
          return cachedDiscoveredDeployments;
        }
      }
    } catch (_) {}
  }

  return results;
}

/**
 * Smart Azure OpenAI configuration resolver.
 * Handles:
 * 1. Azure OpenAI v1-compatible endpoint (e.g. https://<resource>.openai.azure.com/openai/v1)
 * 2. Azure AI Foundry / Project endpoint (e.g. https://<resource>.services.ai.azure.com/api/projects/proj-default)
 * 3. Full Azure completion URL (auto-extracts host, path, deployment, api-version)
 * 4. Classic Azure OpenAI endpoint (https://<resource>.openai.azure.com)
 */
async function resolveAzureConfig(endpoint, apiKey, explicitDeployment, explicitVersion) {
  let urlStr = (endpoint || '').trim();
  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = `https://${urlStr}`;
  }
  const parsed = new URL(urlStr);

  let deployment = explicitDeployment || null;
  let apiVersion = explicitVersion || parsed.searchParams.get('api-version') || '2024-06-01';

  // Check special endpoint types
  const isV1Endpoint = parsed.pathname.includes('/openai/v1') || parsed.pathname.endsWith('/v1');
  const isProjectEndpoint = parsed.hostname.includes('services.ai.azure.com') || parsed.pathname.includes('/api/projects/');

  // 1. OpenAI v1-compatible endpoint (e.g. openai.azure.com/openai/v1)
  if (isV1Endpoint) {
    const basePath = parsed.pathname.replace(/\/chat\/completions.*/, '').replace(/\/$/, '');
    const cleanPath = basePath.includes('/openai/v1') ? basePath : (basePath.endsWith('/v1') ? basePath : `${basePath}/openai/v1`);
    const requestPath = `${cleanPath}/chat/completions${parsed.search || ''}`;
    return {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: requestPath,
      isV1Style: true,
      deployment: deployment || 'default',
      apiVersion
    };
  }

  // 2. Azure AI Foundry Project endpoint (e.g. services.ai.azure.com/api/projects/proj-default)
  if (isProjectEndpoint) {
    const basePath = parsed.pathname.replace(/\/chat\/completions.*/, '').replace(/\/$/, '');
    const requestPath = `${basePath}/chat/completions${parsed.search || ''}`;
    return {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: requestPath,
      isV1Style: true,
      deployment: deployment || 'default',
      apiVersion
    };
  }

  // 3. Classic Azure OpenAI deployments endpoint:
  // If deployment name is embedded in pathname: /openai/deployments/([^/]+)
  const match = parsed.pathname.match(/\/openai\/deployments\/([^/]+)/);
  if (match && match[1]) {
    deployment = decodeURIComponent(match[1]);
  }

  // If no deployment is specified, try auto-discovering from Azure deployments API
  if (!deployment) {
    try {
      const discovered = await discoverAzureDeployments(endpoint, apiKey, apiVersion);
      if (discovered && discovered.length > 0) {
        deployment = discovered[0];
      }
    } catch (_) {}
  }

  if (!deployment) {
    deployment = 'gpt-4o';
  }

  // Construct canonical path
  let requestPath = '';
  if (parsed.pathname.includes('/chat/completions')) {
    requestPath = parsed.pathname + (parsed.search || `?api-version=${encodeURIComponent(apiVersion)}`);
  } else {
    const basePath = parsed.pathname.replace(/\/openai\/deployments\/[^/]+.*/, '').replace(/\/$/, '');
    requestPath = `${basePath}/openai/deployments/${encodeURIComponent(deployment)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;
  }

  return {
    hostname: parsed.hostname,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    path: requestPath,
    isV1Style: false,
    deployment,
    apiVersion
  };
}

/**
 * Call Azure OpenAI REST API
 */
async function callAzureOpenAI(promptText, endpoint, apiKey, deploymentName, apiVersion) {
  let candidates = [];
  if (deploymentName) {
    candidates = [deploymentName];
  } else {
    if (cachedWorkingDeployment) {
      candidates.push(cachedWorkingDeployment);
    }
    try {
      const discovered = await discoverAzureDeployments(endpoint, apiKey, apiVersion);
      if (discovered && discovered.length > 0) {
        candidates.push(...discovered);
      }
    } catch (_) {}
    candidates.push('gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-35-turbo', 'Phi-3-mini-4k-instruct', 'Phi-3.5-mini-instruct');
    candidates = Array.from(new Set(candidates.filter(Boolean)));
  }

  let lastError = null;

  for (const candidate of candidates) {
    try {
      const config = await resolveAzureConfig(endpoint, apiKey, candidate, apiVersion);

      const options = {
        hostname: config.hostname,
        port: config.port,
        path: config.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
          'Authorization': `Bearer ${apiKey}`
        }
      };

      const payload = {
        model: config.deployment,
        messages: [
          { role: 'system', content: EVALUATION_SYSTEM_PROMPT },
          { role: 'user', content: promptText }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      };

      let res = await makeJsonRequest(options, payload);

      // Retry without response_format if model does not support it
      if (res.status === 400 && res.data && JSON.stringify(res.data).includes('response_format')) {
        delete payload.response_format;
        res = await makeJsonRequest(options, payload);
      }

      if (res.status === 200 && res.data && res.data.choices && res.data.choices[0]) {
        const content = res.data.choices[0].message.content;
        cachedWorkingDeployment = config.deployment;
        try {
          return { data: JSON.parse(content), deployment: config.deployment };
        } catch (_) {
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            return { data: JSON.parse(match[0]), deployment: config.deployment };
          }
          throw new Error('Could not parse JSON report from model response.');
        }
      }

      if (res.status === 404 && !deploymentName) {
        lastError = new Error(`Azure OpenAI returned error (404) for model "${candidate}": ${JSON.stringify(res.data)}`);
        continue;
      }

      throw new Error(`Azure OpenAI API returned error (${res.status}): ${JSON.stringify(res.data)}`);
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('404') && !deploymentName) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error(`Azure OpenAI API returned error (404): Resource not found. Please set AZURE_OPENAI_DEPLOYMENT_NAME or AZURE_OPENAI_MODEL in Cloud Run to your deployed model name.`);
}

/**
 * Master Evaluation Generator
 */
async function generateEvaluationReport(sessionData) {
  const userPrompt = buildEvaluationUserPrompt(sessionData);
  const provider = getResolvedProvider();

  // Azure OpenAI Provider
  if (provider === 'azure' && (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY)) {
    try {
      const { apiKey, endpoint, deployment, version } = getAzureEnvConfig();

      if (!endpoint) {
        throw new Error('AZURE_OPENAI_ENDPOINT is not configured.');
      }

      const { data, deployment: activeDeployment } = await callAzureOpenAI(userPrompt, endpoint, apiKey, deployment, version);
      data.provider = `Azure OpenAI (${activeDeployment})`;
      return data;
    } catch (err) {
      console.error(`[AI Evaluator] Azure OpenAI call failed (${err.message}). Falling back to heuristic engine.`);
    }
  }

  // Gemini
  if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
    try {
      const report = await callGemini(userPrompt, process.env.GEMINI_API_KEY);
      report.provider = 'Gemini 1.5';
      return report;
    } catch (err) {
      console.error(`[AI Evaluator] Gemini call failed (${err.message}). Falling back to heuristic engine.`);
    }
  }

  // OpenAI
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      const report = await callOpenAI(userPrompt, process.env.OPENAI_API_KEY);
      report.provider = 'OpenAI';
      return report;
    } catch (err) {
      console.error(`[AI Evaluator] OpenAI call failed (${err.message}). Falling back to heuristic engine.`);
    }
  }

  // Anthropic
  if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    try {
      const report = await callAnthropic(userPrompt, process.env.ANTHROPIC_API_KEY);
      report.provider = 'Anthropic Claude';
      return report;
    } catch (err) {
      console.error(`[AI Evaluator] Anthropic call failed (${err.message}). Falling back to heuristic engine.`);
    }
  }

  // Default / Offline Heuristic Analyzer
  const heuristicReport = generateHeuristicReport(sessionData);
  heuristicReport.provider = 'Deterministic Heuristic Engine (Offline)';
  return heuristicReport;
}

const MENTOR_SYSTEM_PROMPT = `You are a Principal Software Engineer and Staff Technical Interviewer acting as an AI Mentor on a live coding interview platform.
The candidate may ask for hints, advice on time/space complexity, Python functions/idioms, or debugging assistance.
Rules:
1. Provide concise, clear, and instructive answers.
2. If the user asks for a hint, provide progressive guidance without giving away the complete solution immediately unless they explicitly ask for the full solution.
3. If they ask about complexity, explain the theoretical Big-O with optimal tradeoffs.
4. Keep Python snippets idiomatic, clean, and well-commented.`;

/**
 * Call Azure OpenAI Chat Completion for interactive questions
 */
async function callAzureChat(messages, endpoint, apiKey, deploymentName, apiVersion) {
  let candidates = [];
  if (deploymentName) {
    candidates = [deploymentName];
  } else {
    if (cachedWorkingDeployment) {
      candidates.push(cachedWorkingDeployment);
    }
    try {
      const discovered = await discoverAzureDeployments(endpoint, apiKey, apiVersion);
      if (discovered && discovered.length > 0) {
        candidates.push(...discovered);
      }
    } catch (_) {}
    candidates.push('gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-35-turbo', 'Phi-3-mini-4k-instruct', 'Phi-3.5-mini-instruct');
    candidates = Array.from(new Set(candidates.filter(Boolean)));
  }

  let lastError = null;

  for (const candidate of candidates) {
    try {
      const config = await resolveAzureConfig(endpoint, apiKey, candidate, apiVersion);

      const options = {
        hostname: config.hostname,
        port: config.port,
        path: config.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
          'Authorization': `Bearer ${apiKey}`
        }
      };

      const payload = {
        model: config.deployment,
        messages,
        temperature: 0.3,
        max_tokens: 1200
      };

      const res = await makeJsonRequest(options, payload);
      if (res.status === 200 && res.data && res.data.choices && res.data.choices[0]) {
        cachedWorkingDeployment = config.deployment;
        return { text: res.data.choices[0].message.content, deployment: config.deployment };
      }

      if (res.status === 404 && !deploymentName) {
        lastError = new Error(`Azure OpenAI chat returned error (404) for model "${candidate}": ${JSON.stringify(res.data)}`);
        continue;
      }

      throw new Error(`Azure OpenAI chat returned error (${res.status}): ${JSON.stringify(res.data)}`);
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('404') && !deploymentName) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error(`Azure OpenAI chat returned error (404): Resource not found. Please set AZURE_OPENAI_DEPLOYMENT_NAME or AZURE_OPENAI_MODEL in Cloud Run to your deployed model name.`);
}

/**
 * Call Gemini text chat
 */
async function callGeminiChat(promptText, apiKey) {
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };

  const payload = {
    contents: [
      {
        parts: [
          { text: `${MENTOR_SYSTEM_PROMPT}\n\n${promptText}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1200
    }
  };

  const res = await makeJsonRequest(options, payload);
  if (res.status === 200 && res.data && res.data.candidates && res.data.candidates[0]) {
    return res.data.candidates[0].content.parts[0].text;
  }
  throw new Error(`Gemini API returned error: ${JSON.stringify(res.data)}`);
}

/**
 * Call OpenAI text chat
 */
async function callOpenAIChat(messages, apiKey) {
  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  };

  const payload = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.3,
    max_tokens: 1200
  };

  const res = await makeJsonRequest(options, payload);
  if (res.status === 200 && res.data && res.data.choices && res.data.choices[0]) {
    return res.data.choices[0].message.content;
  }
  throw new Error(`OpenAI API returned error: ${JSON.stringify(res.data)}`);
}

/**
 * Responsive offline mentor response generator
 */
function generateOfflineMentorResponse({ question, problem, code, language = 'python' }) {
  const q = (question || '').toLowerCase().trim();
  const title = problem ? problem.title : 'this problem';
  const targetTime = problem?.optimalComplexity?.time || problem?.targetComplexity?.time || 'O(N)';
  const targetSpace = problem?.optimalComplexity?.space || problem?.targetComplexity?.space || 'O(1)';
  const category = problem?.category || 'Algorithms';

  // 1. Solution request
  if (q.includes('solution') || q.includes('answer') || q.includes('full code')) {
    return `### Editorial Walkthrough for ${title}

To view the complete optimal solution and line-by-line algorithm breakdown, click the **Solution** button in the workspace toolbar above your editor.

Optimal Complexity:
- Time: \`${targetTime}\`
- Space: \`${targetSpace}\`

Try sketching the optimal approach before viewing the full solution!`;
  }

  // 2. Complexity inquiry
  if (q.includes('complexity') || q.includes('big o') || q.includes('runtime') || q.includes('space') || q.includes('time')) {
    return `### Complexity Target for ${title}

- **Target Time Complexity**: \`${targetTime}\`
- **Target Space Complexity**: \`${targetSpace}\`
- **Core Topic**: ${category}

Technical Guidance:
- If you use nested loops over an input of size N, the runtime is O(N^2), which usually times out on large test suites.
- By storing elements in a hash map or dictionary, lookups take O(1) time on average, allowing you to solve this in a single linear pass (\`${targetTime}\`).`;
  }

  // 3. Code review / correctness inquiry
  if (q.includes('my code') || q.includes('correct') || q.includes('review') || q.includes('check') || q.includes('working') || q.includes('fail') || q.includes('error') || q.includes('bug')) {
    const codeSnippet = (code || '').trim();
    if (!codeSnippet || codeSnippet.length < 25) {
      return `### Code Review: Initial Setup

You haven't written much code in the editor yet.
Here is how to get started on **${title}**:
1. Check the function arguments and return type.
2. Initialize your state (e.g. an empty dictionary or pointers).
3. Loop through the input array once, checking your target condition.

Write your initial draft in the editor and ask me again to inspect your implementation!`;
    }

    const hasLoop = codeSnippet.includes('for ') || codeSnippet.includes('while ');
    const hasDict = codeSnippet.includes('{') || codeSnippet.includes('dict(') || codeSnippet.includes('Map(');
    const hasTwoPointers = codeSnippet.includes('left') || codeSnippet.includes('right') || codeSnippet.includes('low') || codeSnippet.includes('high');

    let observations = [];
    if (hasLoop) {
      observations.push('You have an iteration loop in place.');
    }
    if (hasDict) {
      observations.push('You are using a hash map or dictionary to store visited values, which is the key to optimal lookup.');
    }
    if (hasTwoPointers) {
      observations.push('You are using pointer variables to scan boundaries.');
    }

    return `### Code Inspection for ${title}

${observations.length > 0 ? observations.join(' ') : 'You have started your implementation.'}

Key checkpoints to verify:
1. **Edge Cases**: Does your code handle empty inputs, single-element inputs, or negative numbers?
2. **Duplication**: Ensure you do not use the exact same element index twice.
3. **Execution**: Click **Run Tests** in the toolbar to run your code against the test harness and inspect the terminal output.`;
  }

  // 4. Starting guidance, hint, approach, or default
  return `### Strategic Hint for ${title} (${category})

**Core Objective**:
Solve this problem within **${targetTime}** time and **${targetSpace}** space complexity.

**Progressive Guidance**:
1. **Identify the complement or state**: For each element you visit, determine what matching value or state you need to find.
2. **Avoid repeated linear scans**: Instead of scanning backwards with an inner loop (which causes O(N^2) slowdown), store seen elements in a hash map.
3. **Lookup in O(1)**: As you iterate forward, check if your target complement is already in your lookup table. If yes, you found the answer; if no, save the current element.

Write this logic in your editor and click **Run Tests** to verify your solution!`;
}

/**
 * Master AI Mentor Entry Point
 */
async function askAiMentor({ question, problem, code, language = 'python', chatHistory = [] }) {
  const promptContext = `CURRENT INTERVIEW CONTEXT:
Problem: ${problem ? problem.title : 'General Coding'}
Category: ${problem ? problem.category : 'General'}
Target Complexity: Time ${problem?.optimalComplexity?.time || problem?.targetComplexity?.time || 'O(N)'}, Space ${problem?.optimalComplexity?.space || problem?.targetComplexity?.space || 'O(1)'}
Language: ${language}

CANDIDATE CURRENT CODE:
\`\`\`${language}
${code || '# No code written yet'}
\`\`\`

CANDIDATE QUESTION:
${question}`;

  const messages = [
    { role: 'system', content: MENTOR_SYSTEM_PROMPT }
  ];

  if (Array.isArray(chatHistory)) {
    for (const h of chatHistory.slice(-4)) {
      if (h.role && h.content) messages.push({ role: h.role, content: h.content });
    }
  }

  messages.push({ role: 'user', content: promptContext });

  const provider = getResolvedProvider();

  // Azure OpenAI
  if (provider === 'azure' && (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY)) {
    try {
      const { apiKey, endpoint, deployment, version } = getAzureEnvConfig();

      if (endpoint) {
        const { text, deployment: activeDeployment } = await callAzureChat(messages, endpoint, apiKey, deployment, version);
        return { text, provider: `Azure OpenAI (${activeDeployment})` };
      } else {
        console.warn('[AI Mentor] AZURE_OPENAI_ENDPOINT is not defined.');
      }
    } catch (err) {
      console.error(`[AI Mentor] Azure chat failed (${err.message}). Falling back to heuristic engine.`);
    }
  }

  // Gemini
  if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
    try {
      const text = await callGeminiChat(promptContext, process.env.GEMINI_API_KEY);
      return { text, provider: 'Gemini 1.5' };
    } catch (err) {
      console.error(`[AI Mentor] Gemini chat failed (${err.message}). Falling back to heuristic engine.`);
    }
  }

  // OpenAI
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      const text = await callOpenAIChat(messages, process.env.OPENAI_API_KEY);
      return { text, provider: 'OpenAI GPT-4o-mini' };
    } catch (err) {
      console.error(`[AI Mentor] OpenAI chat failed (${err.message}). Falling back to heuristic engine.`);
    }
  }

  // Offline Heuristic Fallback
  const offlineText = generateOfflineMentorResponse({ question, problem, code, language });
  return { text: offlineText, provider: 'AI Mentor (Offline Engine)' };
}

module.exports = {
  generateEvaluationReport,
  askAiMentor
};
