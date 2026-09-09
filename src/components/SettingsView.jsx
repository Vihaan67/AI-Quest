import React, { useState } from 'react';
import { Bell, Volume2, Shield, Key, LogOut, Save, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function SettingsView({ settings, onSaveSettings, onLogout, soundEnabled, setSoundEnabled, apiKey, setApiKey }) {
    const [dailyTime, setDailyTime] = useState(settings?.daily_time || '16:15');
    const [hardQuizReminder, setHardQuizReminder] = useState(Boolean(settings?.hard_quiz_reminder ?? true));
    const [notificationPermission, setNotificationPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );
    const [tempApiKey, setTempApiKey] = useState(apiKey || '');
    const [savedSuccess, setSavedSuccess] = useState(false);

    const requestNotificationPermission = async () => {
        if (typeof Notification !== 'undefined') {
            const perm = await Notification.requestPermission();
            setNotificationPermission(perm);
            if (perm === 'granted') {
                new Notification('🧠 AI Quest Ready!', {
                    body: 'Push notifications activated! You will receive daily quests at 4:15 PM.',
                    icon: '/favicon.ico'
                });
            }
        }
    };

    const handleSave = () => {
        playSound('correct', soundEnabled);
        setApiKey(tempApiKey);
        localStorage.setItem('gemini_api_key', tempApiKey);

        onSaveSettings({
            dailyTime,
            hardQuizReminder,
            soundEffects: soundEnabled ? 1 : 0
        });

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-white">SETTINGS & PREFERENCES</h2>
                    <p className="text-xs text-slate-400">Configure your daily learning schedule, notifications, and AI model keys.</p>
                </div>
            </div>

            {/* 1. Daily Push Notifications */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <span>Daily Push Notifications</span>
                </h3>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <div>
                            <span className="font-bold text-sm text-slate-200 block">Browser Push Notifications</span>
                            <span className="text-xs text-slate-400">
                                Receive browser alert at your preferred time daily. Status: <span className="font-semibold text-cyan-400">{notificationPermission}</span>
                            </span>
                        </div>
                        {notificationPermission !== 'granted' ? (
                            <button
                                onClick={requestNotificationPermission}
                                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0"
                            >
                                Enable Notifications
                            </button>
                        ) : (
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                                ✓ Enabled
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <div>
                            <span className="font-bold text-sm text-slate-200 block">Daily Notification Time</span>
                            <span className="text-xs text-slate-400">Default target: 4:15 PM local time</span>
                        </div>
                        <input
                            type="time"
                            value={dailyTime}
                            onChange={(e) => setDailyTime(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <div>
                            <span className="font-bold text-sm text-slate-200 block">Hard Quiz Reminder (2nd Notification)</span>
                            <span className="text-xs text-slate-400">Receive an evening notification to challenge the Hard Boss Battle</span>
                        </div>
                        <button
                            onClick={() => setHardQuizReminder(!hardQuizReminder)}
                            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${hardQuizReminder ? 'bg-cyan-500' : 'bg-slate-800'
                                }`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${hardQuizReminder ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            ></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Audio & AI Model API Key */}
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-purple-400" />
                    <span>Sound & AI API Keys</span>
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <div>
                            <span className="font-bold text-sm text-slate-200 block">Sound FX & Audio Synthesizer</span>
                            <span className="text-xs text-slate-400">Play celebratory audio cues for correct answers and quest completions</span>
                        </div>
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${soundEnabled ? 'bg-purple-500' : 'bg-slate-800'
                                }`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            ></div>
                        </button>
                    </div>

                    <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <span className="font-bold text-sm text-slate-200 block">Custom Gemini API Key (Optional)</span>
                        <p className="text-xs text-slate-400">
                            Provide your own Gemini API key for live dynamic AI generation. If left blank, AI Quest uses built-in smart dynamic curriculum templates.
                        </p>
                        <input
                            type="password"
                            placeholder="AIzaSy..."
                            value={tempApiKey}
                            onChange={(e) => setTempApiKey(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded-xl p-3 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Save Settings & Logout */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handleSave}
                    className="px-8 py-3.5 rounded-xl glow-btn text-white font-extrabold text-sm flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    <span>SAVE PREFERENCES</span>
                </button>

                {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Saved!
                    </span>
                )}

                <button
                    onClick={() => {
                        playSound('click', soundEnabled);
                        onLogout();
                    }}
                    className="px-6 py-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 font-bold text-xs flex items-center gap-2"
                >
                    <LogOut className="w-4 h-4" />
                    <span>SIGN OUT</span>
                </button>
            </div>

        </div>
    );
}
