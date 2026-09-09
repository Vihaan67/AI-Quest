import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, User } from 'lucide-react';
import ByteMascot from './ByteMascot';
import { playSound } from '../utils/audio';

export default function AuthModal({ onLogin, onRegister, soundEnabled }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        playSound('click', soundEnabled);

        if (!username || !password) {
            setErrorMsg('Please enter both username and password.');
            return;
        }

        try {
            if (isRegister) {
                await onRegister({ username, password });
            } else {
                await onLogin({ username, password });
            }
        } catch (err) {
            setErrorMsg(err.message || 'Authentication failed. Please try again.');
            playSound('wrong', soundEnabled);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">

                <div className="text-center space-y-2">
                    <ByteMascot emotion="happy" dialog={isRegister ? "Join AI Quest and start learning daily!" : "Welcome back! Ready for today's quest?"} size="lg" className="justify-center" />
                    <h2 className="text-2xl font-extrabold text-white tracking-wide">
                        {isRegister ? 'CREATE AN ACCOUNT' : 'WELCOME BACK'}
                    </h2>
                    <p className="text-xs text-slate-400">
                        {isRegister ? 'Start your daily 30-minute AI learning journey' : 'Log in to continue your streak and XP progress'}
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs p-3 rounded-xl text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 block">Username</label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="e.g. byte_master"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 text-white font-medium text-xs rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 block">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 text-white font-medium text-xs rounded-xl pl-9 pr-3 py-3 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl glow-btn text-white font-extrabold text-sm flex items-center justify-center gap-2 mt-2"
                    >
                        <span>{isRegister ? 'REGISTER & BEGIN' : 'LOG IN TO QUEST'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center pt-2">
                    <button
                        onClick={() => {
                            playSound('click', soundEnabled);
                            setIsRegister(!isRegister);
                            setErrorMsg('');
                        }}
                        className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                        {isRegister ? 'Already have an account? Log In' : 'Need an account? Create one here'}
                    </button>
                </div>

            </div>
        </div>
    );
}
