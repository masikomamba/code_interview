/**
 * Real-Time Collaborative Code Interview Platform
 * Database Service: PostgreSQL Adapter with Resilient Local File Fallback
 * Guarantees cross-device progress synchronization and streak persistence.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATABASE_URL = process.env.DATABASE_URL;
let pgPool = null;

// Local persistent file fallback path
const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_STORE_FILE = path.join(DATA_DIR, 'user_progress.json');
const LOCAL_USERS_FILE = path.join(DATA_DIR, 'users.json');

/**
 * Password Hashing & Verification Utilities
 */
function hashPassword(password, salt = null) {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, chosenSalt, 64).toString('hex');
  return { hash, salt: chosenSalt };
}

function verifyPassword(password, hash, salt) {
  try {
    const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
  } catch (_) {
    return false;
  }
}

/**
 * Initialize Database Connection and Schemas
 */
async function initDatabase() {
  if (DATABASE_URL) {
    try {
      let pg;
      try {
        pg = require('pg');
      } catch (e) {
        console.warn('[DB] "pg" module not installed, falling back to local persistent store.');
        return initLocalStore();
      }

      pgPool = new pg.Pool({
        connectionString: DATABASE_URL,
        ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
      });

      // Test connection and auto-migrate tables
      const client = await pgPool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT,
            salt TEXT,
            display_name VARCHAR(120),
            email VARCHAR(180),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS salt TEXT;
          ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(120);
          ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(180);

          CREATE TABLE IF NOT EXISTS user_sessions (
            token VARCHAR(128) PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            username VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            expires_at BIGINT NOT NULL
          );

          CREATE TABLE IF NOT EXISTS user_progress (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            solved_problem_ids TEXT[] DEFAULT '{}',
            attempted_problem_ids TEXT[] DEFAULT '{}',
            streak_days INTEGER DEFAULT 1,
            last_practice_timestamp BIGINT NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS interview_reports (
            id SERIAL PRIMARY KEY,
            room_id VARCHAR(100),
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            problem_id VARCHAR(100),
            recommendation VARCHAR(50),
            overall_score NUMERIC(3, 1),
            report_data JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('[DB] Connected to PostgreSQL. Database schemas verified.');
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn(`[DB] Failed to connect to PostgreSQL (${err.message}). Falling back to local file store.`);
      pgPool = null;
      initLocalStore();
    }
  } else {
    initLocalStore();
  }
}

/**
 * Local File Storage Helpers
 */
function initLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_STORE_FILE)) {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify({}), 'utf8');
  }
  if (!fs.existsSync(LOCAL_USERS_FILE)) {
    const demo = hashPassword('demo123');
    const initialUsers = {
      users: {
        masiko: {
          username: 'masiko',
          displayName: 'Masiko',
          email: 'masiko@codeinterview.dev',
          passwordHash: demo.hash,
          salt: demo.salt,
          createdAt: Date.now()
        }
      },
      sessions: {}
    };
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf8');
  }
  console.log(`[DB] Using local persistent JSON store: ${LOCAL_STORE_FILE}`);
}

function readLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, 'utf8') || '{}');
    }
  } catch (_) {}
  return {};
}

function writeLocalStore(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error writing local store:', err);
  }
}

function readUsersStore() {
  try {
    if (fs.existsSync(LOCAL_USERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_USERS_FILE, 'utf8') || '{}');
      return {
        users: data.users || {},
        sessions: data.sessions || {}
      };
    }
  } catch (_) {}
  return { users: {}, sessions: {} };
}

function writeUsersStore(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error writing users store:', err);
  }
}

/**
 * Register a new User Account
 */
