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

module.exports = {
  generateEvaluationReport
};
