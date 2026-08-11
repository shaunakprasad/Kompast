import React, { useState, useEffect } from 'react';
import { Moon, Sun, X, Check, Clock, Sparkles, SlidersHorizontal, Calendar, Zap } from 'lucide-react';
import { BedtimeSchedule, DayOfWeek } from '../types';
import { DEFAULT_BEDTIME_SCHEDULE, formatTime24to12 } from '../data/defaultBedtime';

interface BedtimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: BedtimeSchedule;
  onSaveSchedule: (newSchedule: BedtimeSchedule) => void;
  isFirstTimeOnboarding?: boolean;
}

const DAYS: { id: DayOfWeek; label: string; short: string }[] = [
  { id: 'monday', label: 'Monday', short: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'thursday', label: 'Thursday', short: 'Thu' },
  { id: 'friday', label: 'Friday', short: 'Fri' },
  { id: 'saturday', label: 'Saturday', short: 'Sat' },
  { id: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const BedtimeModal: React.FC<BedtimeModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSaveSchedule,
  isFirstTimeOnboarding = false,
}) => {
  const [localSchedule, setLocalSchedule] = useState<BedtimeSchedule>(schedule);
  const [viewMode, setViewMode] = useState<'simple' | 'custom'>('simple');

  useEffect(() => {
    setLocalSchedule(schedule);
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  // Simple Mode Helpers
  const weekdayWake = localSchedule.monday.wakeTime;
  const weekdayBed = localSchedule.monday.bedtime;
  const weekendWake = localSchedule.saturday.wakeTime;
  const weekendBed = localSchedule.saturday.bedtime;

  const handleSimpleWeekdayChange = (field: 'wakeTime' | 'bedtime', value: string) => {
    const weekdays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    setLocalSchedule((prev) => {
      const updated = { ...prev };
      weekdays.forEach((d) => {
        updated[d] = { ...updated[d], [field]: value };
      });
      return updated;
    });
  };

  const handleSimpleWeekendChange = (field: 'wakeTime' | 'bedtime', value: string) => {
    const weekends: DayOfWeek[] = ['saturday', 'sunday'];
    setLocalSchedule((prev) => {
      const updated = { ...prev };
      weekends.forEach((d) => {
        updated[d] = { ...updated[d], [field]: value };
      });
      return updated;
    });
  };

  const handleChangeTime = (day: DayOfWeek, field: 'bedtime' | 'wakeTime', val: string) => {
    setLocalSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: val,
      },
    }));
  };

  const handleSave = () => {
    onSaveSchedule(localSchedule);
    onClose();
  };

  return (
    <div id="bedtime-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="bedtime-modal-card" className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Moon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-black font-fun text-white flex items-center gap-2">
                Sleep & Focus Hours
                {isFirstTimeOnboarding && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Startup Setup
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Set sleep times so AI planning stops before your bedtime.
              </p>
            </div>
          </div>

          {!isFirstTimeOnboarding && (
            <button
              id="btn-close-bedtime"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* View Switcher Bar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Schedule Mode:</span>
          <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'simple'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simple (Weekdays/Weekend)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('custom')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'custom'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Custom Per-Day</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {viewMode === 'simple' ? (
            /* SIMPLE MODE - 2 Clean Cards */
            <div className="space-y-4">
              {/* Weekdays Card */}
              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <span className="text-xs font-black font-fun text-white">Weekdays (Mon – Fri)</span>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    5 Days
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Wake-Up</span>
                    </label>
                    <input
                      type="time"
                      value={weekdayWake}
                      onChange={(e) => handleSimpleWeekdayChange('wakeTime', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Bedtime</span>
                    </label>
                    <input
                      type="time"
                      value={weekdayBed}
                      onChange={(e) => handleSimpleWeekdayChange('bedtime', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-indigo-300 text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>Active Window:</span>
                  <span className="font-bold text-amber-300">
                    {formatTime24to12(weekdayWake)} – {formatTime24to12(weekdayBed)}
                  </span>
                </div>
              </div>

              {/* Weekend Card */}
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-black font-fun text-white">Weekends (Sat & Sun)</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                    2 Days
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Wake-Up</span>
                    </label>
                    <input
                      type="time"
                      value={weekendWake}
                      onChange={(e) => handleSimpleWeekendChange('wakeTime', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Bedtime</span>
                    </label>
                    <input
                      type="time"
                      value={weekendBed}
                      onChange={(e) => handleSimpleWeekendChange('bedtime', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-indigo-300 text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>Active Window:</span>
                  <span className="font-bold text-amber-300">
                    {formatTime24to12(weekendWake)} – {formatTime24to12(weekendBed)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* CUSTOM PER-DAY MODE */
            <div className="space-y-2">
              {DAYS.map(({ id, label }) => {
                const cfg = localSchedule[id] || DEFAULT_BEDTIME_SCHEDULE[id];
                const isWeekend = id === 'saturday' || id === 'sunday';

                return (
                  <div
                    key={id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <span className={`w-2 h-2 rounded-full ${isWeekend ? 'bg-amber-400' : 'bg-indigo-400'}`} />
                      <span className="font-bold text-white text-xs font-fun">{label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Sun className="w-3 h-3 text-amber-400 shrink-0" />
                        <input
                          type="time"
                          value={cfg.wakeTime}
                          onChange={(e) => handleChangeTime(id, 'wakeTime', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <Moon className="w-3 h-3 text-indigo-400 shrink-0" />
                        <input
                          type="time"
                          value={cfg.bedtime}
                          onChange={(e) => handleChangeTime(id, 'bedtime', e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLocalSchedule(DEFAULT_BEDTIME_SCHEDULE)}
            className="text-xs text-slate-400 hover:text-white underline font-medium"
          >
            Reset Defaults
          </button>

          <div className="flex items-center gap-3">
            {!isFirstTimeOnboarding && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Save Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
