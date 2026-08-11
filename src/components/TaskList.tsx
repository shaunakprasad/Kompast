import React, { useState } from 'react';
import { Plus, Brain, Zap, Clock, CheckCircle2, Search, Filter, Layers, Trash2, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onOpenAddTask: () => void;
  onOpenBrainDump: () => void;
  onLoadPreset: () => void;
  onLoadStudentPreset?: () => void;
  onLoadWorkerPreset?: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClearAll: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onQuickAddTask?: (title: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onOpenAddTask,
  onOpenBrainDump,
  onLoadPreset,
  onLoadStudentPreset,
  onLoadWorkerPreset,
  onEditTask,
  onDeleteTask,
  onClearAll,
  onToggleSubtask,
  onQuickAddTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [quickInput, setQuickInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    if (onQuickAddTask) {
      onQuickAddTask(quickInput.trim());
    }
    setQuickInput('');
  };

  const categories = Array.from(new Set(tasks.map(t => t.category || 'General')));

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || (t.category || 'General') === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const totalHoursStr = (totalMinutes / 60).toFixed(1);
  const criticalCount = tasks.filter(t => t.importance === 'critical' || t.importance === 'high').length;

  return (
    <div id="task-list-container" className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md text-slate-900 dark:text-slate-100 flex flex-col h-full transition-colors">
      {/* Header & Stats */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 id="task-queue-title" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Task Queue
              <span id="task-count-pill" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                {tasks.length}
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {totalHoursStr}h total ({totalMinutes}m)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {tasks.length === 0 && (
            <button
              id="btn-load-sample"
              onClick={onLoadPreset}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span>Load Sample</span>
            </button>
          )}

          {tasks.length > 0 && (
            <button
              id="btn-clear-all"
              onClick={onClearAll}
              className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1"
              title="Clear all tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Input Bar */}
      <form onSubmit={handleQuickSubmit} className="pt-3 pb-2 flex items-center gap-2">
        <input
          id="quick-task-input"
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="Type a task and press Enter... (e.g. Call vendor at 2pm)"
          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* Search & Filter Bar */}
      {tasks.length > 0 && (
        <div className="py-3 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="input-search-tasks"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="select-filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all" className="bg-slate-950 text-slate-200">All Categories</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat} className="bg-slate-950 text-slate-200">{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[320px]">
        {tasks.length === 0 ? (
          <div id="empty-task-state" className="h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 my-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-600/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mb-3 shadow-md shadow-indigo-500/10">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
              Ready to win your day?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
              Type any task in the box above and press <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">Enter</kbd>, or click a quick starter below:
            </p>

            {/* Quick Starter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mb-6">
              {[
                'Write weekly summary',
                'Reply to priority emails',
                'Take 20-min exercise break',
                'Review project milestones',
                'Read research paper'
              ].map((starter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onQuickAddTask && onQuickAddTask(starter)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900/80 hover:bg-indigo-50 dark:hover:bg-indigo-600/20 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-200 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all flex items-center gap-1 active:scale-95 shadow-xs"
                >
                  <span>{starter}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 w-full max-w-sm">
              <span className="text-[11px] font-bold text-slate-400 block">Quick 1-Click Starter Schedules:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="empty-btn-student"
                  onClick={onLoadStudentPreset || onLoadPreset}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Student Study Pack</span>
                </button>
                <button
                  id="empty-btn-worker"
                  onClick={onLoadWorkerPreset || onLoadPreset}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Professional Work Pack</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  id="empty-btn-braindump"
                  onClick={onOpenBrainDump}
                  className="w-full px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Paste Brain Dump / Text</span>
                </button>
              </div>
            </div>
          </div>

        ) : filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No tasks matching "{searchTerm}"
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleSubtask={onToggleSubtask}
            />
          ))
        )}
      </div>
    </div>
  );
};
