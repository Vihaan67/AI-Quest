// AI Quest Curriculum Definition: 6 Levels, 10 Topics each (60 topics total)

export const CURRICULUM = [
    {
        level: 1,
        name: 'AI Foundations',
        description: 'Master core concepts of Artificial Intelligence & Machine Learning',
        icon: 'Brain',
        color: '#3B82F6',
        topics: [
            { id: 'foundations_1', title: 'What Is Artificial Intelligence?', difficulty: 'Beginner', estMinutes: 25, xp: 100, concepts: ['AI definition', 'symbolic vs connectionist', 'narrow vs general AI'] },
            { id: 'foundations_2', title: 'AI vs Machine Learning', difficulty: 'Beginner', estMinutes: 30, xp: 100, concepts: ['Machine Learning', 'Deep Learning', 'Traditional software'] },
            { id: 'foundations_3', title: 'What Is Data?', difficulty: 'Beginner', estMinutes: 25, xp: 100, concepts: ['Data pipelines', 'Structured vs Unstructured', 'Features & Targets'] },
            { id: 'foundations_4', title: 'Supervised Learning', difficulty: 'Beginner', estMinutes: 30, xp: 100, concepts: ['Classification', 'Regression', 'Labeled Datasets'] },
            { id: 'foundations_5', title: 'Unsupervised Learning', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Clustering', 'Dimensionality Reduction', 'K-Means'] },
            { id: 'foundations_6', title: 'Neural Networks', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Neurons & Layers', 'Weights & Biases', 'Activation Functions'] },
            { id: 'foundations_7', title: 'Training vs Inference', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Backpropagation', 'Loss functions', 'Forward pass'] },
            { id: 'foundations_8', title: 'Models and Parameters', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Hyperparameters', 'Weights', 'Model Architectures'] },
            { id: 'foundations_9', title: 'Overfitting & Underfitting', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Overfitting', 'Regularization', 'Train/Test Split'] },
            { id: 'foundations_10', title: 'AI Evaluation Metrics', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Accuracy', 'Precision & Recall', 'F1 Score'] }
        ]
    },
    {
        level: 2,
        name: 'Generative AI',
        description: 'Explore Large Language Models, Transformers, and Prompting',
        icon: 'Sparkles',
        color: '#8B5CF6',
        topics: [
            { id: 'genai_1', title: 'What Are LLMs?', difficulty: 'Beginner', estMinutes: 25, xp: 100, concepts: ['LLM definition', 'Generative vs Discriminative', 'Pre-training'] },
            { id: 'genai_2', title: 'Tokens & Tokenization', difficulty: 'Beginner', estMinutes: 30, xp: 100, concepts: ['BPE', 'Token limits', 'Cost per token'] },
            { id: 'genai_3', title: 'Context Windows', difficulty: 'Beginner', estMinutes: 25, xp: 100, concepts: ['Context length', 'Needle in a haystack', 'Working memory'] },
            { id: 'genai_4', title: 'Transformers Architecture', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Encoder-Decoder', 'Vaswani et al.', 'Parallel processing'] },
            { id: 'genai_5', title: 'Transformer Attention', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Self-Attention', 'Query/Key/Value', 'Multi-head attention'] },
            { id: 'genai_6', title: 'Vector Embeddings', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['High-dimensional vectors', 'Semantic similarity', 'Cosine distance'] },
            { id: 'genai_7', title: 'Prompt Engineering Mastery', difficulty: 'Beginner', estMinutes: 30, xp: 100, concepts: ['System prompts', 'Few-shot prompting', 'Chain of thought'] },
            { id: 'genai_8', title: 'Temperature & Sampling', difficulty: 'Intermediate', estMinutes: 25, xp: 100, concepts: ['Top-P', 'Top-K', 'Deterministic output'] },
            { id: 'genai_9', title: 'Hallucinations & Grounding', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Factuality', 'Grounding sources', 'Guardrails'] },
            { id: 'genai_10', title: 'Multimodal AI', difficulty: 'Advanced', estMinutes: 30, xp: 100, concepts: ['Vision-language models', 'Audio AI', 'Cross-modal embeddings'] }
        ]
    },
    {
        level: 3,
        name: 'Building AI',
        description: 'Write Python, connect Model APIs, implement RAG & Vector Search',
        icon: 'Code',
        color: '#10B981',
        topics: [
            { id: 'building_1', title: 'Python for AI Developers', difficulty: 'Beginner', estMinutes: 30, xp: 100, concepts: ['Python AI packages', 'Async requests', 'Environment variables'] },
            { id: 'building_2', title: 'REST APIs & Webhooks', difficulty: 'Beginner', estMinutes: 25, xp: 100, concepts: ['HTTP requests', 'JSON payloads', 'Rate limits'] },
            { id: 'building_3', title: 'Model APIs Integration', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Gemini API', 'OpenAI API', 'Streaming responses'] },
            { id: 'building_4', title: 'Structured Outputs', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['JSON mode', 'Pydantic schemas', 'Zod validation'] },
            { id: 'building_5', title: 'Function Calling & Tool Use', difficulty: 'Intermediate', estMinutes: 35, xp: 100, concepts: ['Function schemas', 'Tool arguments', 'Execution loop'] },
            { id: 'building_6', title: 'Generating Embeddings', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Embedding endpoints', 'Chunking strategies', 'Overlapping windows'] },
            { id: 'building_7', title: 'Vector Databases', difficulty: 'Intermediate', estMinutes: 35, xp: 100, concepts: ['Chroma', 'Pinecone', 'HNSW indexing'] },
            { id: 'building_8', title: 'Retrieval Augmented Generation (RAG)', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Vector lookup', 'Context injection', 'Reranking'] },
            { id: 'building_9', title: 'AI Search & Hybrid Search', difficulty: 'Advanced', estMinutes: 30, xp: 100, concepts: ['BM25', 'Hybrid search', 'Reciprocal rank fusion'] },
            { id: 'building_10', title: 'Building an End-to-End AI Feature', difficulty: 'Advanced', estMinutes: 40, xp: 100, concepts: ['Fullstack integration', 'Error handling', 'Latency optimization'] }
        ]
    },
    {
        level: 4,
        name: 'AI Agents',
        description: 'Design autonomous AI agents with tools, memory, and multi-agent coordination',
        icon: 'Bot',
        color: '#F59E0B',
        topics: [
            { id: 'agents_1', title: 'What Is an AI Agent?', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Agent definition', 'Autonomy', 'Environment perception'] },
            { id: 'agents_2', title: 'Agent Loops (ReAct)', difficulty: 'Intermediate', estMinutes: 35, xp: 100, concepts: ['Reasoning + Action', 'Thought-Action-Observation', 'Loop termination'] },
            { id: 'agents_3', title: 'Agent Tools & Interfaces', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Browser tools', 'Code interpreters', 'Custom APIs'] },
            { id: 'agents_4', title: 'Agent Memory Systems', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Short-term context', 'Long-term memory', 'Episodic memory'] },
            { id: 'agents_5', title: 'Planning & Decomposition', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Task breakdown', 'Sub-goal generation', 'Plan execution'] },
            { id: 'agents_6', title: 'Dynamic Tool Calling', difficulty: 'Advanced', estMinutes: 30, xp: 100, concepts: ['Schema generation', 'Param extraction', 'Tool selection'] },
            { id: 'agents_7', title: 'Agent State Management', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['State machines', 'LangGraph', 'Checkpointing'] },
            { id: 'agents_8', title: 'Multi-Agent Systems', difficulty: 'Advanced', estMinutes: 40, xp: 100, concepts: ['Specialized agents', 'Delegation', 'Consensus mechanisms'] },
            { id: 'agents_9', title: 'Agent Evaluation & Benchmarking', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Trajectory eval', 'Task success rate', 'Tool error rate'] },
            { id: 'agents_10', title: 'Building an Autonomous AI Agent', difficulty: 'Advanced', estMinutes: 40, xp: 100, concepts: ['End-to-end agent', 'Self-correction', 'Human-in-the-loop'] }
        ]
    },
    {
        level: 5,
        name: 'Advanced AI',
        description: 'Fine-tuning, Reinforcement Learning, Computer Vision, and Alignment',
        icon: 'Cpu',
        color: '#EF4444',
        topics: [
            { id: 'advanced_1', title: 'Model Fine-Tuning & LoRA', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['PEFT', 'LoRA weights', 'Dataset preparation'] },
            { id: 'advanced_2', title: 'Reinforcement Learning & RLHF', difficulty: 'Advanced', estMinutes: 40, xp: 100, concepts: ['Reward models', 'PPO', 'DPO alignment'] },
            { id: 'advanced_3', title: 'Computer Vision & Diffusion', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['CNNs', 'Diffusion noise removal', 'CLIP embeddings'] },
            { id: 'advanced_4', title: 'Speech AI & Audio Models', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Whisper STT', 'Neural TTS', 'Audio tokenization'] },
            { id: 'advanced_5', title: 'Multimodal Models Architectures', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Cross-attention', 'Image patch projection', 'Unified tokens'] },
            { id: 'advanced_6', title: 'Model Evaluation & Benchmarks', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['MMLU', 'HumanEval', 'LLM-as-a-Judge'] },
            { id: 'advanced_7', title: 'AI Safety & Security', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Prompt injection', 'Jailbreaking', 'Data poisoning'] },
            { id: 'advanced_8', title: 'AI Alignment & Ethics', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Helpful/Honest/Harmless', 'Constitutional AI', 'Bias mitigation'] },
            { id: 'advanced_9', title: 'Model Efficiency & Quantization', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['GGML/GGUF', '4-bit quantization', 'KV Cache optimization'] },
            { id: 'advanced_10', title: 'Modern AI Research Frontiers', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Test-time compute', 'Reasoning models', 'Synthetic data generation'] }
        ]
    },
    {
        level: 6,
        name: 'AI Entrepreneur',
        description: 'Identify AI business opportunities, build MVPs, price, and launch',
        icon: 'Rocket',
        color: '#EC4899',
        topics: [
            { id: 'entrepreneur_1', title: 'Finding AI Problems Worth Solving', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['AI moat', 'High friction tasks', 'ROI calculation'] },
            { id: 'entrepreneur_2', title: 'Customer Discovery for AI', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['User interviews', 'Workflow mapping', 'Problem validation'] },
            { id: 'entrepreneur_3', title: 'AI Product Strategy & Moats', difficulty: 'Intermediate', estMinutes: 35, xp: 100, concepts: ['Data flywheels', 'Workflow integration', 'Model dependency risk'] },
            { id: 'entrepreneur_4', title: 'Rapid AI MVP Design', difficulty: 'Intermediate', estMinutes: 35, xp: 100, concepts: ['No-code prototyping', 'API wrappers', 'Core UX loops'] },
            { id: 'entrepreneur_5', title: 'Building an AI Prototype', difficulty: 'Advanced', estMinutes: 40, xp: 100, concepts: ['Vite + Vercel deploy', 'Latency feedback UI', 'Cost management'] },
            { id: 'entrepreneur_6', title: 'AI UX & Interaction Design', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Optimistic UI', 'Streaming text UX', 'Confidence indicators'] },
            { id: 'entrepreneur_7', title: 'Pricing AI Products & Unit Economics', difficulty: 'Advanced', estMinutes: 35, xp: 100, concepts: ['Per-seat vs usage pricing', 'Token margin calculation', 'Tiered plans'] },
            { id: 'entrepreneur_8', title: 'Launching Your AI Product', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Product Hunt', 'Show HN', 'Viral demo loops'] },
            { id: 'entrepreneur_9', title: 'Getting First 100 AI Users', difficulty: 'Intermediate', estMinutes: 30, xp: 100, concepts: ['Community distribution', 'Outreach', 'Feedback iteration'] },
            { id: 'entrepreneur_10', title: 'Building a Scalable AI Startup', difficulty: 'Advanced', estMinutes: 40, xp: 100, concepts: ['Pitching AI investors', 'Hiring engineers', 'Scale economics'] }
        ]
    }
];

export const BADGES_DEFINITION = [
    { id: 'first_quest', title: 'First Steps', description: 'Complete your first AI Quest', icon: '🎯', category: 'Milestone' },
    { id: 'neural_net', title: 'First Neural Network', description: 'Master the Neural Networks lesson', icon: '🧠', category: 'Mastery' },
    { id: 'streak_7', title: '7-Day Streak', description: 'Maintain a 7-day learning streak', icon: '🔥', category: 'Streak' },
    { id: 'streak_30', title: '30-Day Streak', description: 'Maintain a 30-day learning streak', icon: '⚡', category: 'Streak' },
    { id: 'agent_builder', title: 'Agent Builder', description: 'Complete the AI Agents level', icon: '🤖', category: 'Mastery' },
    { id: 'python_explorer', title: 'Python Explorer', description: 'Complete Python for AI challenge', icon: '🐍', category: 'Coding' },
    { id: 'ai_researcher', title: 'AI Researcher', description: 'Complete Advanced AI level', icon: '🔬', category: 'Mastery' },
    { id: 'ai_entrepreneur', title: 'AI Entrepreneur', description: 'Complete AI Entrepreneur level', icon: '🚀', category: 'Mastery' },
    { id: 'perfect_quiz', title: 'Perfect Boss Battle', description: 'Score 100% on any Boss Battle quiz', icon: '🏆', category: 'Quiz' },
    { id: 'projects_10', title: '10 Projects Completed', description: 'Complete 10 practical build challenges', icon: '💡', category: 'Build' }
];

export const LEVEL_XP_THRESHOLDS = [
    0,      // Level 1
    250,    // Level 2
    600,    // Level 3
    1000,   // Level 4
    1500,   // Level 5
    2100,   // Level 6
    2800,   // Level 7
    3600,   // Level 8
    4500,   // Level 9
    5500,   // Level 10
    7000,   // Level 11
    9000,   // Level 12
    12000   // Level 13+
];
