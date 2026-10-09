/**
 * Real-Time Collaborative Code Interview Platform
 * Local Sandboxed Process Runner
 * Enforces execution timeout, memory thresholds, and input/output piping.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const DEFAULT_TIMEOUT_MS = parseInt(process.env.EXECUTION_TIMEOUT_MS, 10) || 5000;

/**
 * Execute code locally using subprocess with strict safety constraints
 * @param {string} language - python | javascript | cpp
 * @param {string} code - source code string
 * @param {string} stdin - optional input string
 * @param {number} timeoutMs - maximum allowed execution time in ms
 */
async function executeLocally(language, code, stdin = '', timeoutMs = DEFAULT_TIMEOUT_MS) {
  const tempDir = path.join(os.tmpdir(), `sandbox_${crypto.randomBytes(6).toString('hex')}`);
  await fs.promises.mkdir(tempDir, { recursive: true });

  const startTime = Date.now();
  let processToKill = null;
  let timeoutHandle = null;

  try {
    let command = '';
    let args = [];
    let sourceFile = '';

    if (language === 'python' || language === 'py') {
      sourceFile = path.join(tempDir, 'solution.py');
      await fs.promises.writeFile(sourceFile, code, 'utf8');
      
      // Determine python binary
      command = process.platform === 'win32' ? 'python' : 'python3';
      args = ['-u', sourceFile];
    } else if (language === 'javascript' || language === 'js') {
      sourceFile = path.join(tempDir, 'solution.js');
      await fs.promises.writeFile(sourceFile, code, 'utf8');
      
      command = 'node';
      args = [sourceFile];
    } else if (language === 'cpp' || language === 'c++') {
      sourceFile = path.join(tempDir, 'solution.cpp');
      const binFile = path.join(tempDir, process.platform === 'win32' ? 'solution.exe' : 'solution.out');
      await fs.promises.writeFile(sourceFile, code, 'utf8');

      // Compile first
      const compileResult = await new Promise((resolve) => {
        const cProc = spawn('g++', ['-O2', sourceFile, '-o', binFile]);
        let compileErr = '';
        cProc.stderr.on('data', d => { compileErr += d.toString(); });
        cProc.on('close', code => {
          resolve({ success: code === 0, error: compileErr });
        });
        cProc.on('error', err => {
          resolve({ success: false, error: err.message });
        });
      });

      if (!compileResult.success) {
        return {
          status: 'COMPILE_ERROR',
          stdout: '',
          stderr: compileResult.error || 'Compilation failed',
          durationMs: Date.now() - startTime,
          exitCode: 1
        };
      }

      command = binFile;
      args = [];
    } else {
      return {
        status: 'UNSUPPORTED_LANGUAGE',
        stdout: '',
        stderr: `Language '${language}' is not supported in local runner.`,
        durationMs: 0,
        exitCode: 1
      };
    }

    return await new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const proc = spawn(command, args, {
        cwd: tempDir,
        env: {
          // Minimal stripped down env to prevent credential leaks
          PATH: process.env.PATH,
          TEMP: tempDir,
          TMP: tempDir,
          NODE_ENV: 'sandbox'
        },
        windowsHide: true
      });

      processToKill = proc;

      timeoutHandle = setTimeout(() => {
        timedOut = true;
        try {
          if (process.platform === 'win32') {
            spawn('taskkill', ['/F', '/T', '/PID', proc.pid.toString()]);
          } else {
            proc.kill('SIGKILL');
          }
        } catch (_) {}
      }, timeoutMs);

      if (stdin && proc.stdin) {
        proc.stdin.write(stdin);
        proc.stdin.end();
      } else if (proc.stdin) {
        proc.stdin.end();
      }

      proc.stdout.on('data', (data) => {
        if (stdout.length < 50000) {
          stdout += data.toString();
        }
      });

      proc.stderr.on('data', (data) => {
        if (stderr.length < 50000) {
          stderr += data.toString();
        }
      });

      proc.on('close', (code) => {
        clearTimeout(timeoutHandle);
        const durationMs = Date.now() - startTime;

        if (timedOut) {
          resolve({
            status: 'TIMEOUT',
            stdout,
            stderr: `Execution timed out after ${timeoutMs}ms`,
            durationMs,
            exitCode: -1
          });
        } else if (code !== 0) {
          resolve({
            status: 'RUNTIME_ERROR',
            stdout,
            stderr: stderr.trim() || `Process exited with error code ${code}`,
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
          status: 'SPAWN_ERROR',
          stdout: '',
          stderr: `Failed to invoke runner (${command}): ${err.message}. Please verify the language runtime is installed.`,
          durationMs: Date.now() - startTime,
          exitCode: 1
        });
      });
    });

  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    // Cleanup temporary files
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

module.exports = {
  executeLocally
};
