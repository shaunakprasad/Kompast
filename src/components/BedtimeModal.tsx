import React, { useState, useEffect } from 'react';
import { Moon, Sun, X, Check, Clock, Sparkles, ShieldCheck } from 'lucide-react';
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

  useEffect(() => {
    setLocalSchedule(schedule);
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const handleChangeTime = (day: DayOfWeek, field: 'bedtime' | 'wakeTime', val: string) => {
    setLocalSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: val,
      },
    }));
  };

  const handleApplyToAllWeekdays = (sourceDay: DayOfWeek) => {
    const source = localSchedule[sourceDay];
    const weekdays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    setLocalSchedule((prev) => {
      const updated = { ...prev };
      weekdays.forEach((d) => {
        updated[d] = { ...updated[d], bedtime: source.bedtime, wakeTime: source.wakeTime };
      });
      return updated;
    });
  };

  const handleSave = () => {
    onSaveSchedule(localSchedule);
    onClose();
  };

  return (
    <div id="bedtime-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="bedtime-modal-card" className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Daily Sleep & Bedtime Schedule
                {isFirstTimeOnboarding && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    Startup Setup
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Set your bedtime for each day so task planning stops before sleep time.
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

        {/* Info Banner */}
        <div className="px-6 py-3 bg-indigo-950/30 border-b border-indigo-500/20 flex items-center gap-3 text-xs text-indigo-200">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            <strong>Intuitive Flow Guard:</strong> Master Plan AI will cap task distribution at your bedtime, keeping you well-rested.
          </span>
        </div>

        {/* Body Schedule Form */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {DAYS.map(({ id, label, short }) => {
              const cfg = localSchedule[id] || DEFAULT_BEDTIME_SCHEDULE[id];
              const isWeekend = id === 'saturday' || id === 'sunday';

              return (
                <div
                  key={id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isWeekend
                      ? 'bg-slate-950/80 border-slate-800/80'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className={`w-2 h-2 rounded-full ${isWeekend ? 'bg-amber-400' : 'bg-indigo-400'}`} />
                      <span className="text-xs font-bold text-white">{label}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      {/* Wake time */}
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-slate-400 text-[11px]">Wake:</span>
                        <input
                          type="time"
                          value={cfg.wakeTime}
                          onChange={(e) => handleChangeTime(id, 'wakeTime', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Bedtime */}
                      <div className="flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-slate-400 text-[11px]">Bedtime:</span>
                        <input
                          type="time"
                          value={cfg.bedtime}
                          onChange={(e) => handleChangeTime(id, 'bedtime', e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 12-hour formatted hint */}
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>
                      Active Focus Window: <strong className="text-slate-300">{formatTime24to12(cfg.wakeTime)}</strong> – <strong className="text-indigo-300">{formatTime24to12(cfg.bedtime)}</strong>
                    </span>
                    {id === 'monday' && (
                      <button
                        type="button"
                        onClick={() => handleApplyToAllWeekdays('monday')}
                        className="text-indigo-400 hover:underline text-[10px] font-semibold"
                      >
                        Copy Mon to all Weekdays
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLocalSchedule(DEFAULT_BEDTIME_SCHEDULE)}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Reset to Defaults
          </button>

          <div className="flex items-center gap-3">
            {!isFirstTimeOnboarding && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Bedtime Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
