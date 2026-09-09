import React from 'react';
import { Volume2, VolumeX, Flame, Award, User, Settings, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function Navbar({ user, stats, soundEnabled, setSoundEnabled, activeTab, setActiveTab }) {
    const handleNav = (tab) => {
        playSound('click', soundEnabled);
        setActiveTab(tab);
    };

    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 lg:px-8 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Left: Brand Logo */}
                <div
                    onClick={() => handleNav('dashboard')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            AI QUEST
                        </h1>
                        <p className="text-[10px] text-cyan-400/80 uppercase font-semibold tracking-widest -mt-1">
                            Daily AI Coach
                        </p>
                    </div>
                </div>

                {/* Center: Progress & Gamification Stats */}
                {user && (
                    <div className="hidden md:flex items-center gap-6 bg-slate-900/60 px-5 py-2 rounded-full border border-slate-800">

                        {/* Level & XP Progress */}
                        <div className="flex items-center gap-3">
                            <div className="text-xs font-bold text-slate-300">
                                <span className="text-cyan-400">LVL {user.level || 1}</span>
                            </div>
                            <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                                    style={{ width: `${user.levelProgress || 0}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                ⭐ {(user.xp || 0).toLocaleString()} XP
                            </span>
                        </div>

                        <div className="w-px h-5 bg-slate-800"></div>

                        {/* Streak Counter */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-950/30 px-3 py-1 rounded-full border border-orange-500/30">
                            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
                            <span>{user.currentStreak || 0} DAY STREAK</span>
                        </div>
                    </div>
                )}

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                        title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
                    </button>

                    <button
                        onClick={() => handleNav('badges')}
                        className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${activeTab === 'badges'
                                ? 'bg-purple-900/40 border-purple-500 text-purple-300'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-purple-400'
                            }`}
                    >
                        <Award className="w-5 h-5 text-purple-400" />
                        <span className="hidden sm:inline">Badges</span>
                    </button>

                    <button
                        onClick={() => handleNav('profile')}
                        className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${activeTab === 'profile'
                                ? 'bg-cyan-900/40 border-cyan-500 text-cyan-300'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-cyan-400'
                            }`}
                    >
                        <User className="w-5 h-5 text-cyan-400" />
                        <span className="hidden sm:inline">{user?.username || 'Profile'}</span>
                    </button>

                    <button
                        onClick={() => handleNav('settings')}
                        className={`p-2 rounded-xl border transition-colors ${activeTab === 'settings'
                                ? 'bg-slate-700 border-cyan-500 text-cyan-400'
                                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                            }`}
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </header>
    );
}
