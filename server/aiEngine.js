import { GoogleGenerativeAI } from '@google/generative-ai';
import { CURRICULUM } from './curriculumData.js';
import { run, get, all } from './db.js';

// Fallback dynamic generator to guarantee rich dynamic lessons without requiring API key upfront
function generateDynamicLessonTemplate(topicObj, isRefresher = false, conceptToRefresh = '') {
    const title = isRefresher
        ? `⚡ 5-Minute ${conceptToRefresh || topicObj.title} Refresher`
        : topicObj.title;

    return {
        id: topicObj.id,
        title,
        isRefresher,
        level: topicObj.level || 1,
        difficulty: topicObj.difficulty || 'Intermediate',
        estMinutes: isRefresher ? 5 : topicObj.estMinutes || 30,
        xp: isRefresher ? 50 : topicObj.xp || 100,
        learningObjectives: [
            `Understand core concepts of ${topicObj.title}`,
            `Identify practical real-world applications and trade-offs`,
            `Complete interactive build exercise & test knowledge in Boss Battle`
        ],
        sections: {
            discover: {
                title: 'PART 1: DISCOVER (5 MIN)',
                analogy: `Think of ${topicObj.title} like a specialized expert inside a busy company. Instead of doing everything from scratch, it processes inputs using calibrated rules and pattern recognition.`,
                content: `**What is ${topicObj.title}?**\n\nIn modern AI systems, ${topicObj.title} plays a critical role. ${topicObj.concepts ? topicObj.concepts.join(', ') : 'Key concepts'
                    } allow systems to process complex data efficiently.\n\nKey Insight: Rather than hardcoded logic, modern AI relies on representation learning and statistical optimization.`,
                diagramText: `[Input Data] ──► [ ${topicObj.title} Processing ] ──► [ Optimized Output ]`
            },
            learn: {
                title: 'PART 2: LEARN (10 MIN)',
                keyDefinitions: [
                    { term: topicObj.concepts?.[0] || 'Core Mechanics', definition: `The foundational mechanism that powers ${topicObj.title}.` },
                    { term: topicObj.concepts?.[1] || 'Real-World Usage', definition: `How engineers and researchers deploy ${topicObj.title} in production.` }
                ],
                deepDive: `### Deep Dive into ${topicObj.title}\n\nWhen we look under the hood of ${topicObj.title}, three things happen:\n1. **Data Representation**: Inputs are converted into numerical representations or vectors.\n2. **Transformation**: Layers or functions compute relationships.\n3. **Decision & Evaluation**: The system measures performance against objective loss metrics.\n\n### Common Misconceptions\n- ❌ *Myth*: AI models "think" like humans.\n- ✅ *Fact*: AI models calculate probability distributions over parameters based on training data patterns.`,
                applications: [
                    `Autonomous AI agents executing complex multi-step workflows`,
                    `Production LLMs handling multi-turn conversational context`,
                    `Enterprise RAG systems querying millions of documents`
                ]
            }
        },
        practicalChallenge: {
            title: 'PART 3: BUILD (10 MIN)',
            type: topicObj.id.includes('building') || topicObj.id.includes('agents') ? 'code' : 'prompt',
            instructions: `Complete the practical exercise below to demonstrate your understanding of ${topicObj.title}.`,
            initialSnippet: topicObj.id.includes('building')
                ? `def solve_ai_challenge(input_data):\n    # TODO: Implement ${topicObj.title} logic\n    pass`
                : `System: You are an expert AI Assistant.\nUser: Make a prompt for ${topicObj.title}.`,
            solutionHint: `Ensure your solution addresses ${topicObj.concepts?.[0] || 'the core objective'} clearly!`,
            sampleOptions: [
                { label: 'Option A: High precision & strict bounds', correct: true, feedback: 'Great choice! This optimizes accuracy and avoids hallucinations.' },
                { label: 'Option B: Unconstrained random generation', correct: false, feedback: 'Incorrect. Unconstrained outputs lead to high error rates.' }
            ]
        },
        lightQuiz: [
            {
                question: `What is the primary purpose of ${topicObj.title}?`,
                options: [
                    `To process data and optimize model performance`,
                    `To store static database files without AI`,
                    `To replace basic HTML web pages`,
                    `To manual format text files`
                ],
                correctIndex: 0,
                explanation: `${topicObj.title} is designed to optimize model accuracy, pattern recognition, and workflow efficiency.`
            },
            {
                question: `Which of the following is a key element of ${topicObj.concepts?.[0] || topicObj.title}?`,
                options: [
                    `Pattern representation and optimization`,
                    `Manual binary calculation`,
                    `Ignoring training feedback`,
                    `Fixed non-adaptive rules`
                ],
                correctIndex: 0,
                explanation: `Pattern representation and iterative optimization are central to AI algorithms.`
            },
            {
                question: `In production AI systems, why is ${topicObj.title} important?`,
                options: [
                    `It enables scalability and contextual understanding`,
                    `It reduces internet speed`,
                    `It makes code unreadable`,
                    `It prevents models from updating`
                ],
                correctIndex: 0,
                explanation: `Scalability and context handling allow AI applications to handle real-world user queries.`
            },
            {
                question: `What common mistake occurs when misconfiguring ${topicObj.title}?`,
                options: [
                    `Overfitting or poor generalization to new data`,
                    `Instant 100% perfection without training`,
                    `Faster computing without hardware`,
                    `Automatic speech synthesis`
                ],
                correctIndex: 0,
                explanation: `Misconfiguration can lead to overfitting or failure to generalize to unseen test data.`
            },
            {
                question: `How does evaluation improve ${topicObj.title}?`,
                options: [
                    `By identifying failure modes and measuring accuracy metrics`,
                    `By deleting training data`,
                    `By disabling loss functions`,
                    `By skipping validation tests`
                ],
                correctIndex: 0,
                explanation: `Continuous evaluation with metrics (Precision, Recall, F1) ensures model reliability.`
            }
        ],
        hardQuiz: [
            {
                question: `[ADVANCED REASONING] Suppose your production implementation of ${topicObj.title} exhibits high training accuracy (99%) but low validation accuracy (62%). What is the most effective architectural fix?`,
                options: [
                    `Add regularization (e.g., Dropout/L2), collect more diverse training data, or simplify model capacity`,
                    `Increase epoch count by 10x without changing hyperparameters`,
                    `Remove validation datasets entirely to eliminate errors`,
                    `Disable activation functions in hidden layers`
                ],
                correctIndex: 0,
                explanation: `A large gap between training and validation accuracy is a classic symptom of Overfitting. Regularization, data augmentation, and dropout mitigate this.`
            },
            {
                question: `[SYSTEM ARCHITECTURE] In a high-throughput scenario involving ${topicObj.title}, latency spikes occur during heavy load. Which strategy provides the best trade-off?`,
                options: [
                    `Implement caching, vector index quantization, and asynchronous batch inference`,
                    `Synchronously execute all API requests sequentially on a single thread`,
                    `Increase temperature parameter to maximum`,
                    `Disable error logging`
                ],
                correctIndex: 0,
                explanation: `Caching common queries and using quantized vector indexes dramatically cuts latency under heavy load.`
            },
            {
                question: `[DEBUGGING CHALLENGE] Analyze the following setup: An AI pipeline using ${topicObj.title} frequently hallucinates structured JSON fields. What is the root cause?`,
                options: [
                    `Lack of schema enforcement (Pydantic/Zod) and insufficient zero/few-shot target formatting examples`,
                    `Using too high a CPU clock speed`,
                    `Too many database tables`,
                    `Validating JSON before returning to user`
                ],
                correctIndex: 0,
                explanation: `Enforcing strict schema constraints (Structured Outputs) or response schemas guarantees JSON syntax integrity.`
            },
            {
                question: `[TRADE-OFF ANALYSIS] When scaling ${topicObj.title} from prototype to enterprise deployment, what primary trade-off must engineers manage?`,
                options: [
                    `Model accuracy & context window depth vs inference cost & latency`,
                    `Color palette of the user interface`,
                    `Keyboard typing speed of developer`,
                    `File naming conventions`
                ],
                correctIndex: 0,
                explanation: `Larger context windows and deeper models yield higher accuracy at the cost of higher latency and compute pricing.`
            },
            {
                question: `[FUTURE AI] Which emerging research trend directly enhances ${topicObj.title}?`,
                options: [
                    `Test-time compute scaling and dynamic chain-of-thought verification`,
                    `Returning to 1980s punch cards`,
                    `Removing parallel GPU processing`,
                    `Storing all data as plain text without embeddings`
                ],
                correctIndex: 0,
                explanation: `Test-time compute scaling allows models to deliberate before generating final answers, boosting reasoning performance.`
            }
        ]
    };
}

