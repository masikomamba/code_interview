/**
 * Real-Time Collaborative Code Interview Platform
 * Docker Containerized Sandboxed Runner
 * Spawns isolated ephemeral containers with zero network access and strict resource caps.
 */

const { spawn } = require('child_process');

const MEMORY_LIMIT = process.env.CONTAINER_MEMORY_LIMIT || '128m';
const CPU_QUOTA = process.env.CONTAINER_CPU_QUOTA || '0.5';
const DEFAULT_TIMEOUT_MS = parseInt(process.env.EXECUTION_TIMEOUT_MS, 10) || 5000;

// Language container image mapping
const DOCKER_IMAGES = {
  python: 'python:3.11-alpine',
  javascript: 'node:20-alpine',
  cpp: 'gcc:latest'
};

/**
 * Check if Docker daemon is responsive
 */
async function isDockerAvailable() {
  return new Promise((resolve) => {
    const proc = spawn('docker', ['version'], { windowsHide: true });
    proc.on('close', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}

/**
 * Execute user code inside an ephemeral Docker container
 * @param {string} language - python | javascript | cpp
 * @param {string} code - source code
 * @param {string} stdin - optional input
 * @param {number} timeoutMs - maximum allowed execution time in ms
 */
async function executeInDocker(language, code, stdin = '', timeoutMs = DEFAULT_TIMEOUT_MS) {
  const image = DOCKER_IMAGES[language] || DOCKER_IMAGES.python;
  const startTime = Date.now();

  let dockerArgs = [
    'run',
    '--rm',
    '-i',
    '--net=none', // Completely disable networking for sandbox security
    `--memory=${MEMORY_LIMIT}`,
    `--cpus=${CPU_QUOTA}`,
    '--security-opt=no-new-privileges',
    image
  ];

  if (language === 'python' || language === 'py') {
    dockerArgs.push('python', '-c', code);
  } else if (language === 'javascript' || language === 'js') {
    dockerArgs.push('node', '-e', code);
  } else {
    // Fallback to inline sh execution for compiled languages
    dockerArgs.push('sh', '-c', `echo "${code.replace(/"/g, '\\"')}" > /tmp/run.cpp && g++ /tmp/run.cpp -o /tmp/a.out && /tmp/a.out`);
  }

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const proc = spawn('docker', dockerArgs, { windowsHide: true });

    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
    }, timeoutMs);

    if (stdin && proc.stdin) {
      proc.stdin.write(stdin);
      proc.stdin.end();
    } else if (proc.stdin) {
      proc.stdin.end();
    }

    proc.stdout.on('data', (d) => {
      if (stdout.length < 50000) stdout += d.toString();
    });

    proc.stderr.on('data', (d) => {
      if (stderr.length < 50000) stderr += d.toString();
    });

    proc.on('close', (code) => {
      clearTimeout(timeoutHandle);
      const durationMs = Date.now() - startTime;

      if (timedOut) {
        resolve({
          status: 'TIMEOUT',
          stdout,
          stderr: `Container execution timed out after ${timeoutMs}ms`,
          durationMs,
          exitCode: -1
        });
      } else if (code !== 0) {
        resolve({
          status: 'RUNTIME_ERROR',
          stdout,
          stderr: stderr.trim() || `Container exited with code ${code}`,
          durationMs,
          exitCode: code
        });
      } else {
        resolve({
          status: 'SUCCESS',
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          durationMs,
          exitCode: 0
        });
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timeoutHandle);
      resolve({
        status: 'DOCKER_ERROR',
        stdout: '',
        stderr: `Failed to launch container: ${err.message}`,
        durationMs: Date.now() - startTime,
        exitCode: 1
      });
    });
  });
}

module.exports = {
  isDockerAvailable,
  executeInDocker
};
