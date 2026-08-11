import React from 'react';
import { Sparkles, Clock } from 'lucide-react';

interface StrategySelectorProps {
  selectedStrategy?: string;
  onSelectStrategy?: (strategy: any) => void;
  startTime: string;
  onChangeStartTime: (time: string) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({
  startTime,
  onChangeStartTime
}) => {
  return (
    <div id="strategy-selector-container" className="bg-slate-900/80 border border-indigo-500/30 rounded-3xl p-4 shadow-xl flex items-center justify-between gap-4 flex-wrap backdrop-blur-md transition-colors text-slate-100">
      {/* AI Optimizer Badge */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-xs font-black font-fun text-white flex items-center gap-2">
            <span>Time-Blocking Engine</span>
            <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-xs">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Orders tasks by priority, deadlines, and focus energy.
          </p>
        </div>
      </div>

      {/* Start Time Config */}
      <div className="flex items-center gap-2.5 bg-slate-950 border border-amber-500/40 px-3.5 py-2 rounded-2xl shrink-0 shadow-inner">
        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs font-extrabold font-fun text-slate-300">Schedule Start:</span>
        <select
          id="select-start-time"
          value={startTime}
          onChange={(e) => onChangeStartTime(e.target.value)}
          className="bg-slate-900 text-amber-300 font-black text-xs font-fun px-3 py-1 rounded-xl border border-amber-500/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer transition-all"
        >
          <option value="07:00 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">07:00 AM</option>
          <option value="07:30 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">07:30 AM</option>
          <option value="08:00 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">08:00 AM</option>
          <option value="08:30 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">08:30 AM</option>
          <option value="09:00 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">09:00 AM</option>
          <option value="09:30 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">09:30 AM</option>
          <option value="10:00 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">10:00 AM</option>
          <option value="11:00 AM" className="bg-slate-950 text-amber-200 font-extrabold py-1">11:00 AM</option>
          <option value="12:00 PM" className="bg-slate-950 text-amber-200 font-extrabold py-1">12:00 PM</option>
          <option value="01:00 PM" className="bg-slate-950 text-amber-200 font-extrabold py-1">01:00 PM</option>
          <option value="02:00 PM" className="bg-slate-950 text-amber-200 font-extrabold py-1">02:00 PM</option>
        </select>
      </div>
    </div>
  );
};

