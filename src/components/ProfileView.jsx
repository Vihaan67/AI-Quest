import React from 'react';
import { Award, Flame, Star, CheckCircle2, AlertTriangle, BookOpen, Trophy } from 'lucide-react';
import { BADGES_DEFINITION } from '../../server/curriculumData';

export default function ProfileView({ profileData }) {
    const user = profileData?.user || {};
    const stats = profileData?.stats || {};
    const unlockedBadges = new Set((profileData?.badges || []).map((b) => b.badge_id));

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">

            {/* User Header Profile Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-cyan-500/20">
                        {user.username ? user.username[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-white">{user.username || 'AI Quest User'}</h2>
                        <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                            Level {user.level || 1} • {user.goalRole || 'AI Explorer'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                        </p>
                    </div>
                </div>

                {/* Level XP Banner */}
                <div className="bg-slate-900/80 px-6 py-4 rounded-2xl border border-slate-800 text-center sm:text-right space-y-1">
                    <span className="text-2xl font-black text-amber-400 block">⭐ {(user.xp || 0).toLocaleString()} XP</span>
                    <span className="text-xs text-slate-400 font-bold uppercase">Total Learning XP</span>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                    <Flame className="w-6 h-6 text-orange-500 mx-auto fill-orange-500" />
                    <span className="text-xl font-extrabold text-white block">{user.currentStreak || 0} Days</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Current Streak</span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                    <Trophy className="w-6 h-6 text-amber-400 mx-auto" />
                    <span className="text-xl font-extrabold text-white block">{user.longestStreak || 0} Days</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Best Streak</span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                    <BookOpen className="w-6 h-6 text-cyan-400 mx-auto" />
                    <span className="text-xl font-extrabold text-white block">{stats.lessonsCompleted || 0}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quests Completed</span>
                </div>

                <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-center space-y-1">
                    <Award className="w-6 h-6 text-purple-400 mx-auto" />
                    <span className="text-xl font-extrabold text-white block">{stats.averageQuizScore || 0}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Quiz Score</span>
                </div>
            </div>

            {/* Concept Analysis (Weak vs Strong) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strong Areas */}
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Strong Concepts</span>
                    </h4>
                    {stats.strongAreas?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {stats.strongAreas.map((area, idx) => (
                                <span key={idx} className="text-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full">
                                    {area}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">Complete more quests to establish strong areas.</p>
                    )}
                </div>

                {/* Weak Areas */}
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Focus / Review Areas</span>
                    </h4>
                    {stats.weakAreas?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {stats.weakAreas.map((area, idx) => (
                                <span key={idx} className="text-xs bg-amber-950/60 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full">
                                    {area}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">No weak concepts detected right now!</p>
                    )}
                </div>
            </div>

            {/* Unlockable Badges Gallery */}
            <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-white">Unlockable Badges</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {BADGES_DEFINITION.map((badge) => {
                        const isUnlocked = unlockedBadges.has(badge.id);
                        return (
                            <div
                                key={badge.id}
                                className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${isUnlocked
                                        ? 'bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/10'
                                        : 'bg-slate-950/40 border-slate-900 opacity-50 grayscale'
                                    }`}
                            >
                                <div className="text-3xl">{badge.icon}</div>
                                <h5 className="font-bold text-xs text-white leading-tight">{badge.title}</h5>
                                <p className="text-[10px] text-slate-400 line-clamp-2">{badge.description}</p>
                                {isUnlocked && (
                                    <span className="inline-block text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                                        UNLOCKED
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
