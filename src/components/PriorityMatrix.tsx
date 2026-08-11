import React from 'react';
import { Zap, Target, Coffee, AlertOctagon, Clock } from 'lucide-react';
import { MasterPlan, Task } from '../types';

interface PriorityMatrixProps {
  plan: MasterPlan;
  tasksMap: Map<string, Task>;
}

export const PriorityMatrix: React.FC<PriorityMatrixProps> = ({ plan, tasksMap }) => {
  // Only include tasks that still exist in tasksMap
  const validPlanTasks = plan.tasks.filter(t => tasksMap.has(t.taskId));

  // Group tasks by category
  const quickWins = validPlanTasks.filter(t => t.effortVsImpactCategory === 'quick_win');
  const majorProjects = validPlanTasks.filter(t => t.effortVsImpactCategory === 'major_project');
  const fillIns = validPlanTasks.filter(t => t.effortVsImpactCategory === 'fill_in');
  const hardSlogs = validPlanTasks.filter(t => t.effortVsImpactCategory === 'hard_slog');

  const renderTaskPill = (pt: any) => {
    const task = tasksMap.get(pt.taskId);
    if (!task) return null;

    return (
      <div 
        key={pt.taskId}
        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-colors shadow-xs"
      >
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
            #{pt.order}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            {task.estimatedMinutes}m
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
          {task.title}
        </div>
      </div>
    );
  };

  return (
    <div id="priority-matrix-container" className="space-y-3">
      <div className="px-1">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          2x2 Importance vs Length Matrix
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Evaluates tasks by cognitive impact vs length duration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Quick Wins */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Quick Wins (High Impact, Short)
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                {quickWins.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              High importance, under 45 mins. Knock these out first for momentum.
            </p>
            <div className="space-y-2">
              {quickWins.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">No quick win tasks</div>
              ) : (
                quickWins.map(renderTaskPill)
              )}
            </div>
          </div>
        </div>

        {/* Quadrant 2: Major Projects */}
        <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Major Projects (High Impact, Long)
              </div>
              <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/30">
                {majorProjects.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              High importance, longer duration. Schedule deep focus blocks.
            </p>
            <div className="space-y-2">
              {majorProjects.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">No major project tasks</div>
              ) : (
                majorProjects.map(renderTaskPill)
              )}
            </div>
          </div>
        </div>

        {/* Quadrant 3: Fill-ins */}
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
                <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Fill-ins (Low Impact, Short)
              </div>
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/30">
                {fillIns.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              Low importance, short duration. Do between major focus blocks.
            </p>
            <div className="space-y-2">
              {fillIns.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">No fill-in tasks</div>
              ) : (
                fillIns.map(renderTaskPill)
              )}
            </div>
          </div>
        </div>

        {/* Quadrant 4: Hard Slogs */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between min-h-[160px]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                Hard Slogs (Low Impact, Long)
              </div>
              <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                {hardSlogs.length} Tasks
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              Low importance, high length. Batch, streamline, or schedule last.
            </p>
            <div className="space-y-2">
              {hardSlogs.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-2">No hard slog tasks</div>
              ) : (
                hardSlogs.map(renderTaskPill)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
