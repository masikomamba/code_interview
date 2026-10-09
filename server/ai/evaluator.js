/**
 * Real-Time Collaborative Code Interview Platform
 * AI Evaluation Service: Multi-Provider LLM & Heuristic Router
 */

const https = require('https');
const { EVALUATION_SYSTEM_PROMPT, buildEvaluationUserPrompt } = require('./prompts');
const { generateHeuristicReport } = require('./heuristics');

const PROVIDER = process.env.AI_EVALUATION_PROVIDER || 'heuristic';

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

  // Azure OpenAI Provider
  if (PROVIDER === 'azure' && (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY)) {
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
      console.warn(`[AI Evaluator] Azure OpenAI call failed, falling back to heuristic engine: ${err.message}`);
    }
  }

  // If explicit LLM is configured and API key exists
  if (PROVIDER === 'gemini' && process.env.GEMINI_API_KEY) {
    try {
      const report = await callGemini(userPrompt, process.env.GEMINI_API_KEY);
      report.provider = 'Gemini 1.5';
      return report;
    } catch (err) {
      console.warn(`[AI Evaluator] Gemini call failed, falling back to heuristic engine: ${err.message}`);
    }
  }

  if (PROVIDER === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      const report = await callOpenAI(userPrompt, process.env.OPENAI_API_KEY);
      report.provider = 'OpenAI';
      return report;
    } catch (err) {
      console.warn(`[AI Evaluator] OpenAI call failed, falling back to heuristic engine: ${err.message}`);
    }
  }

  if (PROVIDER === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    try {
      const report = await callAnthropic(userPrompt, process.env.ANTHROPIC_API_KEY);
      report.provider = 'Anthropic Claude';
      return report;
    } catch (err) {
      console.warn(`[AI Evaluator] Anthropic call failed, falling back to heuristic engine: ${err.message}`);
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
 * Offline heuristic mentor response generator
 */
function generateOfflineMentorResponse({ question, problem, code }) {
  const q = (question || '').toLowerCase();
  const title = problem ? problem.title : 'this problem';
  const targetTime = problem?.targetComplexity?.time || 'optimal time';
  const targetSpace = problem?.targetComplexity?.space || 'optimal space';
  const category = problem?.category || 'Algorithms';

  if (q.includes('hint') || q.includes('clue') || q.includes('stuck') || q.includes('approach')) {
    return `### Hint for ${title}\n\nThis problem focuses on **${category}**.\n\nKey Strategy:\n- Consider what state you need to remember as you iterate. Can you store elements in a dictionary/hash map or use two pointers to avoid nested O(N^2) loops?\n- Aim for target complexity: **${targetTime}** time and **${targetSpace}** space.\n\nStart by writing down the brute force approach, then eliminate repeated scans.`;
  }

  if (q.includes('complexity') || q.includes('big o') || q.includes('runtime') || q.includes('space')) {
    return `### Complexity Analysis for ${title}\n\n- **Target Time Complexity**: \`${targetTime}\`\n- **Target Space Complexity**: \`${targetSpace}\`\n\nIf your solution uses nested loops over input length N, it runs in O(N^2). Storing seen elements in a hash map gives O(1) lookup and reduces overall time to O(N).`;
  }

  if (q.includes('solution') || q.includes('answer') || q.includes('solve')) {
    return `To review the verified optimal Python solution and full complexity breakdown, click the **Solution** button in the top toolbar to view the editorial walkthrough.`;
  }

  return `I am your AI Interview Mentor. You can ask me:\n- *"Can you give me a hint on how to start?"*\n- *"What is the optimal time and space complexity?"*\n- *"How do I improve my current approach?"*\n\nAsk your question and I will guide your problem-solving process.`;
}

/**
 * Master AI Mentor Entry Point
 */
async function askAiMentor({ question, problem, code, language = 'python', chatHistory = [] }) {
  const promptContext = `CURRENT INTERVIEW CONTEXT:
Problem: ${problem ? problem.title : 'General Coding'}
Category: ${problem ? problem.category : 'General'}
Target Complexity: Time ${problem?.targetComplexity?.time || 'O(N)'}, Space ${problem?.targetComplexity?.space || 'O(1)'}
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

  // Azure OpenAI
  if (PROVIDER === 'azure' && (process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY)) {
    try {
      const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY;
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_ENDPOINT;
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_DEPLOYMENT_NAME || 'gpt-4o-mini';
      const version = process.env.AZURE_OPENAI_API_VERSION || '2024-06-01';

      if (endpoint) {
        const text = await callAzureChat(messages, endpoint, apiKey, deployment, version);
        return { text, provider: `Azure OpenAI (${deployment})` };
      }
    } catch (err) {
      console.warn(`[AI Mentor] Azure chat failed, falling back: ${err.message}`);
    }
  }

  // Gemini
  if (PROVIDER === 'gemini' && process.env.GEMINI_API_KEY) {
    try {
      const text = await callGeminiChat(promptContext, process.env.GEMINI_API_KEY);
      return { text, provider: 'Gemini 1.5' };
    } catch (err) {
      console.warn(`[AI Mentor] Gemini chat failed, falling back: ${err.message}`);
    }
  }

  // OpenAI
  if (PROVIDER === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      const text = await callOpenAIChat(messages, process.env.OPENAI_API_KEY);
      return { text, provider: 'OpenAI GPT-4o-mini' };
    } catch (err) {
      console.warn(`[AI Mentor] OpenAI chat failed, falling back: ${err.message}`);
    }
  }

  // Offline Heuristic Fallback
  const offlineText = generateOfflineMentorResponse({ question, problem, code });
  return { text: offlineText, provider: 'AI Mentor (Offline Engine)' };
}

module.exports = {
  generateEvaluationReport,
  askAiMentor
};
