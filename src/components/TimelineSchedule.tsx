import React from 'react';
import { Clock, CheckCircle2, Circle, AlertTriangle, ArrowDown, Coffee, Sparkles, Moon, Calendar } from 'lucide-react';
import { MasterPlan, Task } from '../types';

interface TimelineScheduleProps {
  plan: MasterPlan;
  tasksMap: Map<string, Task>;
  completedTaskIds: Set<string>;
  onToggleTaskCompleted: (taskId: string) => void;
  onRequestComplete?: (task: Task) => void;
}

export const TimelineSchedule: React.FC<TimelineScheduleProps> = ({
  plan,
  tasksMap,
  completedTaskIds,
  onToggleTaskCompleted,
  onRequestComplete
}) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'quick_win':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Quick Win</span>;
      case 'major_project':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">Major Project</span>;
      case 'fill_in':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">Fill-in</span>;
      case 'hard_slog':
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Hard Slog</span>;
    }
  };

  return (
    <div id="timeline-schedule-container" className="space-y-4">
      {/* Bedtime or Calendar Constraint Banner */}
      {plan.bedtimeConstraintAlert && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-200">
          <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong className="text-white">Bedtime Protection Active:</strong> {plan.bedtimeConstraintAlert}
          </span>
        </div>
      )}

      {plan.calendarEventsIncluded && plan.calendarEventsIncluded.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>
              <strong>Google Calendar Synced:</strong> {plan.calendarEventsIncluded.length} hard busy blocks locked in schedule.
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {plan.tasks.map((pt, idx) => {
          const originalTask = tasksMap.get(pt.taskId);
          const isCompleted = completedTaskIds.has(pt.taskId);
          const breakAfter = plan.recommendedBreaks.find(b => b.afterTaskId === pt.taskId);

          if (!originalTask) return null;

          return (
            <React.Fragment key={pt.taskId}>
              <div 
                id={`timeline-item-${pt.taskId}`}
                className={`relative pl-12 pr-4 py-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                {/* Step circle indicator */}
                <button
                  onClick={() => {
                    if (isCompleted) {
                      onToggleTaskCompleted(pt.taskId);
                    } else if (onRequestComplete && originalTask) {
                      onRequestComplete(originalTask);
                    } else {
                      onToggleTaskCompleted(pt.taskId);
                    }
                  }}
                  className="absolute left-3.5 top-5 z-10 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                  title={isCompleted ? "Mark incomplete" : "Complete this task"}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{pt.order}</span>
                  )}
                </button>

                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    {/* Time + Badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 px-2.5 py-0.5 rounded-lg">
                        <Clock className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                        {pt.scheduledStartTime} – {pt.scheduledEndTime}
                      </span>

                      {getCategoryBadge(pt.effortVsImpactCategory)}

                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                        Priority Score: <strong className="text-slate-900 dark:text-white">{pt.priorityScore}/100</strong>
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {originalTask.title}
                    </h3>

                    {originalTask.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {originalTask.description}
                      </p>
                    )}

                    {/* Subtasks or risk warning */}
                    {pt.riskWarning && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{pt.riskWarning}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                      {originalTask.estimatedMinutes} mins
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider font-bold">
                      {originalTask.importance}
                    </span>
                  </div>
                </div>
              </div>


              {/* Recommended Break Card */}
              {breakAfter && (
                <div className="relative pl-12 pr-4 py-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <strong className="font-semibold text-amber-200">{breakAfter.durationMinutes} Min Recovery Break:</strong> {breakAfter.rationale}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                    Rest Block
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
