import React, { useEffect, useState } from 'react';
import { Plus, BarChart2, LayoutGrid } from 'lucide-react';
import {
  initDB,
  getHabits,
  getLogs,
  cleanupOldLogs,
  addHabit,
  toggleHabitDate,
  deleteHabit as deleteHabitDB
} from './lib/db';
import HabitGrid from './components/HabitGrid';
import Analytics from './components/Analytics';
import LockScreen from './components/LockScreen';
import AddHabitModal from './components/AddHabitModal';

function App() {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  const refreshData = async () => {
    await cleanupOldLogs();
    const h = await getHabits();
    const l = await getLogs();
    setHabits(h);
    setLogs(l);
  };

  useEffect(() => {
    initDB().then(() => {
      refreshData().then(() => setLoading(false));
    });
  }, []);

  const handleAddHabit = async (habit) => {
    await addHabit(habit);
    await refreshData();
  };

  const handleToggle = async (habitId, dateStr) => {
    // Optimistic update
    const isCompleted = logs.some(l => l.habitId === habitId && l.date === dateStr);
    if (isCompleted) {
      setLogs(prev => prev.filter(l => !(l.habitId === habitId && l.date === dateStr)));
    } else {
      setLogs(prev => [...prev, { id: `${habitId}_${dateStr}`, habitId, date: dateStr }]);
    }

    // DB update
    await toggleHabitDate(habitId, dateStr);
    // Silent refresh to ensure sync
    const l = await getLogs();
    setLogs(l);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this quest?')) {
      await deleteHabitDB(id);
      await refreshData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#16a34a] font-display tracking-widest animate-pulse">
        LOADING SYSTEM...
      </div>
    );
  }

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 selection:bg-[#22c55e] selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#dcfce7] opacity-60 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-[#f0fdf4] opacity-50 blur-[100px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#16a34a] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
              <LayoutGrid size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight leading-none text-gray-900">Level Up</h1>
              <span className="text-xs text-gray-500 font-bold tracking-widest">HABIT TRACKING SYSTEM</span>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#166534] hover:bg-[#14532d] text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-green-900/10 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            <span>New Quest</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 space-y-12 mt-10 relative z-10">
        {/* Tracker Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-6 ml-1">
            <LayoutGrid className="text-[#16a34a]" size={20} />
            <h2 className="text-xl font-display font-bold tracking-wide text-gray-800">Quest Tracker</h2>
          </div>
          <HabitGrid
            habits={habits}
            logs={logs}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </section>

        {/* Stats Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center gap-2 mb-6 ml-1">
            <BarChart2 className="text-[#16a34a]" size={20} />
            <h2 className="text-xl font-display font-bold tracking-wide text-gray-800">Analytics Dashboard</h2>
          </div>
          <Analytics habits={habits} logs={logs} />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-gray-200 text-center bg-white/50">
        <p className="text-gray-500 text-sm">
          Level Up Habit Tracker • Local Storage Enabled • <a href="https://github.com" target="_blank" className="hover:text-[#16a34a] transition-colors font-medium">GitHub</a>
        </p>
      </footer>

      {showModal && (
        <AddHabitModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddHabit}
        />
      )}
    </div>
  );
}

export default App;
