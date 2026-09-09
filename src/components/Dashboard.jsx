import React from 'react';
import { Play, CheckCircle2, Lock, Flame, Star, Clock, Sparkles, ChevronRight } from 'lucide-react';
import ByteMascot from './ByteMascot';
import { playSound } from '../utils/audio';

export default function Dashboard({ user, curriculum, todaysQuest, onStartQuest, onSelectTopic, soundEnabled }) {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

            {/* Mobile Gamification Bar */}
            <div className="md:hidden flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400">LVL {user?.level || 1}</span>
                    <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div className="h-full bg-cyan-500" style={{ width: `${user?.levelProgress || 0}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-amber-400 flex items-center gap-1">⭐ {(user?.xp || 0).toLocaleString()} XP</span>
                    <span className="text-orange-400 flex items-center gap-1"><Flame className="w-3.5 h-3.5 fill-orange-500" /> {user?.currentStreak || 0}d</span>
                </div>
            </div>

            {/* 1. TODAY'S QUEST MAIN CARD */}
            <section className="relative overflow-hidden rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

                    <div className="space-y-4 max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                            <span>TODAY'S QUEST</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            {todaysQuest?.title || 'How Neural Networks Actually Learn'}
                        </h2>

                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                            Level {todaysQuest?.levelNumber || 1} • {todaysQuest?.levelName || 'AI Foundations'}
                        </p>

                        {/* Badges & Stats */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span>⏱️ {todaysQuest?.estMinutes || 30} min</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/30">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span>⭐ +{todaysQuest?.xp || 100} XP</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-500/30">
                                <span>Difficulty: {todaysQuest?.difficulty || 'Intermediate'}</span>
                            </div>
                        </div>

                        {/* Large START QUEST Button */}
                        <div className="pt-4">
                            <button
                                onClick={() => {
                                    playSound('click', soundEnabled);
                                    onStartQuest(todaysQuest?.id);
                                }}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl glow-btn text-white font-extrabold text-lg flex items-center justify-center gap-3 tracking-wide"
                            >
                                <span>START QUEST</span>
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Byte Mascot Companion */}
                    <div className="flex flex-col items-center">
                        <ByteMascot
                            emotion="excited"
                            dialog={`Ready for today's mission? Let's master ${todaysQuest?.title || 'AI'}! 🚀`}
                            size="lg"
                        />
                    </div>

                </div>
            </section>

            {/* 2. PROGRESS - YOUR AI JOURNEY SKILL MAP */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-3">
                            <span>YOUR AI JOURNEY</span>
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Visual skill tree detailing your progression through Artificial Intelligence.
                        </p>
                    </div>
                </div>

                {/* Skill Map Tree */}
                <div className="space-y-8 relative before:absolute before:left-6 sm:before:left-1/2 before:top-6 before:bottom-6 before:w-1 before:bg-slate-800 before:-translate-x-1/2">
                    {curriculum.map((lvl, lvlIdx) => (
                        <div key={lvl.level} className="relative z-10 space-y-4">

                            {/* Level Header Banner */}
                            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner"
                                        style={{ backgroundColor: lvl.unlocked ? lvl.color : '#334155' }}
                                    >
                                        {lvl.level}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-100 text-base flex items-center gap-2">
                                            <span>{lvl.name}</span>
                                            {!lvl.unlocked && <Lock className="w-4 h-4 text-slate-500" />}
                                        </h4>
                                        <p className="text-xs text-slate-400">{lvl.description}</p>
                                    </div>
                                </div>

                                <div className="text-xs font-semibold text-slate-400">
                                    {lvl.topics.filter((t) => t.completed).length} / {lvl.topics.length} Done
                                </div>
                            </div>

                            {/* Topics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pl-8 sm:pl-0">
                                {lvl.topics.map((top) => {
                                    const isCurrent = todaysQuest?.id === top.id;
                                    return (
                                        <button
                                            key={top.id}
                                            disabled={!lvl.unlocked}
                                            onClick={() => {
                                                playSound('click', soundEnabled);
                                                onSelectTopic(top.id);
                                            }}
                                            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${top.completed
                                                    ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200 hover:border-emerald-400'
                                                    : isCurrent
                                                        ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/50'
                                                        : lvl.unlocked
                                                            ? 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                                                            : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-1 mb-2">
                                                <span className="text-xs font-bold line-clamp-2">{top.title}</span>
                                                {top.completed ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                                ) : isCurrent ? (
                                                    <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 shrink-0 animate-pulse" />
                                                ) : !lvl.unlocked ? (
                                                    <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                                ) : null}
                                            </div>

                                            <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
                                                <span>⏱️ {top.estMinutes}m</span>
                                                <span>⭐ +{top.xp} XP</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
