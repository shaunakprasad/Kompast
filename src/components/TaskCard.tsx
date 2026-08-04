import React, { useState } from 'react';
import { Clock, AlertCircle, Trash2, Edit2, ChevronDown, ChevronUp, CheckSquare, Square, BatteryCharging, Tag } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleSubtask
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all shadow-sm hover:shadow-md group"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            {getImportanceBadge(task.importance)}

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/80">
              <Clock className="w-3 h-3 text-indigo-400" />
              {formatMinutes(task.estimatedMinutes)}
            </span>

            {task.category && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {task.category}
              </span>
            )}

            {task.energyLevel && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                <BatteryCharging className="w-2.5 h-2.5 text-emerald-400" />
                {task.energyLevel} energy
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors">
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {task.deadline && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Deadline: {task.deadline}
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            id={`btn-edit-task-${task.id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            id={`btn-delete-task-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtasks Accordion */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-slate-400 hover:text-slate-200 py-0.5"
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
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none py-1 px-1.5 rounded hover:bg-slate-850"
                >
                  {st.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className={st.completed ? 'line-through text-slate-500' : ''}>
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
