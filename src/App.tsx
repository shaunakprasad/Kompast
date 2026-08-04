import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  Plus, 
  Calendar as CalendarIcon, 
  ListOrdered, 
  Grid2X2, 
  FileText, 
  Download, 
  Play, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  RefreshCw,
  Share2,
  Moon
} from 'lucide-react';

import { Task, MasterPlan, MasterPlanStrategy, BedtimeSchedule, GoogleCalendarEvent, AppTheme } from './types';
import { SAMPLE_TASKS } from './data/presetTasks';
import { calculateFallbackMasterPlan } from './utils/fallbackPlanner';
import { DEFAULT_BEDTIME_SCHEDULE, getTodayDayOfWeek, formatTime24to12 } from './data/defaultBedtime';

import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { StrategySelector } from './components/StrategySelector';
import { TimelineSchedule } from './components/TimelineSchedule';
import { PriorityMatrix } from './components/PriorityMatrix';
import { ReasoningBreakdown } from './components/ReasoningBreakdown';
import { TaskFormModal } from './components/TaskFormModal';
import { BrainDumpModal } from './components/BrainDumpModal';
import { FocusRunnerModal } from './components/FocusRunnerModal';
import { PlanAssistantDrawer } from './components/PlanAssistantDrawer';
import { BedtimeModal } from './components/BedtimeModal';
import { CalendarConnectModal } from './components/CalendarConnectModal';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('master_plan_theme') as AppTheme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('master_plan_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Bedtime Schedule state & startup modal prompt
  const [bedtimeSchedule, setBedtimeSchedule] = useState<BedtimeSchedule>(() => {
    try {
      const saved = localStorage.getItem('master_plan_bedtime_schedule');
      return saved ? JSON.parse(saved) : DEFAULT_BEDTIME_SCHEDULE;
    } catch {
      return DEFAULT_BEDTIME_SCHEDULE;
    }
  });

  const [isBedtimeModalOpen, setIsBedtimeModalOpen] = useState<boolean>(false);
  const [isFirstTimeBedtime, setIsFirstTimeBedtime] = useState<boolean>(false);

  // Check on startup if bedtime has been configured
  useEffect(() => {
    const saved = localStorage.getItem('master_plan_bedtime_schedule');
    if (!saved) {
      setIsFirstTimeBedtime(true);
      setIsBedtimeModalOpen(true);
    }
  }, []);

  // Google Calendar Integration state
  const [calendarTokens, setCalendarTokens] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('google_calendar_tokens');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isFetchingCalendar, setIsFetchingCalendar] = useState(false);
  const [includeCalendarInMasterPlan, setIncludeCalendarInMasterPlan] = useState(true);

  // Tasks & Plan state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('master_plan_tasks');
      return saved ? JSON.parse(saved) : SAMPLE_TASKS;
    } catch {
      return SAMPLE_TASKS;
    }
  });

  const [strategy, setStrategy] = useState<MasterPlanStrategy>('balanced');
  const [startTime, setStartTime] = useState<string>('09:00 AM');

  const [currentPlan, setCurrentPlan] = useState<MasterPlan | null>(() => {
    try {
      const saved = localStorage.getItem('master_plan_current');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('master_plan_completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'timeline' | 'matrix' | 'reasoning'>('timeline');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);
  const [isFocusRunnerOpen, setIsFocusRunnerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync Bedtime schedule to localStorage
  const handleSaveBedtimeSchedule = (newSchedule: BedtimeSchedule) => {
    setBedtimeSchedule(newSchedule);
    localStorage.setItem('master_plan_bedtime_schedule', JSON.stringify(newSchedule));
    showNotification('Bedtime schedule updated successfully.');
  };

  // Google Calendar Fetching logic
  const fetchCalendarEvents = async (tokensToUse = calendarTokens) => {
    if (!tokensToUse || (!tokensToUse.access_token && !tokensToUse.refresh_token)) return;
    setIsFetchingCalendar(true);

    try {
      const res = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: tokensToUse.access_token,
          refreshToken: tokensToUse.refresh_token,
        }),
      });

      const data = await res.json();
      if (res.ok && data.events) {
        setCalendarEvents(data.events);
        showNotification(`Synced ${data.events.length} Google Calendar events.`);
      }
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setIsFetchingCalendar(false);
    }
  };

  // Listen for OAuth postMessage or query param
  useEffect(() => {
    const handleMessage = (evt: MessageEvent) => {
      if (evt.data && evt.data.type === 'GOOGLE_AUTH_SUCCESS' && evt.data.tokens) {
        const tokens = evt.data.tokens;
        setCalendarTokens(tokens);
        localStorage.setItem('google_calendar_tokens', JSON.stringify(tokens));
        showNotification('Google Calendar connected successfully!');
        fetchCalendarEvents(tokens);
      }
    };

    window.addEventListener('message', handleMessage);

    // Check query param
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') === 'true') {
      const saved = localStorage.getItem('google_calendar_tokens');
      if (saved) {
        const tokens = JSON.parse(saved);
        setCalendarTokens(tokens);
        fetchCalendarEvents(tokens);
        showNotification('Google Calendar connected successfully!');
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (calendarTokens) {
      fetchCalendarEvents();
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectCalendar = async () => {
    try {
      setIsFetchingCalendar(true);
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const res = await fetch(`/api/auth/google/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
      const data = await res.json();
      if (res.ok && data.url) {
        // Open OAuth popup window
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(data.url, 'GoogleCalendarAuth', `width=${width},height=${height},top=${top},left=${left}`);
      } else {
        alert(data.error || 'Could not retrieve Google OAuth authorization URL. Make sure CLIENT_ID and CLIENT_SECRET are configured.');
      }
    } catch (err: any) {
      console.error('Error starting Google OAuth:', err);
      alert('Failed to connect Google Calendar: ' + err.message);
    } finally {
      setIsFetchingCalendar(false);
    }
  };

  const handleDisconnectCalendar = () => {
    setCalendarTokens(null);
    setCalendarEvents([]);
    localStorage.removeItem('google_calendar_tokens');
    showNotification('Disconnected Google Calendar.');
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('master_plan_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      if (currentPlan) {
        localStorage.setItem('master_plan_current', JSON.stringify(currentPlan));
      } else {
        localStorage.removeItem('master_plan_current');
      }
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [currentPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('master_plan_completed', JSON.stringify(Array.from(completedTaskIds)));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [completedTaskIds]);

  // Task Handlers
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'> & { id?: string }) => {
    if (taskData.id) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
      showNotification('Task updated successfully.');
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        status: 'todo',
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      showNotification('New task added to queue.');
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showNotification('Task removed.');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tasks in your queue?')) {
      setTasks([]);
      setCurrentPlan(null);
      setCompletedTaskIds(new Set());
      showNotification('Cleared all tasks.');
    }
  };

  const handleLoadPreset = () => {
    setTasks(SAMPLE_TASKS);
    setCurrentPlan(null);
    showNotification('Loaded sample work tasks.');
  };

  const handleBrainDumpImport = (newTasksData: Omit<Task, 'id' | 'createdAt' | 'status'>[]) => {
    const created = newTasksData.map((td, idx) => ({
      ...td,
      id: `task-${Date.now()}-${idx}`,
      status: 'todo' as const,
      createdAt: new Date().toISOString()
    }));
    setTasks(prev => [...created, ...prev]);
    showNotification(`Imported ${created.length} tasks from brain dump.`);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.subtasks) {
        const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  const handleToggleTaskCompleted = (taskId: string) => {
    setCompletedTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  // Master Plan Generation using AI
  const handleGeneratePlan = async () => {
    if (tasks.length === 0) return;

    setIsGenerating(true);

    const today = getTodayDayOfWeek();
    const todayBedtimeCfg = bedtimeSchedule[today] || DEFAULT_BEDTIME_SCHEDULE[today];
    const bedtimeLimit = formatTime24to12(todayBedtimeCfg.bedtime);
    const activeCalendarEvents = includeCalendarInMasterPlan ? calendarEvents : [];

    try {
      const response = await fetch('/api/generate-master-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          strategy,
          startTime,
          calendarEvents: activeCalendarEvents,
          bedtimeLimit
        })
      });

      const data = await response.json();

      if (response.ok && data.tasks && Array.isArray(data.tasks)) {
        const generatedPlan: MasterPlan = {
          id: `plan-${Date.now()}`,
          title: `Master Plan (${strategy.toUpperCase()})`,
          createdAt: new Date().toISOString(),
          strategy,
          tasks: data.tasks,
          executiveSummary: data.executiveSummary || 'AI reasoning optimization completed.',
          keyPrinciples: data.keyPrinciples || [],
          recommendedBreaks: data.recommendedBreaks || [],
          totalEstimatedMinutes: data.totalEstimatedMinutes || tasks.reduce((s, t) => s + t.estimatedMinutes, 0),
          productivityInsights: data.productivityInsights || [],
          calendarEventsIncluded: activeCalendarEvents,
          bedtimeConstraintAlert: data.bedtimeConstraintAlert
        };
        setCurrentPlan(generatedPlan);
        showNotification('Master Plan generated with Gemini AI intuitive reasoning!');
      } else {
        // Fallback calculation
        console.warn('API error or fallback requested, using local intuitive reasoning planner.');
        const fallbackPlan = calculateFallbackMasterPlan(tasks, strategy, startTime, activeCalendarEvents, bedtimeLimit);
        setCurrentPlan(fallbackPlan);
        showNotification('Master Plan calculated using intuitive reasoning engine.');
      }
    } catch (err: any) {
      console.error('Error calling master plan server endpoint:', err);
      const fallbackPlan = calculateFallbackMasterPlan(tasks, strategy, startTime, activeCalendarEvents, bedtimeLimit);
      setCurrentPlan(fallbackPlan);
      showNotification('Master Plan calculated using intuitive reasoning engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate plan on initial load if no plan exists and tasks are available
  useEffect(() => {
    if (!currentPlan && tasks.length > 0) {
      const today = getTodayDayOfWeek();
      const todayBedtimeCfg = bedtimeSchedule[today] || DEFAULT_BEDTIME_SCHEDULE[today];
      const bedtimeLimit = formatTime24to12(todayBedtimeCfg.bedtime);
      const fallbackPlan = calculateFallbackMasterPlan(tasks, strategy, startTime, calendarEvents, bedtimeLimit);
      setCurrentPlan(fallbackPlan);
    }
  }, []);

  const tasksMap: Map<string, Task> = new Map(tasks.map(t => [t.id, t]));

  // Export Master Plan as Markdown
  const handleExportPlan = () => {
    if (!currentPlan) return;

    let md = `# ${currentPlan.title}\n`;
    md += `*Generated on ${new Date(currentPlan.createdAt).toLocaleDateString()} at ${startTime}*\n\n`;
    md += `## Executive Strategy\n${currentPlan.executiveSummary}\n\n`;

    if (currentPlan.keyPrinciples.length > 0) {
      md += `## Key Principles\n`;
      currentPlan.keyPrinciples.forEach(p => md += `- ${p}\n`);
      md += `\n`;
    }

    md += `## Master Execution Schedule\n\n`;
    currentPlan.tasks.forEach(pt => {
      const task = tasksMap.get(pt.taskId);
      if (task) {
        md += `### #${pt.order} [${pt.scheduledStartTime} - ${pt.scheduledEndTime}] ${task.title}\n`;
        md += `- **Duration**: ${task.estimatedMinutes} mins\n`;
        md += `- **Importance**: ${task.importance}\n`;
        md += `- **AI Rationale**: ${pt.reasoning}\n`;
        if (pt.subtaskRecommendations && pt.subtaskRecommendations.length > 0) {
          md += `- **Focus Steps**:\n`;
          pt.subtaskRecommendations.forEach(s => md += `  - ${s}\n`);
        }
        md += `\n`;
      }
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MasterPlan_${strategy}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Master Plan exported to Markdown file!');
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Toast Notification */}
      {notification && (
        <div id="toast-notification" className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-indigo-400 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenAddTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
        onOpenBrainDump={() => setIsBrainDumpOpen(true)}
        onOpenFocusRunner={() => setIsFocusRunnerOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onLoadPreset={handleLoadPreset}
        onGeneratePlan={handleGeneratePlan}
        isGenerating={isGenerating}
        hasTasks={tasks.length > 0}
        currentPlan={currentPlan}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        onOpenBedtime={() => { setIsFirstTimeBedtime(false); setIsBedtimeModalOpen(true); }}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        isCalendarConnected={!!calendarTokens}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Strategy Selector Row */}
        <StrategySelector
          selectedStrategy={strategy}
          onSelectStrategy={(newStrategy) => {
            setStrategy(newStrategy);
            if (tasks.length > 0) {
              const today = getTodayDayOfWeek();
              const todayBedtimeCfg = bedtimeSchedule[today] || DEFAULT_BEDTIME_SCHEDULE[today];
              const bedtimeLimit = formatTime24to12(todayBedtimeCfg.bedtime);
              const updated = calculateFallbackMasterPlan(tasks, newStrategy, startTime, includeCalendarInMasterPlan ? calendarEvents : [], bedtimeLimit);
              setCurrentPlan(updated);
            }
          }}
          startTime={startTime}
          onChangeStartTime={(newTime) => {
            setStartTime(newTime);
            if (tasks.length > 0) {
              const today = getTodayDayOfWeek();
              const todayBedtimeCfg = bedtimeSchedule[today] || DEFAULT_BEDTIME_SCHEDULE[today];
              const bedtimeLimit = formatTime24to12(todayBedtimeCfg.bedtime);
              const updated = calculateFallbackMasterPlan(tasks, strategy, newTime, includeCalendarInMasterPlan ? calendarEvents : [], bedtimeLimit);
              setCurrentPlan(updated);
            }
          }}
        />

        {/* Dashboard Grid: Left Queue vs Right Master Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Task Input Queue (5 Cols) */}
          <div className="lg:col-span-5 h-[620px] lg:h-[720px]">
            <TaskList
              tasks={tasks}
              onOpenAddTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
              onOpenBrainDump={() => setIsBrainDumpOpen(true)}
              onLoadPreset={handleLoadPreset}
              onEditTask={(task) => { setEditingTask(task); setIsTaskModalOpen(true); }}
              onDeleteTask={handleDeleteTask}
              onClearAll={handleClearAll}
              onToggleSubtask={handleToggleSubtask}
            />
          </div>

          {/* Right Column: Master Plan Display (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {currentPlan ? (
              <div id="master-plan-card" className="bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-5 shadow-xl space-y-5">
                {/* Master Plan Tab Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 flex-wrap gap-2">
                  <div className="flex items-center gap-1 bg-slate-950 dark:bg-slate-950 light:bg-slate-100 p-1 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs">
                    <button
                      id="tab-timeline"
                      onClick={() => setActiveTab('timeline')}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                        activeTab === 'timeline'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 dark:text-slate-400 light:text-slate-600'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>Timeline Schedule</span>
                    </button>

                    <button
                      id="tab-matrix"
                      onClick={() => setActiveTab('matrix')}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                        activeTab === 'matrix'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 dark:text-slate-400 light:text-slate-600'
                      }`}
                    >
                      <Grid2X2 className="w-3.5 h-3.5" />
                      <span>Priority Matrix</span>
                    </button>

                    <button
                      id="tab-reasoning"
                      onClick={() => setActiveTab('reasoning')}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                        activeTab === 'reasoning'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 dark:text-slate-400 light:text-slate-600'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>AI Rationale</span>
                    </button>
                  </div>

                  {/* Plan Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-export-plan"
                      onClick={handleExportPlan}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-slate-700 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-medium border border-slate-700 dark:border-slate-700 light:border-slate-300 flex items-center gap-1.5 transition-colors"
                      title="Download Markdown Plan"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Export Plan</span>
                    </button>

                    <button
                      id="btn-run-focus"
                      onClick={() => setIsFocusRunnerOpen(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Execution</span>
                    </button>
                  </div>
                </div>

                {/* Tab Views */}
                {activeTab === 'timeline' && (
                  <TimelineSchedule
                    plan={currentPlan}
                    tasksMap={tasksMap}
                    completedTaskIds={completedTaskIds}
                    onToggleTaskCompleted={handleToggleTaskCompleted}
                  />
                )}

                {activeTab === 'matrix' && (
                  <PriorityMatrix
                    plan={currentPlan}
                    tasksMap={tasksMap}
                  />
                )}

                {activeTab === 'reasoning' && (
                  <ReasoningBreakdown
                    plan={currentPlan}
                    tasksMap={tasksMap}
                  />
                )}
              </div>
            ) : (
              <div id="no-plan-placeholder" className="bg-slate-900/40 dark:bg-slate-900/40 light:bg-white border border-dashed border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold dark:text-white light:text-slate-900">
                  No Master Plan Created Yet
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-md mx-auto">
                  Add work tasks on the left, pick your reasoning strategy, and click "Create Master Plan" to generate your optimized execution sequence.
                </p>
                <button
                  id="placeholder-btn-generate"
                  onClick={handleGeneratePlan}
                  disabled={tasks.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Master Plan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="app-footer" className="bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border-t border-slate-900 dark:border-slate-900 light:border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
          <span>Master Plan AI Task Prioritizer & Intuitive Reasoning Engine</span>
          <span className="text-slate-600 dark:text-slate-600 light:text-slate-400">Powered by Gemini 3.6 Flash</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <BedtimeModal
        isOpen={isBedtimeModalOpen}
        onClose={() => setIsBedtimeModalOpen(false)}
        schedule={bedtimeSchedule}
        onSaveSchedule={handleSaveBedtimeSchedule}
        isFirstTimeOnboarding={isFirstTimeBedtime}
      />

      <CalendarConnectModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        isConnected={!!calendarTokens}
        events={calendarEvents}
        isLoading={isFetchingCalendar}
        onConnect={handleConnectCalendar}
        onDisconnect={handleDisconnectCalendar}
        onSync={() => fetchCalendarEvents()}
        includeInMasterPlan={includeCalendarInMasterPlan}
        onToggleIncludeInMasterPlan={(val) => setIncludeCalendarInMasterPlan(val)}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      <BrainDumpModal
        isOpen={isBrainDumpOpen}
        onClose={() => setIsBrainDumpOpen(false)}
        onTasksImported={handleBrainDumpImport}
      />

      <FocusRunnerModal
        isOpen={isFocusRunnerOpen}
        onClose={() => setIsFocusRunnerOpen(false)}
        plan={currentPlan || calculateFallbackMasterPlan(tasks, strategy, startTime)}
        tasksMap={tasksMap}
        completedTaskIds={completedTaskIds}
        onToggleTaskCompleted={handleToggleTaskCompleted}
        onToggleSubtask={handleToggleSubtask}
      />

      <PlanAssistantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        tasks={tasks}
        currentPlan={currentPlan}
      />
    </div>
  );
}

