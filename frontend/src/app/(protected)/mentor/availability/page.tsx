"use client";

import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import {
    Clock, Plus, Trash2, Save, Check, ChevronDown, AlertCircle, Repeat, Calendar as CalendarIcon
} from 'lucide-react';
import FadeIn from '@/components/dashboard-ui/FadeIn';

// --- Type Definitions ---
interface TimeSlot {
    day: string;
    startTime: string;
    endTime: string;
}

interface ParsedTime {
    hour: number;
    minute: string;
}

interface NotificationState {
    message: string;
    type: "success" | "error";
}

type DailyDurationsMap = Record<string, number>;

// --- Time Helper Functions ---
const parseTime = (time24: string): ParsedTime => {
    if (!time24) return { hour: 9, minute: "00" };
    const [h, m] = time24.split(':');
    return { hour: parseInt(h, 10), minute: m };
};

const formatTime = (hour: number | string, minute: string): string => {
    const h = parseInt(String(hour), 10).toString().padStart(2, '0');
    return `${h}:${minute}`;
};

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const checkConflict = (newSlot: { startTime: string; endTime: string }, existingSlots: TimeSlot[]): boolean => {
    const newStart = timeToMinutes(newSlot.startTime);
    const newEnd = timeToMinutes(newSlot.endTime);

    return existingSlots.some((slot) => {
        const slotStart = timeToMinutes(slot.startTime);
        const slotEnd = timeToMinutes(slot.endTime);
        return Math.max(newStart, slotStart) < Math.min(newEnd, slotEnd);
    });
};

