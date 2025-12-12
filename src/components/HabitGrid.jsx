import React, { useEffect, useRef } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { formatDate, getLast40Days } from '../lib/utils';
import { motion } from 'framer-motion';

export default function HabitGrid({ habits, logs, onToggle, onDelete }) {
    const scrollRef = useRef(null);
    // Chronological order: Oldest -> Newest (Today is last)
    const days = getLast40Days();

    // Scroll to end (right) on mount to show Today
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [habits]);

    const isCompleted = (habitId, dateStr) => {
        return logs.some(l => l.habitId === habitId && l.date === dateStr);
    };

    return (
        <div className="glass-panel flex flex-col h-full bg-[#111] overflow-hidden rounded-xl border border-[#333]">
            {/* Main Header / Top Bar similar to screenshot 'November' block */}
            <div className="bg-[#e4e4e7] text-black p-4 flex flex-col md:flex-row justify-between items-center border-b border-[#ccc] gap-4">
                <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-gray-800">My Quest Log</h2>
                <div className="flex gap-8 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <div className="flex flex-col items-center">
                        <span>Habits</span>
                        <span className="text-lg text-black">{habits.length}</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto relative custom-scrollbar flex-1 bg-white" ref={scrollRef}>
                <table className="w-full text-left border-collapse table-fixed bg-white">
                    <thead className="sticky top-0 z-30 bg-white">
                        <tr>
                            {/* "My Habits" Green Header Box - Responsive Width */}
                            <th className="sticky left-0 z-40 bg-[#dcfce7] p-0 w-[140px] md:w-[240px] min-w-[140px] md:min-w-[240px] border-b border-r border-[#cbd5e1] shadow-[2px_0_5px_rgba(0,0,0,0.05)] h-[80px]">
                                <div className="flex items-center justify-center h-full">
                                    <h3 className="text-lg md:text-xl font-bold text-[#166534] font-display text-center leading-tight">My Habits</h3>
                                </div>
                            </th>

                            {/* Date Headers */}
                            {days.map(d => (
                                <th key={d.toISOString()} className="w-[40px] min-w-[40px] p-0 text-center border-b border-[#e2e8f0] border-r border-[#e2e8f0] bg-white h-[80px] align-bottom pb-2">
                                    <div className="flex flex-col items-center justify-end gap-1 h-full">
                                        <span className="text-[10px] text-gray-400 font-medium uppercase">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className={`text-xs font-bold ${d.getDay() === 0 || d.getDay() === 6 ? 'text-red-500' : 'text-gray-700'
                                            }`}>
                                            {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">{d.getDate()}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {habits.length === 0 && (
                            <tr>
                                <td colSpan={days.length + 1} className="p-12 text-center text-gray-500 italic bg-gray-50">
                                    No habits tracked yet. Create one to start.
                                </td>
                            </tr>
                        )}
                        {habits.map((habit, idx) => (
                            <tr key={habit.id} className="group bg-white hover:bg-gray-50 transition-colors h-[40px]">
                                {/* Habit Name Column - Greenish Tint - Responsive Width */}
                                <td className="sticky left-0 z-20 bg-[#f0fdf4] group-hover:bg-[#dcfce7] border-r border-[#cbd5e1] border-b border-[#e2e8f0] shadow-[2px_0_5px_rgba(0,0,0,0.05)] transition-colors py-2 px-2 md:px-4">
                                    <div className="flex items-center justify-between h-full">
                                        <span className="font-semibold text-sm text-[#14532d] truncate max-w-[100px] md:max-w-[180px]">{habit.name}</span>
                                        <button
                                            onClick={() => onDelete(habit.id)}
                                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-red-400 hover:text-red-600 p-1 rounded"
                                            title="Delete Habit"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>

                                {/* Checkboxes */}
                                {days.map(d => {
                                    const dateStr = formatDate(d);
                                    const checked = isCompleted(habit.id, dateStr);
                                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                                    return (
                                        <td
                                            key={dateStr}
                                            className={`p-0 border-b border-r border-[#e2e8f0] relative text-center ${isWeekend ? 'bg-gray-50' : ''}`}
                                        >
                                            <button
                                                onClick={() => onToggle(habit.id, dateStr)}
                                                className="w-full h-full flex items-center justify-center focus:outline-none p-1.5"
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded-[4px] border transition-all duration-100 flex items-center justify-center
                                                    ${checked
                                                        ? 'bg-[#22c55e] border-[#16a34a] text-white shadow-sm'
                                                        : 'bg-white border-gray-300 hover:border-gray-400'}
                                                `}>
                                                    {checked && <Check size={14} strokeWidth={4} />}
                                                </div>
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
