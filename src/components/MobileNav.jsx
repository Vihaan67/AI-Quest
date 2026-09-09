import React from 'react';
import { Home, BookOpen, Award, User, Settings } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function MobileNav({ activeTab, setActiveTab, soundEnabled }) {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'learn', label: 'Learn', icon: BookOpen },
        { id: 'badges', label: 'Badges', icon: Award },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-2">
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id || (item.id === 'learn' && activeTab === 'dashboard');
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                playSound('click', soundEnabled);
                                setActiveTab(item.id === 'learn' ? 'dashboard' : item.id);
                            }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-all ${isActive ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
