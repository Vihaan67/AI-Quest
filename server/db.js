import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'ai_quest.db');
const db = new sqlite3.Database(dbPath);

// Helper function for running async SQL queries
export function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Helper function for getting a single row
export function get(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Helper function for getting all matching rows
export function all(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Initialize tables
export async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_activity_date TEXT,
      knowledge_level TEXT DEFAULT 'beginner',
      goal_role TEXT DEFAULT 'AI Explorer',
      coding_heavy INTEGER DEFAULT 0,
      settings_json TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS lesson_completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      topic_id TEXT NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      score INTEGER DEFAULT 0,
      xp_earned INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      topic_id TEXT NOT NULL,
      quiz_type TEXT NOT NULL, -- 'light' or 'hard'
      score INTEGER DEFAULT 0,
      total_questions INTEGER DEFAULT 5,
      answers_json TEXT,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS concept_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      concept_key TEXT NOT NULL,
      mastery_score INTEGER DEFAULT 50, -- 0 to 100
      struggle_count INTEGER DEFAULT 0,
      last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, concept_key),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      badge_id TEXT NOT NULL,
      unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, badge_id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS notification_schedules (
      user_id INTEGER PRIMARY KEY,
      daily_time TEXT DEFAULT '16:15',
      hard_quiz_reminder INTEGER DEFAULT 1,
      sound_effects INTEGER DEFAULT 1,
      push_subscription_json TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  console.log('Database initialized successfully at', dbPath);
}

export default db;
