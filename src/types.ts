export type TaskImportance = 'low' | 'medium' | 'high' | 'critical';
export type TaskEnergyLevel = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayBedtimeConfig {
  bedtime: string; // e.g. "22:30" or "10:30 PM"
  wakeTime: string; // e.g. "07:00" or "07:00 AM"
  enabled: boolean;
}

export type BedtimeSchedule = Record<DayOfWeek, DayBedtimeConfig>;

export interface GoogleCalendarEvent {
  id: string;
  title: string;
  startTime: string; // ISO or formatted e.g. "10:00 AM"
  endTime: string;   // ISO or formatted e.g. "11:00 AM"
  startIso?: string;
  endIso?: string;
  location?: string;
  link?: string;
  isAllDay?: boolean;
}

export type AppTheme = 'dark' | 'light';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  importance: TaskImportance;
  estimatedMinutes: number;
  deadline?: string;
  category?: string;
  energyLevel?: TaskEnergyLevel;
  dependencies?: string[]; // IDs or titles of prerequisite tasks
  subtasks?: SubTask[];
  status: TaskStatus;
  createdAt: string;
}

export type MasterPlanStrategy = 
  | 'balanced' 
  | 'eat_the_frog' 
  | 'quick_wins' 
  | 'deadline_first' 
  | 'energy_flow';

export type EffortVsImpactCategory = 
  | 'quick_win'      // High importance, short duration
  | 'major_project'  // High importance, long duration
  | 'fill_in'        // Low importance, short duration
  | 'hard_slog';     // Low importance, long duration

export interface MasterPlanTaskOrder {
  taskId: string;
  order: number;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  reasoning: string;
  priorityScore: number; // 0 - 100
  effortVsImpactCategory: EffortVsImpactCategory;
  subtaskRecommendations?: string[];
  riskWarning?: string;
}

export interface RecommendedBreak {
  afterTaskId: string;
  durationMinutes: number;
  rationale: string;
}

export interface MasterPlan {
  id: string;
  title: string;
  createdAt: string;
  strategy: MasterPlanStrategy;
  tasks: MasterPlanTaskOrder[];
  executiveSummary: string;
  keyPrinciples: string[];
  recommendedBreaks: RecommendedBreak[];
  totalEstimatedMinutes: number;
  productivityInsights: string[];
  calendarEventsIncluded?: GoogleCalendarEvent[];
  bedtimeConstraintAlert?: string;
}

export interface BrainDumpResponse {
  tasks: Array<{
    title: string;
    description?: string;
    importance: TaskImportance;
    estimatedMinutes: number;
    category?: string;
    deadline?: string;
    energyLevel?: TaskEnergyLevel;
    subtasks?: string[];
  }>;
}

export interface StrategyOption {
  id: MasterPlanStrategy;
  title: string;
  description: string;
  iconName: string;
  badge: string;
}

