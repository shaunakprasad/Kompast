import React from 'react';
import { Sparkles, Zap, Flame, Clock, BatteryCharging, Check } from 'lucide-react';
import { MasterPlanStrategy } from '../types';
import { STRATEGY_OPTIONS } from '../data/presetTasks';

interface StrategySelectorProps {
  selectedStrategy: MasterPlanStrategy;
  onSelectStrategy: (strategy: MasterPlanStrategy) => void;
  startTime: string;
  onChangeStartTime: (time: string) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({
  selectedStrategy,
  onSelectStrategy,
  startTime,
  onChangeStartTime
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Clock': return <Clock className="w-4 h-4 text-cyan-400" />;
      case 'BatteryCharging': return <BatteryCharging className="w-4 h-4 text-emerald-400" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div id="strategy-selector-container" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 flex-wrap gap-3">
        <div>
          <h2 id="strategy-heading" className="text-sm font-bold text-white flex items-center gap-2">
            Reasoning Strategy & Start Time
          </h2>
          <p className="text-xs text-slate-400">
            Select how the AI balances task importance, length, and energy.
          </p>
        </div>

        {/* Start Time Config */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-medium text-slate-300">Plan Start Time:</span>
          <select
            id="select-start-time"
            value={startTime}
            onChange={(e) => onChangeStartTime(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            <option value="08:00 AM">08:00 AM</option>
            <option value="08:30 AM">08:30 AM</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="09:30 AM">09:30 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="01:00 PM">01:00 PM</option>
          </select>
        </div>
      </div>

      {/* Grid of strategies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {STRATEGY_OPTIONS.map((opt) => {
          const isSelected = selectedStrategy === opt.id;

          return (
            <div
              key={opt.id}
              id={`strategy-card-${opt.id}`}
              onClick={() => onSelectStrategy(opt.id)}
              className={`relative cursor-pointer rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {getIcon(opt.iconName)}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.badge}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                  {opt.title}
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </h3>

                <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                  {opt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
