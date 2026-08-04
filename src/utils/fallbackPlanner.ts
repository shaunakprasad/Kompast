import { Task, MasterPlan, MasterPlanStrategy, MasterPlanTaskOrder, EffortVsImpactCategory, GoogleCalendarEvent } from '../types';

export function parseBrainDumpFallback(text: string): Partial<Task>[] {
  const lines = text.split(/[\n;.]+/).map(l => l.trim()).filter(Boolean);
  
  return lines.map((line, idx) => {
    let importance: Task['importance'] = 'medium';
    if (/urgent|critical|asap|now|emergency/i.test(line)) importance = 'critical';
    else if (/high|important|key|major/i.test(line)) importance = 'high';
    else if (/low|minor|whenever|someday/i.test(line)) importance = 'low';

    let estimatedMinutes = 30;
    const matchTime = line.match(/(\d+)\s*(h|hr|hours|m|min|mins|minutes)/i);
    if (matchTime) {
      const num = parseInt(matchTime[1], 10);
      const unit = matchTime[2].toLowerCase();
      if (unit.startsWith('h')) estimatedMinutes = num * 60;
      else estimatedMinutes = num;
    }

    // Clean title
    let title = line
      .replace(/\((.*?)\)/g, '')
      .replace(/high priority|low priority|critical|urgent|\d+\s*(h|hr|hours|m|min|mins|minutes)/gi, '')
      .trim();

    if (!title) title = `Task ${idx + 1}`;

    return {
      title,
      description: line,
      importance,
      estimatedMinutes,
      category: 'General',
      status: 'todo'
    };
  });
}

function getImportanceWeight(importance: Task['importance']): number {
  switch (importance) {
    case 'critical': return 100;
    case 'high': return 75;
    case 'medium': return 50;
    case 'low': return 25;
    default: return 50;
  }
}

function categorizeEffortVsImpact(importance: Task['importance'], minutes: number): EffortVsImpactCategory {
  const isHighImpact = importance === 'critical' || importance === 'high';
  const isShort = minutes <= 45;

  if (isHighImpact && isShort) return 'quick_win';
  if (isHighImpact && !isShort) return 'major_project';
  if (!isHighImpact && isShort) return 'fill_in';
  return 'hard_slog';
}

function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  try {
    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier?.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0;

    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    let newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    const newModifier = newHours >= 12 ? 'PM' : 'AM';
    let displayHours = newHours % 12;
    if (displayHours === 0) displayHours = 12;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(displayHours)}:${pad(newMinutes)} ${newModifier}`;
  } catch {
    return timeStr;
  }
}

export function calculateFallbackMasterPlan(
  tasks: Task[], 
  strategy: MasterPlanStrategy = 'balanced',
  startTime: string = '09:00 AM',
  calendarEvents: GoogleCalendarEvent[] = [],
  bedtimeLimit: string = '10:30 PM'
): MasterPlan {
  // Score and sort
  const scored = tasks.map(task => {
    const impact = getImportanceWeight(task.importance);
    const length = task.estimatedMinutes;
    let score = 0;

    switch (strategy) {
      case 'eat_the_frog':
        score = impact * 10 - length * 0.1;
        break;
      case 'quick_wins':
        score = impact * 5 + (120 - Math.min(length, 120)) * 2;
        break;
      case 'deadline_first':
        const hasDeadline = task.deadline ? 50 : 0;
        score = impact * 3 + hasDeadline - length * 0.1;
        break;
      case 'energy_flow':
        const highEnergy = task.energyLevel === 'high' ? 40 : 0;
        score = impact * 2 + highEnergy - length * 0.05;
        break;
      case 'balanced':
      default:
        score = impact * 4 + (180 - Math.min(length, 180)) * 0.3;
        if (task.importance === 'critical') score += 100;
        break;
    }

    return { task, score };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  let currentTime = startTime;
  let totalMinutes = 0;
  const planTasks: MasterPlanTaskOrder[] = [];
  const recommendedBreaks: MasterPlan['recommendedBreaks'] = [];
  let bedtimeConstraintAlert: string | undefined = undefined;

  scored.forEach(({ task, score }, index) => {
    const start = currentTime;
    const end = addMinutesToTime(currentTime, task.estimatedMinutes);
    currentTime = end;
    totalMinutes += task.estimatedMinutes;

    const category = categorizeEffortVsImpact(task.importance, task.estimatedMinutes);
    let reasoning = "";

    if (category === 'quick_win') {
      reasoning = `High impact (${task.importance}) with short duration (${task.estimatedMinutes}m). Positioned early to achieve fast momentum.`;
    } else if (category === 'major_project') {
      reasoning = `Substantial task (${task.estimatedMinutes}m) with ${task.importance} importance. Scheduled early while cognitive focus is high.`;
    } else if (category === 'fill_in') {
      reasoning = `Low-stress short task (${task.estimatedMinutes}m). Placed as a quick filler task.`;
    } else {
      reasoning = `Longer admin task (${task.estimatedMinutes}m). Scheduled after core high-impact items.`;
    }

    planTasks.push({
      taskId: task.id,
      order: index + 1,
      scheduledStartTime: start,
      scheduledEndTime: end,
      reasoning,
      priorityScore: Math.round(Math.min(100, Math.max(10, score))),
      effortVsImpactCategory: category,
      subtaskRecommendations: task.subtasks?.map(s => s.title) || [
        `Define clear starting step for ${task.title}`,
        `Eliminate distractions during ${task.estimatedMinutes}m block`
      ],
      riskWarning: task.estimatedMinutes >= 90 ? "Consider taking a brief break midway through this session." : undefined
    });

    // Recommend break after tasks >= 60 mins or every 2 tasks
    if (task.estimatedMinutes >= 60 || (index + 1) % 2 === 0) {
      recommendedBreaks.push({
        afterTaskId: task.id,
        durationMinutes: 15,
        rationale: "15-minute cognitive refresh interval to prevent mental fatigue."
      });
      currentTime = addMinutesToTime(currentTime, 15);
      totalMinutes += 15;
    }
  });

  const keyPrinciples = [
    "Front-load critical high-impact objectives",
    "Time-box tasks to prevent Parkinson's Law duration drift",
    "Incorporate structured cognitive recovery breaks",
    `Protect bedtime rest window at ${bedtimeLimit}`
  ];

  if (calendarEvents.length > 0) {
    keyPrinciples.push(`Integrated ${calendarEvents.length} Google Calendar event blocks as hard busy constraints.`);
  }

  return {
    id: `plan-${Date.now()}`,
    title: `Master Plan (${strategy.toUpperCase()})`,
    createdAt: new Date().toISOString(),
    strategy,
    tasks: planTasks,
    executiveSummary: `Generated sequence optimized for ${strategy.replace(/_/g, ' ')}. Prioritizes high-impact goals while fitting around bedtime bounds (${bedtimeLimit})${calendarEvents.length ? ` and ${calendarEvents.length} calendar events` : ''}.`,
    keyPrinciples,
    recommendedBreaks,
    totalEstimatedMinutes: totalMinutes,
    productivityInsights: [
      "Group similar communication tasks to prevent context-switching penalties.",
      "Protect your first 90 minutes of the morning for zero-distraction deep work.",
      "Tick off quick wins to generate psychological momentum."
    ],
    calendarEventsIncluded: calendarEvents,
    bedtimeConstraintAlert
  };
}

