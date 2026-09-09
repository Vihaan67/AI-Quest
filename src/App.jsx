import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LessonModal from './components/LessonModal';
import HardQuizModal from './components/HardQuizModal';
import OnboardingModal from './components/OnboardingModal';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import AuthModal from './components/AuthModal';
import MobileNav from './components/MobileNav';
import { playSound } from './utils/audio';

export default function App() {
    const [token, setToken] = useState(localStorage.getItem('ai_quest_token') || '');
    const [userProfile, setUserProfile] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [todaysQuest, setTodaysQuest] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

    // Modals state (Login modal disabled by default)
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeHardQuiz, setActiveHardQuiz] = useState(null);
    const [loadingLesson, setLoadingLesson] = useState(false);

    // Register Service Worker for push notifications & schedule 4:15 PM check
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
                console.warn('SW registration warning:', err);
            });
        }

        // Schedule 4:15 PM local notification alarm check
        const checkSchedule = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 16 && now.getMinutes() === 15 && now.getSeconds() < 10) {
                if (Notification.permission === 'granted') {
                    new Notification('🧠 Your AI Quest is ready!', {
                        body: 'Your 30-minute daily AI mission is waiting. Complete today\'s quest now!',
                        icon: '/favicon.ico'
                    });
                }
            }
        }, 10000);

        return () => clearInterval(checkSchedule);
    }, []);

    // Ensure an active token exists automatically (Auto-login guest explorer)
    useEffect(() => {
        if (!token) {
            autoLoginGuest();
        } else {
            fetchUserData();
            fetchCurriculum();
        }
    }, [token]);

    const autoLoginGuest = async () => {
        try {
            const guestUsername = 'AI_Explorer';
            const guestPassword = 'quest_password_2026';

            // Try login first
            let res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: guestUsername, password: guestPassword })
            });

            if (!res.ok) {
                // Register if guest doesn't exist yet
                res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: guestUsername,
                        password: guestPassword,
                        knowledgeLevel: 'basics',
                        goalRole: 'AI Explorer'
                    })
                });
            }

            const data = await res.json();
            if (data.token) {
                localStorage.setItem('ai_quest_token', data.token);
                setToken(data.token);
            }
        } catch (err) {
            console.error('Auto guest login error:', err);
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await fetch('/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUserProfile(data);
            } else {
                localStorage.removeItem('ai_quest_token');
                setToken('');
            }
        } catch (err) {
            console.error('Fetch profile error:', err);
        }
    };

    const fetchCurriculum = async () => {
        try {
            const res = await fetch('/api/curriculum', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCurriculum(data.curriculum || []);
                setTodaysQuest(data.todaysQuest);
            }
        } catch (err) {
            console.error('Fetch curriculum error:', err);
        }
    };

    const handleLogin = async ({ username, password }) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        localStorage.setItem('ai_quest_token', data.token);
        setToken(data.token);
        setShowAuthModal(false);
    };

    const handleRegister = async ({ username, password }) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        localStorage.setItem('ai_quest_token', data.token);
        setToken(data.token);
        setShowAuthModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('ai_quest_token');
        setToken('');
        setUserProfile(null);
        autoLoginGuest();
    };

    // Onboarding completion
    const handleCompleteOnboarding = async ({ knowledgeLevel, goalRole }) => {
        setShowOnboarding(false);
        await fetchUserData();
        await fetchCurriculum();
    };

    // Start a lesson/quest
    const handleStartQuest = async (topicId) => {
        setLoadingLesson(true);
        try {
            const res = await fetch(`/api/lessons/${topicId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-gemini-api-key': apiKey
                }
            });
            if (res.ok) {
                const lessonData = await res.json();
                setActiveLesson(lessonData);
            }
        } catch (err) {
            console.error('Error starting quest:', err);
        } finally {
            setLoadingLesson(false);
        }
    };

    // Complete lesson callback
    const handleCompleteLesson = async (payload) => {
        const res = await fetch('/api/lessons/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await fetchUserData();
        await fetchCurriculum();
        return data;
    };

    // Complete hard quiz callback
    const handleCompleteHardQuiz = async (payload) => {
        const res = await fetch('/api/quizzes/hard/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        await fetchUserData();
        return data;
    };

    // Settings save
    const handleSaveSettings = async (settingsPayload) => {
        await fetch('/api/settings/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(settingsPayload)
        });
        await fetchUserData();
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">

            {/* Top Header Navbar */}
            <Navbar
                user={userProfile?.user}
                stats={userProfile?.stats}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Container */}
            <main className="flex-1 pb-20 md:pb-8">
                {activeTab === 'dashboard' && (
                    <Dashboard
                        user={userProfile?.user}
                        curriculum={curriculum}
                        todaysQuest={todaysQuest}
                        onStartQuest={handleStartQuest}
                        onSelectTopic={handleStartQuest}
                        soundEnabled={soundEnabled}
                    />
                )}

                {(activeTab === 'profile' || activeTab === 'badges') && (
                    <ProfileView profileData={userProfile} />
                )}

                {activeTab === 'settings' && (
                    <SettingsView
                        settings={userProfile?.settings}
                        onSaveSettings={handleSaveSettings}
                        onLogout={handleLogout}
                        soundEnabled={soundEnabled}
                        setSoundEnabled={setSoundEnabled}
                        apiKey={apiKey}
                        setApiKey={setApiKey}
                    />
                )}
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} soundEnabled={soundEnabled} />

            {/* Modals */}
            {showAuthModal && (
                <AuthModal onLogin={handleLogin} onRegister={handleRegister} soundEnabled={soundEnabled} />
            )}

            {showOnboarding && (
                <OnboardingModal onCompleteOnboarding={handleCompleteOnboarding} soundEnabled={soundEnabled} />
            )}

            {activeLesson && (
                <LessonModal
                    lesson={activeLesson}
                    onClose={() => setActiveLesson(null)}
                    onCompleteLesson={handleCompleteLesson}
                    soundEnabled={soundEnabled}
                />
            )}

            {activeHardQuiz && (
                <HardQuizModal
                    lesson={activeHardQuiz}
                    onClose={() => setActiveHardQuiz(null)}
                    onCompleteHardQuiz={handleCompleteHardQuiz}
                    soundEnabled={soundEnabled}
                />
            )}

            {/* Loading Overlay */}
            {loadingLesson && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-extrabold text-cyan-400 animate-pulse">Generating AI Quest...</span>
                </div>
            )}

        </div>
    );
}