// Adaptive learning helper: check user weak concepts and return refresher if needed
export async function getAdaptiveLesson(userId, requestedTopicId, apiKey = null) {
    // Check user concept mastery for struggle points
    const weakConcepts = await all(
        `SELECT concept_key, mastery_score, struggle_count FROM concept_mastery WHERE user_id = ? AND (mastery_score < 70 OR struggle_count > 0) ORDER BY mastery_score ASC LIMIT 1`,
        [userId]
    );

    let topicObj = null;
    for (const levelObj of CURRICULUM) {
        const found = levelObj.topics.find((t) => t.id === requestedTopicId);
        if (found) {
            topicObj = { ...found, level: levelObj.level };
            break;
        }
    }

    if (!topicObj) {
        topicObj = CURRICULUM[0].topics[0];
    }

    // If user struggles heavily (mastery < 50) and hasn't done a refresher recently, schedule a refresher lesson first!
    let isRefresher = false;
    let conceptToRefresh = '';
    if (weakConcepts && weakConcepts.length > 0 && Math.random() < 0.35) {
        isRefresher = true;
        conceptToRefresh = weakConcepts[0].concept_key;
    }

    // If user provided a Gemini API Key or process.env.GEMINI_API_KEY exists, we can try calling LLM
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    if (effectiveKey) {
        try {
            const genAI = new GoogleGenerativeAI(effectiveKey);
            const model = genAI.getGenerativeAIModel({ model: 'gemini-1.5-flash' });
            const prompt = `Generate a structured json lesson for AI Quest app on topic "${topicObj.title}". Return ONLY valid JSON with keys: title, learningObjectives, sections (discover, learn), practicalChallenge, lightQuiz (5 MCQs), hardQuiz (5 MCQs).`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return { ...parsed, id: topicObj.id, isRefresher };
        } catch (err) {
            console.warn('Gemini API call failed or fallback used:', err.message);
        }
    }

    return generateDynamicLessonTemplate(topicObj, isRefresher, conceptToRefresh);
}

// Concept mastery updater
export async function updateConceptMastery(userId, conceptKey, scoreDelta) {
    const existing = await get(
        `SELECT mastery_score, struggle_count FROM concept_mastery WHERE user_id = ? AND concept_key = ?`,
        [userId, conceptKey]
    );

    if (existing) {
        const newScore = Math.max(0, Math.min(100, existing.mastery_score + scoreDelta));
        const newStruggle = scoreDelta < 0 ? existing.struggle_count + 1 : Math.max(0, existing.struggle_count - 1);
        await run(
            `UPDATE concept_mastery SET mastery_score = ?, struggle_count = ?, last_reviewed = CURRENT_TIMESTAMP WHERE user_id = ? AND concept_key = ?`,
            [newScore, newStruggle, userId, conceptKey]
        );
    } else {
        const initialScore = Math.max(0, Math.min(100, 50 + scoreDelta));
        const initialStruggle = scoreDelta < 0 ? 1 : 0;
        await run(
            `INSERT INTO concept_mastery (user_id, concept_key, mastery_score, struggle_count) VALUES (?, ?, ?, ?)`,
            [userId, conceptKey, initialScore, initialStruggle]
        );
    }
}