// --- Visual Clock Picker Component ---
interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    align?: 'left' | 'right';
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className = "", align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { hour, minute } = parseTime(value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUpdate = (newHour: number | string, newMinute: string) => {
        const timeString = formatTime(newHour, newMinute);
        onChange(timeString);
    };

    const displayHour = hour.toString().padStart(2, '0');

    // Calculate mobile left/right alignment based on the prop, keeping desktop centered relative to button
    const alignClasses = align === 'right'
        ? 'right-[-10px] sm:right-auto sm:left-1/2 sm:-translate-x-1/2'
        : 'left-[-10px] sm:left-1/2 sm:-translate-x-1/2';

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1 sm:gap-2 outline-none transition-all duration-200 hover:bg-slate-100 rounded-lg px-2 sm:px-3 py-2.5 sm:py-2 min-h-[44px] ${className}`}
            >
                <span className="text-base sm:text-lg font-bold text-slate-700 tabular-nums">
                    {displayHour}:{minute}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] p-3 sm:p-4 w-[220px] sm:w-[240px] animate-in fade-in zoom-in-95 duration-150 ${alignClasses}`}>
                    <div className="flex justify-center mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-baseline gap-1 text-3xl font-black text-slate-800 tracking-tight">
                            {displayHour}:{minute}
                        </div>
                    </div>

                    <div className="flex gap-4 h-48">
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Hour</div>
                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => handleUpdate(h, minute)}
                                        className={`py-2.5 sm:py-1.5 rounded-lg text-sm font-bold transition-colors min-h-[44px] sm:min-h-0 ${hour === h
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        {h.toString().padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-px bg-slate-100 h-full"></div>

                        <div className="flex-1">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Min</div>
                            <div className="grid grid-cols-1 gap-1">
                                {['00', '15', '30', '45'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => handleUpdate(hour, m)}
                                        className={`py-2.5 sm:py-2 rounded-lg text-sm font-bold transition-colors min-h-[44px] sm:min-h-0 ${minute === m
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        :{m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface DurationSelectorProps {
    day: string;
    duration: number;
    onUpdate: (day: string, duration: number) => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({ day, duration, onUpdate }) => (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 w-full sm:w-fit">
        <span className="text-xs sm:text-sm font-bold text-slate-400 px-2 sm:px-3">Duration:</span>
        <div className="flex gap-1 sm:gap-0">
            {[15, 20, 30].map((mins) => (
                <button
                    key={mins}
                    onClick={() => onUpdate(day, mins)}
                    className={`px-3 sm:px-4 py-2.5 sm:py-2 text-sm font-bold rounded-lg transition-all min-h-[44px] sm:min-h-0 ${duration === mins
                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                >
                    {mins}m
                </button>
            ))}
        </div>
    </div>
);

export default function Availability() {
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingInit, setIsLoadingInit] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const [weeklySlots, setWeeklySlots] = useState<TimeSlot[]>([]);
    const initialDurations: DailyDurationsMap = daysOfWeek.reduce((acc: DailyDurationsMap, day) => {
        acc[day] = 30; // default
        return acc;
    }, {});
    const [dailyDurations, setDailyDurations] = useState<DailyDurationsMap>(initialDurations);

    const showNotification = (message: string, type: "success" | "error" = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Load existing availability
    useEffect(() => {
        const loadAvailability = async () => {
            try {
                const res = await fetch("/api/dashboard/profile");
                const data = await res.json();

                if (data.success && data.mentor?.mentorProfile?.availability) {
                    const loadedSlots: TimeSlot[] = [];
                    const loadedDurations: DailyDurationsMap = { ...initialDurations };

                    data.mentor.mentorProfile.availability.forEach((dayObj: any) => {
                        dayObj.slots.forEach((slot: any) => {
                            loadedSlots.push({
                                day: dayObj.day,
                                startTime: slot.startTime,
                                endTime: slot.endTime
                            });
                            // If a slot exists, use its duration as the daily duration to repopulate the UI state
                            loadedDurations[dayObj.day] = slot.sessionDuration || 30;
                        });
                    });

                    setWeeklySlots(loadedSlots);
                    setDailyDurations(loadedDurations);
                }
            } catch (error) {
                console.error("Failed to load availability:", error);
                showNotification("Could not load existing availability settings", "error");
            } finally {
                setIsLoadingInit(false);
            }
        };

        loadAvailability();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Weekly Logic ---
    const addWeeklySlot = (day: string) => {
        const durationForDay = dailyDurations[day] || 30;
        const daySlots = weeklySlots.filter(s => s.day === day);

        // Validation: Maximum 3 slots per day
        if (daySlots.length >= 3) {
            showNotification(`Maximum 3 time slots allowed per day (${day})`, 'error');
            return;
        }

        let startTime = '';
        let endTime = '';
        let found = false;

        for (let i = 0; i < 48; i++) {
            const currentStartMins = 9 * 60 + (i * 30);
            const currentEndMins = currentStartMins + durationForDay;

            if (currentEndMins > 24 * 60) break;

            const sH = Math.floor(currentStartMins / 60);
            const sM = currentStartMins % 60;
            const eH = Math.floor(currentEndMins / 60);
            const eM = currentEndMins % 60;

            const sTime = `${sH.toString().padStart(2, '0')}:${sM.toString().padStart(2, '0')}`;
            const eTime = `${eH.toString().padStart(2, '0')}:${eM.toString().padStart(2, '0')}`;

            if (!checkConflict({ startTime: sTime, endTime: eTime }, daySlots)) {
                startTime = sTime;
                endTime = eTime;
                found = true;
                break;
            }
        }

        if (!found) {
            showNotification('No available time slots found for this day', 'error');
            return;
        }

        setWeeklySlots([...weeklySlots, { day, startTime, endTime }]);
    };

    const removeWeeklySlot = (index: number) => {
        const newSlots = [...weeklySlots];
        newSlots.splice(index, 1);
        setWeeklySlots(newSlots);
    };

    const updateWeeklySlot = (index: number, field: keyof TimeSlot, value: string) => {
        const newSlots = [...weeklySlots];
        const slot = newSlots[index];
        const updatedSlot = { ...slot, [field]: value };

        if (field === 'startTime' && value >= slot.endTime) {
            showNotification('Start time must be before end time', 'error');
            return;
        }
        if (field === 'endTime' && value <= slot.startTime) {
            showNotification('End time must be after start time', 'error');
            return;
        }

        const otherSlots = newSlots.filter((s, i) => s.day === slot.day && i !== index);
        if (checkConflict(updatedSlot, otherSlots)) {
            showNotification('Time slot overlaps with an existing session', 'error');
            return;
        }

        newSlots[index] = { ...newSlots[index], [field]: value };
        setWeeklySlots(newSlots);
    };

    const updateDailyDuration = (day: string, duration: number) => {
        setDailyDurations(prev => ({ ...prev, [day]: duration }));
    };

    const copyToAllDays = (sourceDay: string) => {
        const sourceSlots = weeklySlots.filter(s => s.day === sourceDay);
        const sourceDuration = dailyDurations[sourceDay] || 30;

        const newWeeklySlots: TimeSlot[] = [];
        const newDailyDurations = { ...dailyDurations };

        daysOfWeek.forEach(day => {
            newDailyDurations[day] = sourceDuration;
            if (day === sourceDay) {
                newWeeklySlots.push(...sourceSlots);
            } else {
                sourceSlots.forEach(slot => {
                    newWeeklySlots.push({ ...slot, day });
                });
            }
        });

        // Enforce max 3 slots rule strictly even when copying
        const safeWeeklySlots = newWeeklySlots.filter(s => {
            let count = newWeeklySlots.filter(ns => ns.day === s.day && newWeeklySlots.indexOf(ns) <= newWeeklySlots.indexOf(s)).length;
            return count <= 3;
        });

        setWeeklySlots(safeWeeklySlots);
        setDailyDurations(newDailyDurations);
        if (sourceSlots.length > 3) {
            showNotification(`Copied to all days! (Limited to 3 slots max per day)`, 'success');
        } else {
            showNotification(`Copied ${sourceDay}'s schedule to all days`, 'success');
        }
    };

    const calculateSessions = (start: string, end: string, duration: number): number => {
        if (!start || !end) return 0;
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        const diff = endTotal - startTotal;
        return Math.max(0, Math.floor(diff / duration));
    };

    // --- Save Logic ---
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Group weeklySlots by day and format for the backend payload
            const availabilityPayload = daysOfWeek.map(day => {
                const daySlots = weeklySlots.filter(s => s.day === day).map(s => ({
                    startTime: s.startTime,
                    endTime: s.endTime,
                    sessionDuration: dailyDurations[day] || 30
                }));

                return daySlots.length > 0 ? { day, slots: daySlots } : null;
            }).filter(Boolean); // Remove empty days

            const response = await fetch("/api/dashboard/availability", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ availability: availabilityPayload })
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Availability settings saved successfully!');
            } else {
                showNotification(result.msg || 'Failed to save availability', 'error');
            }
        } catch (error) {
            showNotification('A network error occurred', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            {/* Reuse Calendar Styles */}
            <style>{`
        .custom-calendar.react-calendar { width: 100%; border: none; background: transparent; font-family: inherit; }
        .custom-calendar .react-calendar__navigation { display: flex; height: 48px; margin-bottom: 1rem; align-items: center; }
        .custom-calendar .react-calendar__navigation button { min-width: 44px; background: transparent; border-radius: 12px; font-weight: 700; font-size: 1rem; }
        .custom-calendar .react-calendar__navigation button:enabled:hover { background-color: #f1f5f9; }
        .custom-calendar .react-calendar__month-view__weekdays { text-align: center; text-transform: uppercase; font-weight: 700; font-size: 0.75rem; color: #64748b; margin-bottom: 0.75rem; }
        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
        .custom-calendar .react-calendar__tile { padding: 0.75rem 0.5rem; background: none; font-size: 0.875rem; font-weight: 500; color: #334155; border-radius: 9999px; height: 44px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .custom-calendar .react-calendar__tile:enabled:hover { background-color: #e0e7ff; color: #4f46e5; }
        .custom-calendar .react-calendar__tile--now { background-color: #f1f5f9; color: #0f172a; font-weight: 700; }
        .custom-calendar .react-calendar__tile--active { background-color: #4f46e5 !important; color: white !important; font-weight: 700; box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.39); }
        .has-slots { position: relative; }
        .has-slots::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background-color: #4f46e5; border-radius: 50%; }
        .custom-calendar .react-calendar__tile:disabled { opacity: 0.25; cursor: not-allowed; }
        
        /* Custom Scrollbar for Time Picker */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>

            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 max-w-[1800px] mx-auto flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Availability</h1>
                        <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg font-medium">Manage your weekly schedule</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoadingInit}
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px]"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-50 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm mx-auto md:mx-0">
                        <div className={`${notification.type === 'error' ? 'bg-red-500/20' : 'bg-green-500/20'} p-1.5 rounded-full flex-shrink-0`}>
                            {notification.type === 'error' ? (
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            ) : (
                                <Check className="w-4 h-4 text-green-400" />
                            )}
                        </div>
                        <p className="text-sm font-bold">{notification.message}</p>
                    </div>
                </div>
            )}

            <main className="max-w-[1400px] mx-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 pb-24 md:pb-8">
                {isLoadingInit ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                        <span className="text-slate-500 font-bold tracking-tight">Loading schedule...</span>
                    </div>
                ) : (
                    <FadeIn delay={0.1}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

                            {/* Left: Weekly Schedule */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8">
                                    <div className="mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 border-b border-slate-100">
                                        <div className="flex items-start sm:items-center gap-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Weekly Recurring Schedule</h2>
                                                <p className="text-slate-500 text-xs sm:text-sm font-medium">Set your standard availability. <span className="text-indigo-600 font-semibold">Select a date on the calendar</span> to edit that day of the week.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* (The existing weekly schedule map will go here naturally since it follows the block we just modified) */}

                                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                        {daysOfWeek.map((day) => {
                                            const daySlots = weeklySlots.filter(s => s.day === day);
                                            const hasSlots = daySlots.length > 0;
                                            const durationForDay = dailyDurations[day] || 30;
                                            const isSelectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }) === day;

                                            const totalSessions = daySlots.reduce((acc, slot) => {
                                                return acc + calculateSessions(slot.startTime, slot.endTime, durationForDay);
                                            }, 0);

                                            return (
                                                <div key={day} id={`day-${day}`} className={`group flex flex-col md:flex-row md:items-start gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border transition-all ${isSelectedDay ? 'border-indigo-400 bg-indigo-50/20 shadow-sm ring-1 ring-indigo-500/10' : ''} ${hasSlots && !isSelectedDay ? 'bg-white border-slate-200' : (!isSelectedDay ? 'bg-slate-50/50 border-slate-100' : '')}`}>
                                                    <div className="w-full md:w-32 md:pt-2 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start gap-1">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${hasSlots ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                            <span className={`text-base sm:text-lg font-bold ${hasSlots ? 'text-slate-900' : 'text-slate-400'}`}>{day}</span>
                                                        </div>
                                                        {hasSlots && (
                                                            <span className="text-xs sm:text-sm font-medium text-slate-500 md:pl-5 animate-in fade-in">{totalSessions} session{totalSessions !== 1 ? 's' : ''}</span>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 space-y-4">
                                                        <DurationSelector
                                                            day={day}
                                                            duration={durationForDay}
                                                            onUpdate={updateDailyDuration}
                                                        />
                                                        {hasSlots ? (
                                                            <div className="space-y-3">
                                                                {daySlots.map((slot, idx) => {
                                                                    const realIndex = weeklySlots.indexOf(slot);
                                                                    return (
                                                                        <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-left-2">
                                                                            <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl p-1.5 sm:p-2 pl-2 sm:pl-4 shadow-sm hover:border-indigo-300 transition-colors focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 w-full sm:w-auto mt-2 sm:mt-0">
                                                                                <TimePicker
                                                                                    value={slot.startTime}
                                                                                    onChange={(val) => updateWeeklySlot(realIndex, 'startTime', val)}
                                                                                    align="left"
                                                                                />
                                                                                <span className="text-slate-300 font-light text-base sm:text-lg">|</span>
                                                                                <TimePicker
                                                                                    value={slot.endTime}
                                                                                    onChange={(val) => updateWeeklySlot(realIndex, 'endTime', val)}
                                                                                    align="right"
                                                                                />
                                                                            </div>
                                                                            <button
                                                                                onClick={() => removeWeeklySlot(realIndex)}
                                                                                className="p-2.5 sm:p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                                            >
                                                                                <Trash2 className="w-5 h-5" />
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="pt-1 text-base text-slate-400 italic">Unavailable</div>
                                                        )}
                                                    </div>

                                                    <div className="self-start md:self-center flex flex-row md:flex-col gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => addWeeklySlot(day)}
                                                            className="p-2.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                            title="Add time slot"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => copyToAllDays(day)}
                                                            className="p-2.5 sm:p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                            title="Copy schedule to all days"
                                                        >
                                                            <Repeat className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Calendar Sidebar */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 sticky top-28">
                                    <div className="mb-4 sm:mb-6">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CalendarIcon className="w-5 h-5 text-indigo-500" />
                                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Calendar</h2>
                                        </div>
                                        <p className="text-slate-500 text-xs sm:text-sm font-medium">Click any date to highlight and edit its recurring weekly schedule.</p>
                                    </div>

                                    <div className="bg-slate-50/50 p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100">
                                        <Calendar
                                            minDate={new Date()}
                                            onChange={(value) => {
                                                if (value instanceof Date) {
                                                    setSelectedDate(value);
                                                    const dayName = value.toLocaleDateString('en-US', { weekday: 'long' });
                                                    // Optional smooth scroll to the selected day row
                                                    const element = document.getElementById(`day-${dayName}`);
                                                    if (element) {
                                                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    }
                                                }
                                            }}
                                            value={selectedDate}
                                            className="custom-calendar"
                                            tileClassName={({ date }) => {
                                                // Check if this date's weekday has any slots configured 
                                                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                                                const hasSlots = weeklySlots.some(s => s.day === dayName);
                                                return hasSlots ? 'has-slots' : '';
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                )}
            </main>

            {/* Mobile Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white border-t border-slate-200 md:hidden z-30">
                <button
                    onClick={handleSave}
                    disabled={isSaving || isLoadingInit}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed min-h-[52px]"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
