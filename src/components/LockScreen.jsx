import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowRight, ShieldCheck, Info, X, LayoutGrid } from 'lucide-react';

export default function LockScreen({ onUnlock }) {
    const [password, setPassword] = useState('');
    const [storedPassword, setStoredPassword] = useState(null);
    const [error, setError] = useState(false);

    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('habit_tracker_password');
        if (saved) {
            setStoredPassword(saved);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password) return;

        if (!storedPassword) {
            // Set new password
            localStorage.setItem('habit_tracker_password', password);
            setStoredPassword(password);
            onUnlock();
        } else {
            // Verify password
            if (password === storedPassword) {
                onUnlock();
            } else {
                setError(true);
                setTimeout(() => setError(false), 2000); // 2s shake effect
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300 relative">
                <button
                    onClick={() => setShowInfo(true)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#16a34a] transition-colors"
                >
                    <Info size={20} />
                </button>

                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {storedPassword ? (
                        <Lock className="text-green-600" size={32} />
                    ) : (
                        <ShieldCheck className="text-green-600" size={32} />
                    )}
                </div>

                <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
                    {storedPassword ? 'Welcome Back' : 'Secure Your Tracker'}
                </h1>

                <p className="text-gray-500 mb-8">
                    {storedPassword
                        ? 'Enter your password to access your quest log.'
                        : 'Set a password to keep your habits private.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            autoFocus
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg tracking-widest outline-none transition-all
                ${error
                                    ? 'border-red-500 bg-red-50 text-red-900 animate-pulse'
                                    : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                                }`}
                            placeholder={storedPassword ? "••••••••" : "Create Password"}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        {storedPassword ? (
                            <>
                                <span>Unlock</span>
                                <Unlock size={18} />
                            </>
                        ) : (
                            <>
                                <span>Set Password</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-xs text-gray-400">
                    Passcode is stored locally in your browser.
                </p>
            </div>

            {/* Info Modal */}
            {showInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowInfo(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <LayoutGrid className="text-green-600" size={24} />
                            </div>
                            <h2 className="text-xl font-bold font-display text-gray-900">About Level Up</h2>
                        </div>

                        <div className="space-y-4 text-left text-gray-600 text-sm">
                            <p>
                                <strong className="text-gray-900">Level Up</strong> is a minimalist, gamified habit tracker designed to help you stay consistent with your daily goals.
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Privacy First:</strong> Your data and password are stored 100% locally on your device. Nothing is sent to the cloud.</li>
                                <li><strong>Visual Progress:</strong> Track your streaks with a spreadsheet-style view and beautiful analytics.</li>
                                <li><strong>Secure:</strong> A simple lock screen keeps your personal growth journey private.</li>
                            </ul>
                            <p className="pt-2 italic text-xs text-center border-t border-gray-100 mt-4">
                                "Success is the sum of small efforts, repeated day in and day out."
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