async function registerUser({ username, password, displayName, email }) {
  const cleanUsername = (username || '').trim().toLowerCase();
  if (!cleanUsername || !/^[a-zA-Z0-9_-]{3,30}$/.test(cleanUsername)) {
    throw new Error('Username must be 3-30 characters long and contain only letters, numbers, hyphens, or underscores.');
  }

  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  const cleanDisplayName = (displayName || cleanUsername).trim();
  const cleanEmail = (email || '').trim().toLowerCase();
  const { hash, salt } = hashPassword(password);
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  if (pgPool) {
    try {
      const exists = await pgPool.query('SELECT id FROM users WHERE username = $1', [cleanUsername]);
      if (exists.rows.length > 0) {
        throw new Error('Username already exists. Please choose a different username.');
      }

      const insertRes = await pgPool.query(
        'INSERT INTO users (username, password_hash, salt, display_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [cleanUsername, hash, salt, cleanDisplayName, cleanEmail]
      );
      const userId = insertRes.rows[0].id;

      // Create session
      await pgPool.query(
        'INSERT INTO user_sessions (token, user_id, username, expires_at) VALUES ($1, $2, $3, $4)',
        [sessionToken, userId, cleanUsername, expiresAt]
      );

      // Create initial progress record
      await pgPool.query(`
        INSERT INTO user_progress (user_id, solved_problem_ids, attempted_problem_ids, streak_days, last_practice_timestamp)
        VALUES ($1, '{}', '{}', 1, $2)
        ON CONFLICT (user_id) DO NOTHING
      `, [userId, Date.now()]);

      return {
        token: sessionToken,
        user: {
          username: cleanUsername,
          displayName: cleanDisplayName,
          email: cleanEmail
        }
      };
    } catch (err) {
      if (err.message.includes('already exists') || err.code === '23505') {
        throw new Error('Username already exists. Please choose a different username.');
      }
      throw err;
    }
  }

  // Local JSON fallback
  const store = readUsersStore();
  if (store.users[cleanUsername]) {
    throw new Error('Username already exists. Please choose a different username.');
  }

  store.users[cleanUsername] = {
    username: cleanUsername,
    displayName: cleanDisplayName,
    email: cleanEmail,
    passwordHash: hash,
    salt,
    createdAt: Date.now()
  };

  store.sessions[sessionToken] = {
    username: cleanUsername,
    expiresAt
  };

  writeUsersStore(store);

  // Initialize progress in local progress store
  const progStore = readLocalStore();
  if (!progStore[cleanUsername]) {
    progStore[cleanUsername] = {
      username: cleanUsername,
      solvedProblemIds: [],
      attemptedProblemIds: [],
      streakDays: 1,
      lastPracticeTimestamp: Date.now()
    };
    writeLocalStore(progStore);
  }

  return {
    token: sessionToken,
    user: {
      username: cleanUsername,
      displayName: cleanDisplayName,
      email: cleanEmail
    }
  };
}

/**
 * Authenticate User Login
 */
