import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { initDb, run, get, all } from './db.js';
import { CURRICULUM, BADGES_DEFINITION, LEVEL_XP_THRESHOLDS } from './curriculumData.js';
import { getAdaptiveLesson, updateConceptMastery } from './aiEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'ai_quest_super_secret_key_2026';

app.use(cors());
app.use(express.json());

// Initialize database
initDb().catch((err) => console.error('Database init error:', err));

// Helper: JWT verification middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

// Helper: Calculate level from total XP
function calculateLevel(xp) {
    let level = 1;
    for (let i = 0; i < LEVEL_XP_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_XP_THRESHOLDS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    const currentThreshold = LEVEL_XP_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_XP_THRESHOLDS[level] || currentThreshold + 1000;
    const progressInLevel = xp - currentThreshold;
    const xpNeeded = nextThreshold - currentThreshold;
    const percentage = Math.min(100, Math.floor((progressInLevel / xpNeeded) * 100));

    return { level, percentage, currentThreshold, nextThreshold };
}

// Helper: Check and grant badges
async function evaluateBadges(userId) {
    const user = await get(`SELECT * FROM users WHERE id = ?`, [userId]);
    const completions = await all(`SELECT * FROM lesson_completions WHERE user_id = ?`, [userId]);
    const quizAttempts = await all(`SELECT * FROM quiz_attempts WHERE user_id = ?`, [userId]);
    const existingBadges = await all(`SELECT badge_id FROM user_badges WHERE user_id = ?`, [userId]);
    const existingSet = new Set(existingBadges.map((b) => b.badge_id));

    const newlyUnlocked = [];

    const addBadge = async (badgeId) => {
        if (!existingSet.has(badgeId)) {
            await run(`INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)`, [userId, badgeId]);
            newlyUnlocked.push(badgeId);
        }
    };

    // 1. First quest
    if (completions.length >= 1) await addBadge('first_quest');

    // 2. Neural Net
    if (completions.some((c) => c.topic_id === 'foundations_6')) await addBadge('neural_net');

    // 3. Streaks
    if (user.current_streak >= 7) await addBadge('streak_7');
    if (user.current_streak >= 30) await addBadge('streak_30');

    // 4. Level completions
    const completedTopics = new Set(completions.map((c) => c.topic_id));
    if (CURRICULUM[3].topics.every((t) => completedTopics.has(t.id))) await addBadge('agent_builder');
    if (completedTopics.has('building_1')) await addBadge('python_explorer');
    if (CURRICULUM[4].topics.every((t) => completedTopics.has(t.id))) await addBadge('ai_researcher');
    if (CURRICULUM[5].topics.every((t) => completedTopics.has(t.id))) await addBadge('ai_entrepreneur');

    // 5. Perfect quiz
    if (quizAttempts.some((q) => q.score === q.total_questions)) await addBadge('perfect_quiz');

    // 6. 10 Projects
    if (completions.length >= 10) await addBadge('projects_10');

    return newlyUnlocked;
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, knowledgeLevel, goalRole, codingHeavy } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

        const existing = await get(`SELECT id FROM users WHERE username = ?`, [username]);
        if (existing) return res.status(400).json({ error: 'Username already taken' });

        const passwordHash = bcrypt.hashSync(password, 10);
        const settingsJson = JSON.stringify({
            dailyTime: '16:15',
            hardQuizReminder: true,
            soundEffects: true,
            difficulty: knowledgeLevel || 'beginner',
            codingHeavy: codingHeavy || false
        });

        const result = await run(
            `INSERT INTO users (username, password_hash, knowledge_level, goal_role, coding_heavy, settings_json) VALUES (?, ?, ?, ?, ?, ?)`,
            [username, passwordHash, knowledgeLevel || 'beginner', goalRole || 'AI Explorer', codingHeavy ? 1 : 0, settingsJson]
        );

        const userId = result.lastID;
        const token = jwt.sign({ userId, username }, JWT_SECRET);

        // Initial streak schedule setup
        await run(`INSERT OR IGNORE INTO notification_schedules (user_id) VALUES (?)`, [userId]);

        res.json({ token, user: { id: userId, username, xp: 0, level: 1, current_streak: 0, longest_streak: 0, knowledge_level: knowledgeLevel, goal_role: goalRole } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await get(`SELECT * FROM users WHERE username = ?`, [username]);
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        const match = bcrypt.compareSync(password, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Invalid username or password' });

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                xp: user.xp,
                level: user.level,
                current_streak: user.current_streak,
                longest_streak: user.longest_streak,
                knowledge_level: user.knowledge_level,
                goal_role: user.goal_role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// USER & PROGRESS ENDPOINTS
// ----------------------------------------------------

app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await get(`SELECT * FROM users WHERE id = ?`, [req.user.userId]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const completions = await all(`SELECT * FROM lesson_completions WHERE user_id = ?`, [req.user.userId]);
        const quizAttempts = await all(`SELECT * FROM quiz_attempts WHERE user_id = ?`, [req.user.userId]);
        const userBadges = await all(`SELECT badge_id, unlocked_at FROM user_badges WHERE user_id = ?`, [req.user.userId]);
        const masteryList = await all(`SELECT * FROM concept_mastery WHERE user_id = ?`, [req.user.userId]);
        const settings = await get(`SELECT * FROM notification_schedules WHERE user_id = ?`, [req.user.userId]);

        const levelInfo = calculateLevel(user.xp);

        const avgQuizScore = quizAttempts.length > 0
            ? Math.round((quizAttempts.reduce((acc, q) => acc + (q.score / q.total_questions), 0) / quizAttempts.length) * 100)
            : 0;

        const weakAreas = masteryList.filter((m) => m.mastery_score < 70).map((m) => m.concept_key);
        const strongAreas = masteryList.filter((m) => m.mastery_score >= 80).map((m) => m.concept_key);

        res.json({
            user: {
                id: user.id,
                username: user.username,
                xp: user.xp,
                level: levelInfo.level,
                levelProgress: levelInfo.percentage,
                currentStreak: user.current_streak,
                longestStreak: user.longest_streak,
                knowledgeLevel: user.knowledge_level,
                goalRole: user.goal_role,
                createdAt: user.created_at
            },
            stats: {
                lessonsCompleted: completions.length,
                quizzesCompleted: quizAttempts.length,
                averageQuizScore: avgQuizScore,
                weakAreas,
                strongAreas
            },
            badges: userBadges,
            settings: settings || { daily_time: '16:15', hard_quiz_reminder: 1, sound_effects: 1 }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// CURRICULUM & TODAY'S QUEST ENDPOINT
// ----------------------------------------------------

app.get('/api/curriculum', authenticateToken, async (req, res) => {
    try {
        const completions = await all(`SELECT topic_id FROM lesson_completions WHERE user_id = ?`, [req.user.userId]);
        const completedSet = new Set(completions.map((c) => c.topic_id));

        const enrichedCurriculum = CURRICULUM.map((level) => {
            let isUnlocked = level.level === 1; // Level 1 unlocked by default
            // Unlock subsequent level if previous level has at least 5 completed topics
            if (level.level > 1) {
                const prevLevel = CURRICULUM.find((l) => l.level === level.level - 1);
                const prevCompleted = prevLevel ? prevLevel.topics.filter((t) => completedSet.has(t.id)).length : 0;
                isUnlocked = prevCompleted >= 4;
            }

            return {
                ...level,
                unlocked: isUnlocked,
                topics: level.topics.map((t) => ({
                    ...t,
                    completed: completedSet.has(t.id)
                }))
            };
        });

        // Determine Today's Quest
        let todaysTopic = null;
        for (const lvl of enrichedCurriculum) {
            if (lvl.unlocked) {
                const firstUncompleted = lvl.topics.find((t) => !t.completed);
                if (firstUncompleted) {
                    todaysTopic = { ...firstUncompleted, levelName: lvl.name, levelNumber: lvl.level };
                    break;
                }
            }
        }

        if (!todaysTopic) {
            todaysTopic = { ...CURRICULUM[0].topics[0], levelName: CURRICULUM[0].name, levelNumber: 1 };
        }

        res.json({ curriculum: enrichedCurriculum, todaysQuest: todaysTopic });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// LESSON GENERATION & COMPLETION
// ----------------------------------------------------

app.get('/api/lessons/:topicId', authenticateToken, async (req, res) => {
    try {
        const apiKey = req.headers['x-gemini-api-key'];
        const lessonData = await getAdaptiveLesson(req.user.userId, req.params.topicId, apiKey);
        res.json(lessonData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/lessons/complete', authenticateToken, async (req, res) => {
    try {
        const { topicId, quizScore, totalQuizQuestions, practicalCompleted } = req.body;
        const userId = req.user.userId;

        // Calculate XP
        let xpEarned = 100; // Complete lesson base
        if (practicalCompleted) xpEarned += 50;
        if (quizScore) {
            xpEarned += quizScore * 10; // Light quiz score
            if (quizScore === totalQuizQuestions) xpEarned += 25; // Perfect quiz bonus
        }

        // Save completion
        await run(
            `INSERT INTO lesson_completions (user_id, topic_id, score, xp_earned) VALUES (?, ?, ?, ?)`,
            [userId, topicId, quizScore || 0, xpEarned]
        );

        // Save quiz attempt
        if (quizScore !== undefined) {
            await run(
                `INSERT INTO quiz_attempts (user_id, topic_id, quiz_type, score, total_questions) VALUES (?, ?, 'light', ?, ?)`,
                [userId, topicId, quizScore, totalQuizQuestions || 5]
            );
        }

        // Handle streak update
        const user = await get(`SELECT * FROM users WHERE id = ?`, [userId]);
        const todayStr = new Date().toISOString().split('T')[0];
        let newStreak = user.current_streak || 0;
        let streakMessage = '';

        if (user.last_activity_date !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (user.last_activity_date === yesterdayStr) {
                newStreak += 1;
                streakMessage = `🔥 Daily streak increased to ${newStreak} days!`;
            } else if (!user.last_activity_date) {
                newStreak = 1;
                streakMessage = `🔥 First day streak started!`;
            } else {
                newStreak = 1; // Gracefully reset without guilt
                streakMessage = `Every expert has off days. Let's get back on track! 🔥 Streak set to 1 day.`;
            }

            // Add streak bonus XP
            const streakBonus = Math.min(newStreak, 10) * 10;
            xpEarned += streakBonus;
        }

        const newLongestStreak = Math.max(user.longest_streak || 0, newStreak);
        const newTotalXp = user.xp + xpEarned;
        const { level } = calculateLevel(newTotalXp);

        await run(
            `UPDATE users SET xp = ?, level = ?, current_streak = ?, longest_streak = ?, last_activity_date = ? WHERE id = ?`,
            [newTotalXp, level, newStreak, newLongestStreak, todayStr, userId]
        );

        // Update concept mastery
        if (quizScore !== undefined) {
            const scoreDelta = (quizScore / (totalQuizQuestions || 5) - 0.6) * 30;
            await updateConceptMastery(userId, topicId, scoreDelta);
        }

        // Evaluate badges
        const newBadges = await evaluateBadges(userId);

        res.json({
            success: true,
            xpEarned,
            newTotalXp,
            level,
            streak: newStreak,
            streakMessage,
            newBadges
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// HARD QUIZ COMPLETION
// ----------------------------------------------------

app.post('/api/quizzes/hard/complete', authenticateToken, async (req, res) => {
    try {
        const { topicId, score, totalQuestions } = req.body;
        const userId = req.user.userId;

        let xpEarned = score * 20; // Up to 100 XP
        if (score === totalQuestions) xpEarned += 25; // Perfect score bonus

        await run(
            `INSERT INTO quiz_attempts (user_id, topic_id, quiz_type, score, total_questions) VALUES (?, ?, 'hard', ?, ?)`,
            [userId, topicId, score, totalQuestions || 5]
        );

        const user = await get(`SELECT xp FROM users WHERE id = ?`, [userId]);
        const newTotalXp = user.xp + xpEarned;
        const { level } = calculateLevel(newTotalXp);

        await run(`UPDATE users SET xp = ?, level = ? WHERE id = ?`, [newTotalXp, level, userId]);

        // Concept mastery update
        const scoreDelta = (score / (totalQuestions || 5) - 0.6) * 40;
        await updateConceptMastery(userId, topicId, scoreDelta);

        const newBadges = await evaluateBadges(userId);

        res.json({ success: true, xpEarned, newTotalXp, level, newBadges });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// SETTINGS & NOTIFICATIONS
// ----------------------------------------------------

app.post('/api/settings/update', authenticateToken, async (req, res) => {
    try {
        const { dailyTime, hardQuizReminder, soundEffects, pushSubscription } = req.body;
        const userId = req.user.userId;

        const subJson = pushSubscription ? JSON.stringify(pushSubscription) : null;

        await run(
            `INSERT INTO notification_schedules (user_id, daily_time, hard_quiz_reminder, sound_effects, push_subscription_json)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         daily_time = excluded.daily_time,
         hard_quiz_reminder = excluded.hard_quiz_reminder,
         sound_effects = excluded.sound_effects,
         push_subscription_json = COALESCE(excluded.push_subscription_json, push_subscription_json)`,
            [userId, dailyTime || '16:15', hardQuizReminder ? 1 : 0, soundEffects ? 1 : 0, subJson]
        );

        res.json({ success: true, message: 'Settings saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend static files in production if built
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`AI Quest Express Server listening on http://localhost:${PORT}`);
});
