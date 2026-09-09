import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import ByteMascot from './ByteMascot';
import { playSound } from '../utils/audio';

export default function OnboardingModal({ onCompleteOnboarding, soundEnabled }) {
    const [step, setStep] = useState(1);
    const [knowledgeLevel, setKnowledgeLevel] = useState('beginner');
    const [goalRole, setGoalRole] = useState('AI Explorer');

    const knowledgeOptions = [
        { id: 'beginner', label: '🌱 Nothing yet', desc: 'Starting completely fresh' },
        { id: 'basics', label: '🔎 I know the basics', desc: 'Understand high-level concepts' },
        { id: 'coder', label: '🧑‍💻 I can code', desc: 'Comfortable writing code' },
        { id: 'builder', label: '🤖 I\'ve built AI projects', desc: 'Have used APIs & frameworks' },
        { id: 'advanced', label: '🧠 I\'m advanced', desc: 'Deep technical background' }
    ];

    const goalOptions = [
        { id: 'AI Developer', label: '💻 AI Developer' },
        { id: 'AI Researcher', label: '🔬 AI Researcher' },
        { id: 'AI Entrepreneur', label: '🚀 AI Entrepreneur' },
        { id: 'AI Engineer', label: '⚙️ AI Engineer' },
        { id: 'AI Explorer', label: '🧭 AI Explorer' }
    ];

    const handleFinish = () => {
        playSound('celebrate', soundEnabled);
        onCompleteOnboarding({ knowledgeLevel, goalRole });
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">

                <div className="text-center space-y-2">
                    <ByteMascot emotion="happy" dialog={step === 1 ? "Welcome to AI Quest! Let's personalize your daily coach!" : "Awesome! What's your ultimate AI goal?"} size="lg" className="justify-center" />
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        WELCOME TO AI QUEST 🚀
                    </h2>
                </div>

                {step === 1 ? (
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-300 block">
                            What do you already know about AI?
                        </label>

                        <div className="space-y-2">
                            {knowledgeOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        playSound('click', soundEnabled);
                                        setKnowledgeLevel(opt.id);
                                    }}
                                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${knowledgeLevel === opt.id
                                            ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md'
                                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                                        }`}
                                >
                                    <div>
                                        <span className="font-bold text-sm block">{opt.label}</span>
                                        <span className="text-xs text-slate-400">{opt.desc}</span>
                                    </div>
                                    {knowledgeLevel === opt.id && <Check className="w-5 h-5 text-cyan-400" />}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                playSound('click', soundEnabled);
                                setStep(2);
                            }}
                            className="w-full py-3.5 rounded-xl glow-btn text-white font-extrabold text-sm flex items-center justify-center gap-2 mt-4"
                        >
                            <span>NEXT STEP</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-300 block">
                            What do you want to become?
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {goalOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => {
                                        playSound('click', soundEnabled);
                                        setGoalRole(opt.id);
                                    }}
                                    className={`p-4 rounded-xl border text-left font-bold text-xs transition-all ${goalRole === opt.id
                                            ? 'bg-purple-950/80 border-purple-400 text-white ring-2 ring-purple-500/40'
                                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleFinish}
                            className="w-full py-4 rounded-xl glow-btn text-white font-extrabold text-sm flex items-center justify-center gap-2 mt-4"
                        >
                            <span>CREATE MY FIRST QUEST 🧠</span>
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
