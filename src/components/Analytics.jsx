import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatDate, getLast40Days } from '../lib/utils';
import { motion } from 'framer-motion';

export default function Analytics({ habits, logs }) {
    const data = useMemo(() => {
        const days = getLast40Days();
        return days.map(d => {
            const dateStr = formatDate(d);
            const completedCount = logs.filter(l => l.date === dateStr).length;
            const totalHabits = habits.length;
            const percentage = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

            return {
                date: dateStr,
                day: d.getDate(),
                label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                score: percentage
            };
        });
    }, [habits, logs]);

    const currentScore = data[data.length - 1]?.score || 0;
    const averageScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / data.length) || 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Today's Score", value: currentScore, isPercent: true, delay: 0 },
                    { label: "Average (40d)", value: averageScore, isPercent: true, delay: 0.1 },
                    { label: "Active Habits", value: habits.length, isPercent: false, delay: 0.2 },
                    { label: "Total Checks", value: logs.length, isPercent: false, delay: 0.3 }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stat.delay }}
                        className="bg-white border rounded-xl p-0 overflow-hidden shadow-sm flex flex-col relative"
                    >
                        <div className="bg-[#65a30d] text-white p-2 text-center text-sm font-bold uppercase tracking-wide">
                            {stat.label}
                        </div>
                        <div className="p-6 flex items-center justify-center bg-[#f7fee7] flex-1">
                            {stat.isPercent ? (
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#d9f99d"
                                            strokeWidth="10"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#65a30d"
                                            strokeWidth="10"
                                            fill="transparent"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 - (251.2 * stat.value) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-2xl font-bold text-[#3f6212]">{stat.value}%</span>
                                </div>
                            ) : (
                                <span className="text-5xl font-bold text-[#3f6212]">{stat.value}</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel p-6 h-[400px]"
            >
                <h3 className="mb-6 font-display font-semibold text-lg flex items-center gap-2">
                    Performance History
                    <span className="text-xs font-normal text-gray-500 bg-[#222] px-2 py-0.5 rounded-full">Last 40 Days</span>
                </h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="#333" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="day"
                                stroke="#666"
                                tick={{ fill: '#888', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                interval={4}
                                dy={10}
                            />
                            <YAxis
                                stroke="#666"
                                tick={{ fill: '#888', fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                unit="%"
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ background: '#121212', border: '1px solid #333', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#fff', fontSize: '13px' }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="var(--primary-color)"
                                fillOpacity={1}
                                fill="url(#colorScore)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}
