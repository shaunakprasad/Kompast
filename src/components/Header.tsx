import React from 'react';
import { Sparkles, Brain, Plus, RefreshCw, Play, MessageSquare, Moon, Calendar, Compass } from 'lucide-react';
import { MasterPlan } from '../types';

interface HeaderProps {
  onOpenAddTask: () => void;
  onOpenBrainDump: () => void;
  onOpenFocusRunner: () => void;
  onToggleChat: () => void;
  onLoadPreset: () => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  generationProgress?: number;
  hasTasks: boolean;
  currentPlan: MasterPlan | null;
  onOpenBedtime: () => void;
  onOpenCalendar: () => void;
  isCalendarConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddTask,
  onOpenBrainDump,
  onOpenFocusRunner,
  onToggleChat,
  onGeneratePlan,
  isGenerating,
  generationProgress = 0,
  hasTasks,
  currentPlan,
  onOpenBedtime,
  onOpenCalendar,
  isCalendarConnected
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-indigo-500/20 text-slate-100 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-md">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 id="brand-title" className="text-xl font-black font-fun tracking-tight leading-none bg-gradient-to-r from-amber-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent">
              Kompast
            </h1>
            <span className="text-[11px] text-amber-200/90 font-extrabold tracking-wide">
              Guiding Your Daily Schedule
            </span>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {/* Primary Action Button */}
          {hasTasks && (
            <button
              id="btn-generate-plan"
              onClick={onGeneratePlan}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 h-10 px-4 text-xs font-black rounded-2xl shadow-lg transition-all active:scale-95 ${
                isGenerating
                  ? 'bg-indigo-950 text-amber-300 border border-amber-500/50 shadow-amber-500/20 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-500 hover:from-amber-400 hover:to-indigo-400 text-white shadow-amber-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Loading... {generationProgress}%</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                  <span>{currentPlan ? 'Regenerate Plan' : 'Generate Schedule'}</span>
                </>
              )}
            </button>
          )}

          {currentPlan && (
            <button
              id="btn-focus-mode"
              onClick={onOpenFocusRunner}
              className="inline-flex items-center gap-1.5 h-10 px-4 text-xs font-extrabold rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span className="hidden sm:inline">Focus Zone</span>
            </button>
          )}

          <div className="h-5 w-px bg-slate-800/80 mx-1 hidden sm:block" />

          {/* Quick Tool Icons */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-add-task"
              onClick={onOpenAddTask}
              className="p-2 h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900/90 hover:bg-indigo-950/80 text-amber-400 border border-indigo-500/30 hover:border-amber-500/50 transition-all shadow-sm"
              title="Add task"
            >
              <Plus className="w-4 h-4 text-amber-400" />
            </button>

            <button
              id="btn-brain-dump"
              onClick={onOpenBrainDump}
              className="p-2 h-10 w-10 flex items-center justify-center rounded-2xl bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 transition-all shadow-sm"
              title="Paste Brain Dump / Raw Text"
            >
              <Brain className="w-4 h-4 text-indigo-300" />
            </button>

            <button
              id="btn-ai-chat"
              onClick={onToggleChat}
              className="p-2 h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-indigo-500/20 transition-all shadow-sm"
              title="Ask Northy (Kompast Assistant)"
            >
              <MessageSquare className="w-4 h-4 text-indigo-300" />
            </button>

            <button
              id="btn-calendar-connect"
              onClick={onOpenCalendar}
              className={`p-2 h-10 w-10 flex items-center justify-center rounded-2xl border transition-all shadow-sm ${
                isCalendarConnected
                  ? 'bg-blue-950/80 text-blue-300 border-blue-500/50 shadow-blue-500/20'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 border-indigo-500/20'
              }`}
              title="Google Calendar Integration"
            >
              <Calendar className="w-4 h-4" />
            </button>

            <button
              id="btn-bedtime-schedule"
              onClick={onOpenBedtime}
              className="p-2 h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-indigo-400 border border-indigo-500/20 transition-all shadow-sm"
              title="Configure Bedtime"
            >
              <Moon className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};



