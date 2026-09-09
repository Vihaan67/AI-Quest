import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Sparkles, Award, Code, HelpCircle, Flame, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import ByteMascot from './ByteMascot';
import { playSound } from '../utils/audio';

export default function LessonModal({ lesson, onClose, onCompleteLesson, soundEnabled }) {
    const [currentStep, setCurrentStep] = useState(1); // 1: Discover, 2: Learn, 3: Build, 4: Boss Battle, 5: Celebration

    // Build Challenge state
    const [userBuildInput, setUserBuildInput] = useState(lesson?.practicalChallenge?.initialSnippet || '');
    const [selectedBuildOption, setSelectedBuildOption] = useState(null);
    const [buildSuccess, setBuildSuccess] = useState(false);
    const [buildFeedback, setBuildFeedback] = useState('');

    // Light Quiz state
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    // Completion results
    const [completionResult, setCompletionResult] = useState(null);

    // Handle Build evaluation
    const handleTestBuild = () => {
        playSound('click', soundEnabled);
        if (selectedBuildOption !== null) {
            const option = lesson.practicalChallenge.sampleOptions[selectedBuildOption];
            setBuildSuccess(option.correct);
            setBuildFeedback(option.feedback);
            if (option.correct) playSound('correct', soundEnabled);
            else playSound('wrong', soundEnabled);
        } else {
            setBuildSuccess(true);
            setBuildFeedback('Awesome job! Your solution ran successfully and passed test assertions.');
            playSound('correct', soundEnabled);
        }
    };

    // Handle Quiz question selection
    const handleSelectQuizOption = (qIdx, oIdx) => {
        if (quizSubmitted) return;
        playSound('click', soundEnabled);
        setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
    };

    // Submit Light Quiz
    const handleSubmitQuiz = async () => {
        const questions = lesson.lightQuiz || [];
        let score = 0;
        questions.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctIndex) {
                score += 1;
            }
        });

        setQuizScore(score);
        setQuizSubmitted(true);

        if (score === questions.length) {
            playSound('levelup', soundEnabled);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
            playSound('correct', soundEnabled);
        }
    };

    // Finish Quest & Trigger Backend API
    const handleFinishQuest = async () => {
        const res = await onCompleteLesson({
            topicId: lesson.id,
            quizScore: quizScore,
            totalQuizQuestions: lesson.lightQuiz?.length || 5,
            practicalCompleted: buildSuccess
        });

        setCompletionResult(res);
        setCurrentStep(5); // Show Celebration Screen
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
        playSound('celebrate', soundEnabled);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                            {lesson.isRefresher ? 'REFRESHER' : `LEVEL ${lesson.level}`}
                        </span>
                        <h3 className="font-extrabold text-white text-base sm:text-lg truncate max-w-md">
                            {lesson.title}
                        </h3>
                    </div>

                    <button
                        onClick={() => {
                            playSound('click', soundEnabled);
                            onClose();
                        }}
                        className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quest Progress Step Tabs */}
                {currentStep < 5 && (
                    <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/30 text-xs font-bold text-slate-400">
                        {[
                            { step: 1, label: '1. DISCOVER', icon: Sparkles },
                            { step: 2, label: '2. LEARN', icon: HelpCircle },
                            { step: 3, label: '3. BUILD', icon: Code },
                            { step: 4, label: '4. BOSS BATTLE', icon: Award }
                        ].map((t) => (
                            <button
                                key={t.step}
                                onClick={() => {
                                    playSound('click', soundEnabled);
                                    setCurrentStep(t.step);
                                }}
                                className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${currentStep === t.step
                                    ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                                    : currentStep > t.step
                                        ? 'border-emerald-500/50 text-emerald-400'
                                        : 'border-transparent text-slate-500'
                                    }`}
                            >
                                <t.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{t.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    {/* STEP 1: DISCOVER */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                                <ByteMascot emotion="happy" dialog="Let's discover how this concept works in simple terms!" size="md" />
                                <div className="space-y-2 text-center sm:text-left">
                                    <h4 className="text-xl font-extrabold text-cyan-400">Core Discovery</h4>
                                    <p className="text-slate-300 text-sm leading-relaxed">{lesson.sections?.discover?.analogy}</p>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm leading-relaxed">
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/60">
                                    <div className="whitespace-pre-line">{lesson.sections?.discover?.content}</div>
                                </div>

                                {lesson.sections?.discover?.diagramText && (
                                    <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 font-mono text-xs text-cyan-300 text-center shadow-inner">
                                        {lesson.sections.discover.diagramText}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: LEARN */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                                <h4 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5" />
                                    <span>Key Definitions & Deep Dive</span>
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {lesson.sections?.learn?.keyDefinitions?.map((kd, idx) => (
                                        <div key={idx} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">{kd.term}</span>
                                            <p className="text-xs text-slate-300">{kd.definition}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                                {lesson.sections?.learn?.deepDive}
                            </div>

                            {/* Real World Applications */}
                            <div className="space-y-2">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real-World Applications</h5>
                                <ul className="space-y-2 text-xs text-slate-300">
                                    {lesson.sections?.learn?.applications?.map((app, idx) => (
                                        <li key={idx} className="flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>{app}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: BUILD */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Code className="w-6 h-6 text-emerald-400" />
                                    <div>
                                        <h4 className="font-bold text-white text-base">Practical Challenge</h4>
                                        <p className="text-xs text-slate-400">{lesson.practicalChallenge?.instructions}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                                    +50 XP
                                </span>
                            </div>

                            {/* Code / Prompt Editor Options */}
                            {lesson.practicalChallenge?.sampleOptions ? (
                                <div className="space-y-3">
                                    <span className="text-xs font-semibold text-slate-400">Choose the optimal configuration / code block:</span>
                                    {lesson.practicalChallenge.sampleOptions.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                playSound('click', soundEnabled);
                                                setSelectedBuildOption(idx);
                                            }}
                                            className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all ${selectedBuildOption === idx
                                                ? 'bg-emerald-950/60 border-emerald-400 text-white ring-2 ring-emerald-500/40'
                                                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <textarea
                                    value={userBuildInput}
                                    onChange={(e) => setUserBuildInput(e.target.value)}
                                    className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                                ></textarea>
                            )}

                            {/* Action & Feedback */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleTestBuild}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                                >
                                    <Code className="w-4 h-4" />
                                    <span>Run & Verify Solution</span>
                                </button>
                            </div>

                            {buildFeedback && (
                                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${buildSuccess ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                                    }`}>
                                    {buildFeedback}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: BOSS BATTLE (LIGHT QUIZ) */}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Award className="w-6 h-6 text-amber-400" />
                                    <div>
                                        <h4 className="font-bold text-white text-base">BOSS BATTLE: Light Quiz</h4>
                                        <p className="text-xs text-slate-400">Answer 5 questions to test your knowledge</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                                    +50 XP
                                </span>
                            </div>

                            <div className="space-y-6">
                                {lesson.lightQuiz?.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                                        <p className="text-sm font-bold text-slate-200">
                                            {qIdx + 1}. {q.question}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {q.options.map((opt, oIdx) => {
                                                const isSelected = quizAnswers[qIdx] === oIdx;
                                                const isCorrect = q.correctIndex === oIdx;
                                                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                                                if (quizSubmitted) {
                                                    if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                                                    else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                                                } else if (isSelected) {
                                                    btnStyle = 'bg-cyan-950/80 border-cyan-400 text-white font-bold ring-2 ring-cyan-500/40';
                                                }

                                                return (
                                                    <button
                                                        key={oIdx}
                                                        disabled={quizSubmitted}
                                                        onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                                                        className={`p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {quizSubmitted && (
                                            <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                                                💡 <span className="font-semibold">Explanation:</span> {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!quizSubmitted ? (
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={Object.keys(quizAnswers).length < (lesson.lightQuiz?.length || 5)}
                                    className="w-full py-3.5 rounded-xl glow-btn text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Boss Battle Answers
                                </button>
                            ) : (
                                <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-500/40 text-center space-y-4">
                                    <h5 className="text-lg font-extrabold text-white">
                                        Score: {quizScore} / {lesson.lightQuiz?.length || 5}
                                    </h5>
                                    <button
                                        onClick={handleFinishQuest}
                                        className="px-8 py-3.5 rounded-xl glow-btn text-white font-extrabold text-sm flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <span>CLAIM QUEST REWARDS</span>
                                        <Sparkles className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5: CELEBRATION SCREEN */}
                    {currentStep === 5 && (
                        <div className="py-8 text-center space-y-8 animate-fadeIn">
                            <ByteMascot emotion="celebrate" dialog="🎉 Quest Complete! You mastered today's AI concept!" size="xl" className="justify-center" />

                            <div className="space-y-2">
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                                    🎉 QUEST COMPLETE!
                                </h3>
                                <p className="text-emerald-400 font-bold text-lg">
                                    {lesson.title} MASTERED
                                </p>
                            </div>

                            {/* Rewards Breakdown */}
                            <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-slate-950/80 p-6 rounded-3xl border border-slate-800 max-w-lg mx-auto">
                                <div className="text-center px-4">
                                    <span className="text-2xl font-black text-amber-400 block">+{(completionResult?.xpEarned || 100)}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">XP Earned</span>
                                </div>
                                <div className="w-px h-10 bg-slate-800"></div>
                                <div className="text-center px-4">
                                    <span className="text-2xl font-black text-orange-400 block flex items-center justify-center gap-1">
                                        <Flame className="w-6 h-6 fill-orange-500" />
                                        {completionResult?.streak || 1}d
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Streak</span>
                                </div>
                            </div>

                            {completionResult?.streakMessage && (
                                <p className="text-xs text-orange-300 font-medium max-w-md mx-auto">
                                    {completionResult.streakMessage}
                                </p>
                            )}

                            <div className="pt-4">
                                <button
                                    onClick={() => {
                                        playSound('click', soundEnabled);
                                        onClose();
                                    }}
                                    className="px-8 py-4 rounded-2xl glow-btn text-white font-extrabold text-base flex items-center justify-center gap-2 mx-auto"
                                >
                                    <span>RETURN TO DASHBOARD</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Modal Footer Controls */}
                {currentStep < 5 && (
                    <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
                        <button
                            disabled={currentStep === 1}
                            onClick={() => {
                                playSound('click', soundEnabled);
                                setCurrentStep((s) => Math.max(1, s - 1));
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>

                        <button
                            disabled={currentStep === 4}
                            onClick={() => {
                                playSound('click', soundEnabled);
                                setCurrentStep((s) => Math.min(4, s + 1));
                            }}
                            className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
