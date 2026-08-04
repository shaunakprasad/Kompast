import React, { useState } from 'react';
import { Plus, Brain, Zap, Clock, CheckCircle2, Search, Filter, Layers, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onOpenAddTask: () => void;
  onOpenBrainDump: () => void;
  onLoadPreset: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClearAll: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onOpenAddTask,
  onOpenBrainDump,
  onLoadPreset,
  onEditTask,
  onDeleteTask,
  onClearAll,
  onToggleSubtask
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
    <div id="task-list-container" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 flex flex-col h-full">
      {/* Header & Stats */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 id="task-queue-title" className="text-sm font-bold text-white flex items-center gap-2">
              Work Tasks Queue
              <span id="task-count-pill" className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {tasks.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Total Duration: <strong className="text-indigo-300 font-semibold">{totalHoursStr} hours</strong> ({totalMinutes}m) • <strong className="text-amber-300 font-semibold">{criticalCount} high/critical</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length > 0 && (
            <button
              id="btn-clear-all"
              onClick={onClearAll}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1"
              title="Clear all tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            id="btn-list-add-task"
            onClick={onOpenAddTask}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      {tasks.length > 0 && (
        <div className="py-3 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              id="input-search-tasks"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="select-filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Tasks Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[320px]">
        {tasks.length === 0 ? (
          <div id="empty-task-state" className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              No tasks added yet
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-5">
              Add your work tasks with estimates & importance levels, or paste a quick brain dump.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                id="empty-btn-sample"
                onClick={onLoadPreset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Load Sample Tasks
              </button>
              <button
                id="empty-btn-braindump"
                onClick={onOpenBrainDump}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                Paste Brain Dump
              </button>
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
