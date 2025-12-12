import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddHabitModal({ onClose, onAdd }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd({
                id: crypto.randomUUID(),
                name: name.trim(),
                createdAt: new Date().toISOString()
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200 border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold font-display tracking-tight text-gray-900 mb-6">New Habit Quest</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Habit Name</label>
                        <input
                            autoFocus
                            type="text"
                            className="input w-full bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] rounded-lg p-2.5 placeholder-gray-400"
                            placeholder="e.g. Read 10 pages"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-green-900/10 flex items-center justify-center gap-2">
                        Start Habit
                    </button>
                </form>
            </div>
        </div>
    );
}
