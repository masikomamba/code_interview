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
          reject(new Error(`Failed to parse JSON response (${res.statusCode}): ${data}`));
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
 * Call Azure OpenAI REST API
 */
async function callAzureOpenAI(promptText, endpoint, apiKey, deploymentName, apiVersion) {
  const urlObj = new URL(endpoint.startsWith('http') ? endpoint : `https://${endpoint}`);
  const basePath = urlObj.pathname.replace(/\/$/, '');
  const path = `${basePath}/openai/deployments/${encodeURIComponent(deploymentName)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    }
  };

  const payload = {
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
  throw new Error(`Azure OpenAI API returned error: ${JSON.stringify(res.data)}`);
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
      const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY;
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_ENDPOINT;
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_DEPLOYMENT_NAME || 'gpt-4o-mini';
      const version = process.env.AZURE_OPENAI_API_VERSION || '2024-06-01';

      if (!endpoint) {
        throw new Error('AZURE_OPENAI_ENDPOINT is not configured.');
      }

      const report = await callAzureOpenAI(userPrompt, endpoint, apiKey, deployment, version);
      report.provider = `Azure OpenAI (${deployment})`;
      return report;
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
  const urlObj = new URL(endpoint.startsWith('http') ? endpoint : `https://${endpoint}`);
  const basePath = urlObj.pathname.replace(/\/$/, '');
  const path = `${basePath}/openai/deployments/${encodeURIComponent(deploymentName)}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey
    }
  };

  const payload = {
    messages,
    temperature: 0.3,
    max_tokens: 1200
  };

  const res = await makeJsonRequest(options, payload);
  if (res.status === 200 && res.data && res.data.choices && res.data.choices[0]) {
    return res.data.choices[0].message.content;
  }
  throw new Error(`Azure OpenAI chat returned error (${res.status}): ${JSON.stringify(res.data)}`);
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
      const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY;
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_ENDPOINT;
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_DEPLOYMENT_NAME || 'gpt-4o-mini';
      const version = process.env.AZURE_OPENAI_API_VERSION || '2024-06-01';

      if (endpoint) {
        const text = await callAzureChat(messages, endpoint, apiKey, deployment, version);
        return { text, provider: `Azure OpenAI (${deployment})` };
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
