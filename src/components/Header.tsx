import React from 'react';
import { Sparkles, Brain, Plus, RefreshCw, Play, MessageSquare, Zap, Moon, Sun, Calendar, Clock } from 'lucide-react';
import { MasterPlan, AppTheme } from '../types';

interface HeaderProps {
  onOpenAddTask: () => void;
  onOpenBrainDump: () => void;
  onOpenFocusRunner: () => void;
  onToggleChat: () => void;
  onLoadPreset: () => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
  hasTasks: boolean;
  currentPlan: MasterPlan | null;
  theme: AppTheme;
  onToggleTheme: () => void;
  onOpenBedtime: () => void;
  onOpenCalendar: () => void;
  isCalendarConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddTask,
  onOpenBrainDump,
  onOpenFocusRunner,
  onToggleChat,
  onLoadPreset,
  onGeneratePlan,
  isGenerating,
  hasTasks,
  currentPlan,
  theme,
  onToggleTheme,
  onOpenBedtime,
  onOpenCalendar,
  isCalendarConnected
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-30 bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-md border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-100 dark:text-slate-100 light:text-slate-900 transition-colors">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div id="brand-logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 id="brand-title" className="text-base sm:text-lg font-bold tracking-tight dark:text-white light:text-slate-900">
                Master Plan <span className="text-indigo-500 font-extrabold">AI</span>
              </h1>
              <span id="brand-badge" className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Intuitive Task Strategist
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 hidden md:block">
              Reasoning engine for optimal task order & duration scheduling
            </p>
          </div>
        </div>

        {/* Action Controls - Desktop & Tablet */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Bedtime Schedule Button */}
          <button
            id="btn-bedtime-schedule"
            onClick={onOpenBedtime}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700/80 text-indigo-300 dark:text-indigo-300 light:text-indigo-600 border border-slate-700 dark:border-slate-700 light:border-slate-300 transition-colors"
            title="Configure Daily Sleep & Bedtime Schedule"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Bedtime</span>
          </button>

          {/* Google Calendar Sync Button */}
          <button
            id="btn-calendar-connect"
            onClick={onOpenCalendar}
            className={`inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              isCalendarConnected
                ? 'bg-blue-950/40 dark:bg-blue-950/40 light:bg-blue-50 text-blue-300 dark:text-blue-300 light:text-blue-700 border-blue-500/40'
                : 'bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-700 border-slate-700 dark:border-slate-700 light:border-slate-300'
            }`}
            title="Google Calendar Integration"
          >
            <Calendar className={`w-3.5 h-3.5 ${isCalendarConnected ? 'text-blue-400' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">{isCalendarConnected ? 'Calendar Sync' : 'Google Cal'}</span>
            {isCalendarConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-300 dark:text-slate-300 light:text-slate-700 bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 hover:bg-slate-700/80 rounded-xl border border-slate-700 dark:border-slate-700 light:border-slate-300 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {!hasTasks && (
            <button
              id="btn-load-preset"
              onClick={onLoadPreset}
              className="hidden xl:inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Sample Tasks
            </button>
          )}

          <button
            id="btn-brain-dump"
            onClick={onOpenBrainDump}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 transition-all hover:border-indigo-500/60"
            title="Import text notes or brain dump"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Brain Dump</span>
          </button>

          <button
            id="btn-add-task"
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {currentPlan && (
            <button
              id="btn-focus-mode"
              onClick={onOpenFocusRunner}
              className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span className="hidden sm:inline">Focus</span>
            </button>
          )}

          <button
            id="btn-ai-chat"
            onClick={onToggleChat}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1.5 text-xs font-medium rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 transition-colors"
            title="Ask AI Reasoning Coach"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Coach</span>
          </button>

          <button
            id="btn-generate-plan"
            onClick={onGeneratePlan}
            disabled={!hasTasks || isGenerating}
            className={`inline-flex items-center gap-2 min-h-[38px] px-3.5 py-2 text-xs font-semibold rounded-xl shadow-md transition-all ${
              !hasTasks || isGenerating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/25 active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span className="hidden sm:inline">Reasoning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{currentPlan ? 'Regenerate' : 'Create Plan'}</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Top Actions (Theme + Create Plan) */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            id="btn-theme-toggle-mobile"
            onClick={onToggleTheme}
            className="p-2 min-h-[42px] min-w-[42px] flex items-center justify-center text-slate-300 bg-slate-800/90 rounded-xl border border-slate-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            id="btn-generate-plan-mobile"
            onClick={onGeneratePlan}
            disabled={!hasTasks || isGenerating}
            className={`inline-flex items-center gap-1.5 min-h-[42px] px-3 py-2 text-xs font-bold rounded-xl shadow-md transition-all ${
              !hasTasks || isGenerating
                ? 'bg-slate-800 text-slate-500 border border-slate-700'
                : 'bg-indigo-600 text-white active:scale-95'
            }`}
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{currentPlan ? 'Plan' : 'Create'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Header Action Pills Bar */}
      <div className="sm:hidden flex items-center gap-2 px-3 py-2.5 overflow-x-auto border-t border-slate-800/80 bg-slate-950/60 no-scrollbar">
        <button
          onClick={onOpenAddTask}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Task</span>
        </button>

        <button
          onClick={onOpenBrainDump}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-indigo-300 border border-indigo-500/30 shrink-0 active:scale-95"
        >
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span>Brain Dump</span>
        </button>

        <button
          onClick={onOpenBedtime}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-indigo-300 border border-slate-700 shrink-0 active:scale-95"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Bedtime</span>
        </button>

        <button
          onClick={onOpenCalendar}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border shrink-0 active:scale-95 ${
            isCalendarConnected
              ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Calendar className={`w-3.5 h-3.5 ${isCalendarConnected ? 'text-blue-400' : 'text-slate-400'}`} />
          <span>Calendar</span>
        </button>

        {currentPlan && (
          <button
            onClick={onOpenFocusRunner}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Focus</span>
          </button>
        )}

        <button
          onClick={onToggleChat}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-indigo-300 border border-slate-700 shrink-0 active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          <span>Coach</span>
        </button>

        {!hasTasks && (
          <button
            onClick={onLoadPreset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-amber-300 border border-slate-700 shrink-0 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Tasks</span>
          </button>
        )}
      </div>
    </header>
  );
};

