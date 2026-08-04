import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Clock, Award, Coffee } from 'lucide-react';
import { MasterPlan, Task } from '../types';

interface FocusRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MasterPlan;
  tasksMap: Map<string, Task>;
  completedTaskIds: Set<string>;
  onToggleTaskCompleted: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const FocusRunnerModal: React.FC<FocusRunnerModalProps> = ({
  isOpen,
  onClose,
  plan,
  tasksMap,
  completedTaskIds,
  onToggleTaskCompleted,
  onToggleSubtask
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Find first uncompleted task when opening
  useEffect(() => {
    if (isOpen && plan.tasks.length > 0) {
      const firstUncompletedIdx = plan.tasks.findIndex(pt => !completedTaskIds.has(pt.taskId));
      if (firstUncompletedIdx !== -1) {
        setCurrentTaskIndex(firstUncompletedIdx);
      } else {
        setCurrentTaskIndex(0);
      }
    }
  }, [isOpen, plan, completedTaskIds]);

  // Set initial timer whenever task index changes
  useEffect(() => {
    if (plan.tasks[currentTaskIndex]) {
      const task = tasksMap.get(plan.tasks[currentTaskIndex].taskId);
      if (task) {
        setTimerSeconds(task.estimatedMinutes * 60);
        setIsTimerRunning(false);
      }
    }
  }, [currentTaskIndex, plan, tasksMap]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !plan.tasks.length) return null;

  const currentPlanTask = plan.tasks[currentTaskIndex];
  const currentTask = tasksMap.get(currentPlanTask.taskId);

  if (!currentTask) return null;

  const isCompleted = completedTaskIds.has(currentTask.id);
  const totalTasks = plan.tasks.length;
  const completedCount = completedTaskIds.size;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(Math.abs(totalSecs) / 60);
    const secs = Math.abs(totalSecs) % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleNextTask = () => {
    if (!isCompleted) {
      onToggleTaskCompleted(currentTask.id);
    }
    if (currentTaskIndex < totalTasks - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  return (
    <div id="focus-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="focus-modal-card" className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Focus Execution Mode
            </span>
            <span className="text-xs text-slate-400">
              Task {currentTaskIndex + 1} of {totalTasks}
            </span>
          </div>

          <button
            id="btn-close-focus"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2 relative">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Active Task Info */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
              <Clock className="w-3.5 h-3.5" /> Scheduled: {currentPlanTask.scheduledStartTime} – {currentPlanTask.scheduledEndTime}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white">
              {currentTask.title}
            </h2>

            {currentTask.description && (
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {currentTask.description}
              </p>
            )}
          </div>

          {/* Timer Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center max-w-sm mx-auto shadow-inner space-y-3">
            <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-indigo-300">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                id="btn-timer-toggle"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                id="btn-timer-reset"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(currentTask.estimatedMinutes * 60);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtasks */}
          {currentTask.subtasks && currentTask.subtasks.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 max-w-md mx-auto">
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                Actionable Checklist
              </h4>
              <div className="space-y-1.5">
                {currentTask.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => onToggleSubtask(currentTask.id, st.id)}
                    className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer p-1.5 rounded hover:bg-slate-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => {}}
                      className="accent-indigo-500 rounded cursor-pointer"
                    />
                    <span className={st.completed ? 'line-through text-slate-500' : ''}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning Rationale */}
          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-200 max-w-md mx-auto">
            <strong className="text-indigo-400">Strategic Positioning: </strong>
            {currentPlanTask.reasoning}
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              id="btn-prev-task"
              disabled={currentTaskIndex === 0}
              onClick={() => setCurrentTaskIndex(currentTaskIndex - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous Task
            </button>

            <button
              id="btn-complete-next"
              onClick={handleNextTask}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Move to Next' : 'Complete & Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