async function loginUser({ username, password }) {
  const cleanUsername = (username || '').trim().toLowerCase();
  if (!cleanUsername || !password) {
    throw new Error('Username and password are required.');
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

  if (pgPool) {
    const userRes = await pgPool.query(
      'SELECT id, username, password_hash, salt, display_name, email FROM users WHERE username = $1',
      [cleanUsername]
    );
    if (userRes.rows.length === 0) {
      throw new Error('Invalid username or password.');
    }
    const user = userRes.rows[0];

    // If password was never set (legacy account), set it now
    if (!user.password_hash) {
      const { hash, salt } = hashPassword(password);
      await pgPool.query('UPDATE users SET password_hash = $1, salt = $2 WHERE id = $3', [hash, salt, user.id]);
    } else {
      const valid = verifyPassword(password, user.password_hash, user.salt);
      if (!valid) {
        throw new Error('Invalid username or password.');
      }
    }

    await pgPool.query(
      'INSERT INTO user_sessions (token, user_id, username, expires_at) VALUES ($1, $2, $3, $4)',
      [sessionToken, user.id, user.username, expiresAt]
    );

    return {
      token: sessionToken,
      user: {
        username: user.username,
        displayName: user.display_name || user.username,
        email: user.email || ''
      }
    };
  }

  // Local store fallback
  const store = readUsersStore();
  const user = store.users[cleanUsername];
  if (!user) {
    throw new Error('Invalid username or password.');
  }

  if (user.passwordHash && user.salt) {
    const valid = verifyPassword(password, user.passwordHash, user.salt);
    if (!valid) {
      throw new Error('Invalid username or password.');
    }
  } else {
    // Save password for legacy account
    const { hash, salt } = hashPassword(password);
    user.passwordHash = hash;
    user.salt = salt;
  }

  store.sessions[sessionToken] = {
    username: user.username,
    expiresAt
  };
  writeUsersStore(store);

  return {
    token: sessionToken,
    user: {
      username: user.username,
      displayName: user.displayName || user.username,
      email: user.email || ''
    }
  };
}

/**
 * Get User Profile from Session Token
 */
async function getUserBySession(token) {
  if (!token) return null;

  if (pgPool) {
    try {
      const res = await pgPool.query(`
        SELECT u.username, u.display_name, u.email, s.expires_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = $1
      `, [token]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        if (parseInt(row.expires_at, 10) > Date.now()) {
          return {
            username: row.username,
            displayName: row.display_name || row.username,
            email: row.email || ''
          };
        }
      }
    } catch (err) {
      console.warn('[DB] Session lookup error:', err.message);
    }
    return null;
  }

  const store = readUsersStore();
  const session = store.sessions[token];
  if (session && session.expiresAt > Date.now()) {
    const user = store.users[session.username];
    if (user) {
      return {
        username: user.username,
        displayName: user.displayName || user.username,
        email: user.email || ''
      };
    }
  }
  return null;
}

/**
 * Logout Session
 */
async function logoutSession(token) {
  if (!token) return true;
  if (pgPool) {
    try {
      await pgPool.query('DELETE FROM user_sessions WHERE token = $1', [token]);
    } catch (_) {}
    return true;
  }

  const store = readUsersStore();
  if (store.sessions[token]) {
    delete store.sessions[token];
    writeUsersStore(store);
  }
  return true;
}

/**
 * Get or Create User Progress
 * @param {string} username - e.g. 'masiko'
 */
async function getUserProgress(username = 'masiko') {
  const cleanUsername = (username || 'masiko').trim().toLowerCase();

  if (pgPool) {
    try {
      // 1. Ensure user exists
      let userRes = await pgPool.query('SELECT id FROM users WHERE username = $1', [cleanUsername]);
      let userId;
      if (userRes.rows.length === 0) {
        const insertUser = await pgPool.query('INSERT INTO users (username) VALUES ($1) RETURNING id', [cleanUsername]);
        userId = insertUser.rows[0].id;
        // Create initial progress record
        await pgPool.query(`
          INSERT INTO user_progress (user_id, solved_problem_ids, attempted_problem_ids, streak_days, last_practice_timestamp)
          VALUES ($1, '{}', '{}', 1, $2)
        `, [userId, Date.now()]);
      } else {
        userId = userRes.rows[0].id;
      }

      // 2. Fetch progress
      const progRes = await pgPool.query(`
        SELECT solved_problem_ids, attempted_problem_ids, streak_days, last_practice_timestamp
        FROM user_progress WHERE user_id = $1
      `, [userId]);

      if (progRes.rows.length > 0) {
        const row = progRes.rows[0];
        const lastPractice = parseInt(row.last_practice_timestamp, 10) || Date.now();
        const daysSince = Math.floor((Date.now() - lastPractice) / (1000 * 60 * 60 * 24));
        return {
          username: cleanUsername,
          solvedProblemIds: row.solved_problem_ids || [],
          attemptedProblemIds: row.attempted_problem_ids || [],
          streakDays: row.streak_days || 1,
          lastPracticeTimestamp: lastPractice,
          daysSinceLastPractice: daysSince,
          needsReminder: daysSince >= 3
        };
      }
    } catch (err) {
      console.error('[DB] PostgreSQL error in getUserProgress:', err.message);
    }
  }

  // Local file fallback
  const store = readLocalStore();
  if (!store[cleanUsername]) {
    store[cleanUsername] = {
      username: cleanUsername,
      solvedProblemIds: [],
      attemptedProblemIds: [],
      streakDays: 1,
      lastPracticeTimestamp: Date.now()
    };
    writeLocalStore(store);
  }

  const userProg = store[cleanUsername];
  const daysSince = Math.floor((Date.now() - userProg.lastPracticeTimestamp) / (1000 * 60 * 60 * 24));
  return {
    ...userProg,
    daysSinceLastPractice: daysSince,
    needsReminder: daysSince >= 3
  };
}

/**
 * Record User Practice Activity
 */
async function recordUserActivity(username = 'masiko', problemId = null, status = 'attempted') {
  const cleanUsername = (username || 'masiko').trim().toLowerCase();
  const now = Date.now();

  const current = await getUserProgress(cleanUsername);

  // Compute new streak
  let newStreak = current.streakDays;
  if (current.daysSinceLastPractice === 1) {
    newStreak += 1;
  } else if (current.daysSinceLastPractice > 1) {
    newStreak = 1;
  }

  const solvedSet = new Set(current.solvedProblemIds);
  const attemptedSet = new Set(current.attemptedProblemIds);

  if (problemId) {
    if (status === 'solved') {
      solvedSet.add(problemId);
    } else {
      attemptedSet.add(problemId);
    }
  }

  const updatedSolved = Array.from(solvedSet);
  const updatedAttempted = Array.from(attemptedSet);

  if (pgPool) {
    try {
      const userRes = await pgPool.query('SELECT id FROM users WHERE username = $1', [cleanUsername]);
      if (userRes.rows.length > 0) {
        const userId = userRes.rows[0].id;
        await pgPool.query(`
          UPDATE user_progress
          SET solved_problem_ids = $1,
              attempted_problem_ids = $2,
              streak_days = $3,
              last_practice_timestamp = $4,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $5
        `, [updatedSolved, updatedAttempted, newStreak, now, userId]);

        return {
          username: cleanUsername,
          solvedProblemIds: updatedSolved,
          attemptedProblemIds: updatedAttempted,
          streakDays: newStreak,
          lastPracticeTimestamp: now,
          daysSinceLastPractice: 0,
          needsReminder: false
        };
      }
    } catch (err) {
      console.error('[DB] PostgreSQL error in recordUserActivity:', err.message);
    }
  }

  // Local fallback
  const store = readLocalStore();
  store[cleanUsername] = {
    username: cleanUsername,
    solvedProblemIds: updatedSolved,
    attemptedProblemIds: updatedAttempted,
    streakDays: newStreak,
    lastPracticeTimestamp: now
  };
  writeLocalStore(store);

  return {
    ...store[cleanUsername],
    daysSinceLastPractice: 0,
    needsReminder: false
  };
}

module.exports = {
  initDatabase,
  getUserProgress,
  recordUserActivity,
  registerUser,
  loginUser,
  getUserBySession,
  logoutSession
};
