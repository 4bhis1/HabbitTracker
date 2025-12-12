import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const getLast40Days = () => {
    const days = [];
    const today = new Date();
    // Generate past 39 days + today
    for (let i = 39; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d);
    }
    return days;
};

export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
