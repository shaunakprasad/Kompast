import React from 'react';
import { Sparkles, ShieldCheck, Lightbulb, CheckCircle2 } from 'lucide-react';
import { MasterPlan, Task } from '../types';

interface ReasoningBreakdownProps {
  plan: MasterPlan;
  tasksMap: Map<string, Task>;
}

export const ReasoningBreakdown: React.FC<ReasoningBreakdownProps> = ({ plan, tasksMap }) => {
  return (
    <div id="reasoning-breakdown-container" className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Executive Master Plan Strategy
          </h3>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {plan.executiveSummary}
        </p>
      </div>

      {/* Strategic Principles */}
      {plan.keyPrinciples && plan.keyPrinciples.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Core Strategic Decision Rules
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {plan.keyPrinciples.map((principle, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-Task Rationale Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white px-1">
          Step-by-Step Task Rationales
        </h3>

        <div className="space-y-3">
          {plan.tasks.map((pt) => {
            const task = tasksMap.get(pt.taskId);
            if (!task) return null;

            return (
              <div 
                key={pt.taskId}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                      #{pt.order}
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      {task.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                    Priority Score: <strong className="text-indigo-300">{pt.priorityScore}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                  <strong className="text-indigo-400 font-semibold">Why this position: </strong>
                  {pt.reasoning}
                </p>

                {pt.subtaskRecommendations && pt.subtaskRecommendations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Recommended Focus Steps:
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5 pl-1">
                      {pt.subtaskRecommendations.map((sub, sIdx) => (
                        <li key={sIdx}>{sub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Productivity Insights */}
      {plan.productivityInsights && plan.productivityInsights.length > 0 && (
        <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Productivity & Execution Insights
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {plan.productivityInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
