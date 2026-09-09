import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import ByteMascot from './ByteMascot';
import { playSound } from '../utils/audio';

export default function HardQuizModal({ lesson, onClose, onCompleteHardQuiz, soundEnabled }) {
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [resultData, setResultData] = useState(null);

    const questions = lesson?.hardQuiz || [];

    const handleSelectOption = (qIdx, oIdx) => {
        if (quizSubmitted) return;
        playSound('click', soundEnabled);
        setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
    };

    const handleSubmitHardQuiz = async () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctIndex) {
                score += 1;
            }
        });

        setQuizScore(score);
        setQuizSubmitted(true);

        const res = await onCompleteHardQuiz({
            topicId: lesson.id,
            score: score,
            totalQuestions: questions.length
        });

        setResultData(res);

        if (score === questions.length) {
            playSound('levelup', soundEnabled);
            confetti({ particleCount: 150, spread: 80 });
        } else {
            playSound('correct', soundEnabled);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="w-full max-w-4xl bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-purple-950/30">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            HARD BOSS BATTLE
                        </span>
                        <h3 className="font-extrabold text-white text-base sm:text-lg truncate max-w-md">
                            {lesson?.title}
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

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">

                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-purple-950/20 p-5 rounded-2xl border border-purple-500/30">
                        <ByteMascot emotion="thinking" dialog="Think carefully! These questions test deep reasoning & debugging." size="md" />
                        <div>
                            <h4 className="text-lg font-extrabold text-purple-300">Advanced Conceptual Verification</h4>
                            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                                Earn up to <span className="text-amber-400 font-bold">+100 XP</span> (+25 bonus for perfect score) by demonstrating true understanding.
                            </p>
                        </div>
                    </div>

                    {/* Question List */}
                    <div className="space-y-6">
                        {questions.map((q, qIdx) => (
                            <div key={qIdx} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/80 space-y-3">
                                <p className="text-sm font-bold text-slate-100 leading-relaxed">
                                    {qIdx + 1}. {q.question}
                                </p>

                                <div className="space-y-2">
                                    {q.options.map((opt, oIdx) => {
                                        const isSelected = quizAnswers[qIdx] === oIdx;
                                        const isCorrect = q.correctIndex === oIdx;
                                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                                        if (quizSubmitted) {
                                            if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                                            else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                                        } else if (isSelected) {
                                            btnStyle = 'bg-purple-950/80 border-purple-400 text-white font-bold ring-2 ring-purple-500/40';
                                        }

                                        return (
                                            <button
                                                key={oIdx}
                                                disabled={quizSubmitted}
                                                onClick={() => handleSelectOption(qIdx, oIdx)}
                                                className={`w-full p-3.5 rounded-xl border text-left text-xs leading-relaxed transition-all ${btnStyle}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {quizSubmitted && (
                                    <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-purple-500/30">
                                        🧠 <span className="font-bold text-purple-300">Detailed Explanation:</span> {q.explanation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Submit or Results */}
                    {!quizSubmitted ? (
                        <button
                            onClick={handleSubmitHardQuiz}
                            disabled={Object.keys(quizAnswers).length < questions.length}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Submit Hard Boss Battle Answers
                        </button>
                    ) : (
                        <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 text-center space-y-4">
                            <div className="inline-flex items-center gap-2 text-2xl font-black text-amber-400">
                                <Sparkles className="w-6 h-6 animate-pulse" />
                                <span>+{(resultData?.xpEarned || quizScore * 20)} XP EARNED!</span>
                            </div>
                            <p className="text-sm font-bold text-slate-300">
                                You scored {quizScore} out of {questions.length}!
                            </p>
                            <button
                                onClick={() => {
                                    playSound('click', soundEnabled);
                                    onClose();
                                }}
                                className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 mx-auto"
                            >
                                <span>CONTINUE JOURNEY</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
