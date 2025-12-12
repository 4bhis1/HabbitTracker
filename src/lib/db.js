import { openDB } from 'idb';

const DB_NAME = 'habit-tracker-db';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('habits')) {
        db.createObjectStore('habits', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('logs')) {
        db.createObjectStore('logs', { keyPath: 'id' }); // id: `${habitId}_${dateString}`
      }
    },
  });
};

export const addHabit = async (habit) => {
  const db = await initDB();
  return db.put('habits', habit);
};

export const getHabits = async () => {
  const db = await initDB();
  return db.getAll('habits');
};

export const deleteHabit = async (id) => {
  const db = await initDB();
  await db.delete('habits', id);
  // Also clean up logs for this habit? 
  // For simplicity, we can iterate or just leave them (orphaned). 
  // A proper way would be to get all keys and delete where habitId matches.
};

export const toggleHabitDate = async (habitId, date) => {
  // date should be YYYY-MM-DD string
  const db = await initDB();
  const id = `${habitId}_${date}`;
  const existing = await db.get('logs', id);

  if (existing) {
    await db.delete('logs', id);
    return false; // Removed
  } else {
    await db.put('logs', { id, habitId, date, completedAt: new Date().toISOString() });
    return true; // Added
  }
};

export const getLogs = async () => {
  const db = await initDB();
  return db.getAll('logs');
};

export const cleanupOldLogs = async () => {
  const db = await initDB();
  const logs = await db.getAll('logs');
  const today = new Date();
  const cutoffDate = new Date();
  cutoffDate.setDate(today.getDate() - 40);

  const tx = db.transaction('logs', 'readwrite');
  const store = tx.objectStore('logs');

  for (const log of logs) {
    const logDate = new Date(log.date);
    if (logDate < cutoffDate) {
      store.delete(log.id);
    }
  }
  await tx.done;
};
