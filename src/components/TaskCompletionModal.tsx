import React from 'react';
import { CheckCircle2, Clock, X, Sparkles, HelpCircle, Tag, BatteryCharging, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskCompletionModalProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: (task: Task) => void;
  onClose: () => void;
}

export const TaskCompletionModal: React.FC<TaskCompletionModalProps> = ({
  isOpen,
  task,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !task) return null;

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
  };

  return (
    <div 
      id="task-completion-modal-backdrop" 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div 
        id="task-completion-modal-card" 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col scale-100 transition-all border-t-4 border-t-emerald-500"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black font-fun text-slate-900 dark:text-white flex items-center gap-1.5">
                Complete Task
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirm your progress
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2.5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Did you finish this task?
            </p>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800/60">
                <Clock className="w-3 h-3 text-indigo-500" />
                {formatMinutes(task.estimatedMinutes)}
              </span>

              {task.category && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                  <Tag className="w-2.5 h-2.5 text-slate-500" />
                  {task.category}
                </span>
              )}

              {task.energyLevel && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                  <BatteryCharging className="w-2.5 h-2.5 text-emerald-500" />
                  {task.energyLevel} energy
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center px-2 leading-relaxed">
            Logging your completion updates your schedule timeline, unblocks dependent tasks, and keeps your daily momentum strong!
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="btn-cancel-completion"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            Not Yet
          </button>

          <button
            type="button"
            id="btn-confirm-completion"
            onClick={() => onConfirm(task)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Yes, I Completed It!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
