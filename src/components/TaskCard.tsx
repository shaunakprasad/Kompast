import React, { useState } from 'react';
import { Clock, AlertCircle, Trash2, Edit2, ChevronDown, ChevronUp, CheckSquare, Square, BatteryCharging, Tag, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  isCompleted?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onRequestComplete?: (task: Task) => void;
  onToggleComplete?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isCompleted = false,
  onEdit,
  onDelete,
  onToggleSubtask,
  onRequestComplete,
  onToggleComplete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted) {
      if (onToggleComplete) onToggleComplete(task);
    } else {
      if (onRequestComplete) {
        onRequestComplete(task);
      } else if (onToggleComplete) {
        onToggleComplete(task);
      }
    }
  };

  const getImportanceBadge = (importance: Task['importance']) => {
    switch (importance) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase tracking-wider">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Medium</span>;
      case 'low':
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">Low</span>;
    }
  };

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
  };

  return (
    <div 
      id={`task-card-${task.id}`}
      className={`rounded-xl p-4 transition-all shadow-xs hover:shadow-md group border ${
        isCompleted
          ? 'bg-slate-100/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-75'
          : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Complete Toggle Checkbox */}
        <button
          type="button"
          id={`btn-complete-toggle-${task.id}`}
          onClick={handleCompleteClick}
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600'
              : 'border-2 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-transparent hover:text-emerald-500'
          }`}
          title={isCompleted ? "Mark task as incomplete" : "Complete this task"}
        >
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'block' : 'opacity-0 group-hover:opacity-60'}`} />
        </button>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            {isCompleted ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            ) : (
              getImportanceBadge(task.importance)
            )}

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/80">
              <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              {formatMinutes(task.estimatedMinutes)}
            </span>

            {task.category && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {task.category}
              </span>
            )}

            {task.energyLevel && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                <BatteryCharging className="w-2.5 h-2.5 text-emerald-500" />
                {task.energyLevel} energy
              </span>
            )}
          </div>

          <h3 className={`text-sm font-bold transition-colors ${
            isCompleted 
              ? 'line-through text-slate-400 dark:text-slate-500' 
              : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-200'
          }`}>
            {task.title}
          </h3>

          {task.description && (
            <p className={`text-xs mt-1 line-clamp-2 ${isCompleted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>
              {task.description}
            </p>
          )}

          {task.deadline && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300/90 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              Deadline: {task.deadline}
            </div>
          )}
        </div>

        {/* Action icons & Complete Button */}
        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Direct Complete Button */}
          {!isCompleted ? (
            <button
              type="button"
              id={`btn-complete-action-${task.id}`}
              onClick={handleCompleteClick}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              title="Complete this task"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Complete</span>
            </button>
          ) : (
            <button
              type="button"
              id={`btn-completed-badge-${task.id}`}
              onClick={handleCompleteClick}
              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1 cursor-pointer"
              title="Click to mark incomplete"
            >
              <span>Undo</span>
            </button>
          )}

          <button
            id={`btn-edit-task-${task.id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`btn-delete-task-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtasks Accordion */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 py-0.5"
          >
            <span>Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-1.5 pl-1">
              {task.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onToggleSubtask(task.id, st.id)}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  {st.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  )}
                  <span className={st.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

