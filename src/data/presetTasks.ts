import { Task, MasterPlanStrategy, StrategyOption } from '../types';

export const STUDENT_TASKS: Task[] = [
  {
    id: 'st-1',
    title: 'Study for Computer Science Midterm Exam',
    description: 'Review lecture slides on Graph Algorithms, Binary Trees, and Big-O Time Complexity.',
    importance: 'critical',
    estimatedMinutes: 120,
    deadline: 'Tomorrow 10:00 AM',
    category: 'Academics',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [
      { id: 'sub-st1', title: 'Solve 5 practice tree traversal problems', completed: false },
      { id: 'sub-st2', title: 'Create formula cheat sheet', completed: false }
    ],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'st-2',
    title: 'Submit Economics Problem Set on Canvas',
    description: 'Complete market equilibrium graphs and upload PDF submission.',
    importance: 'high',
    estimatedMinutes: 60,
    deadline: 'Today 11:59 PM',
    category: 'Assignments',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'st-3',
    title: 'Group Project Coordination Zoom Call',
    description: 'Sync with group members to divide presentation slides and assign research topics.',
    importance: 'medium',
    estimatedMinutes: 45,
    category: 'Collaboration',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'st-4',
    title: 'Read Chapter 4 for Psychology Seminar',
    description: 'Annotate key study findings on memory retention mechanisms.',
    importance: 'low',
    estimatedMinutes: 40,
    category: 'Reading',
    energyLevel: 'low',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  }
];

export const WORKER_9TO5_TASKS: Task[] = [
  {
    id: 'w-1',
    title: 'Prepare Q3 Quarterly Strategy & Roadmap Deck',
    description: 'Synthesize key engineering metrics, deliverables, and timeline milestones for executive review.',
    importance: 'critical',
    estimatedMinutes: 120,
    deadline: 'Today 3:00 PM',
    category: 'Strategy',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [
      { id: 'sub-w1', title: 'Outline top 3 strategic initiatives', completed: false },
      { id: 'sub-w2', title: 'Add budget headcount estimates', completed: false }
    ],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'w-2',
    title: 'Daily Morning Standup & Team Sync',
    description: 'Share sprint updates, flag blockers, and align on daily priorities with team.',
    importance: 'high',
    estimatedMinutes: 20,
    deadline: 'Today 9:30 AM',
    category: 'Meetings',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'w-3',
    title: 'Batch Process Client & Stakeholder Emails',
    description: 'Inbox Zero sweep: reply to urgent partner inquiries and clear pending approvals.',
    importance: 'medium',
    estimatedMinutes: 30,
    category: 'Communication',
    energyLevel: 'low',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'w-4',
    title: 'Review Engineering Pull Requests & Design Specs',
    description: 'Thorough code review for frontend performance updates and security patches.',
    importance: 'high',
    estimatedMinutes: 60,
    category: 'Development',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  }
];

export const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Fix critical payment gateway checkout bug',
    description: 'Customers on Safari browser are experiencing payment timeouts during checkout. Needs immediate debugging.',
    importance: 'critical',
    estimatedMinutes: 90,
    deadline: 'Today 2:00 PM',
    category: 'Engineering',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [
      { id: 'sub-1', title: 'Reproduce bug on Safari 17', completed: false },
      { id: 'sub-2', title: 'Check SSL handshake logs', completed: false },
      { id: 'sub-3', title: 'Deploy patch to staging', completed: false }
    ],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Write Q3 Product Strategy One-Pager',
    description: 'Draft key roadmap objectives and resource allocations for leadership review meeting tomorrow morning.',
    importance: 'high',
    estimatedMinutes: 120,
    deadline: 'Tomorrow 9:00 AM',
    category: 'Strategy',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [
      { id: 'sub-4', title: 'Gather user metrics', completed: false },
      { id: 'sub-5', title: 'Draft core pillars', completed: false }
    ],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Approve pending expense reports',
    description: 'Quick review of team receipts and expense submissions in portal.',
    importance: 'low',
    estimatedMinutes: 15,
    category: 'Admin',
    energyLevel: 'low',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Review frontend pull requests',
    description: 'Review 3 PRs for UI component refactoring and accessibility updates.',
    importance: 'medium',
    estimatedMinutes: 45,
    category: 'Engineering',
    energyLevel: 'medium',
    dependencies: ['Fix critical payment gateway checkout bug'],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-5',
    title: 'Send weekly status email to client stakeholders',
    description: 'Brief update on project milestones, completed sprint items, and upcoming release dates.',
    importance: 'medium',
    estimatedMinutes: 20,
    deadline: 'Today 5:00 PM',
    category: 'Communication',
    energyLevel: 'low',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-6',
    title: 'Reorganize Google Drive project files',
    description: 'Clean up old design assets and archive Q1 folders.',
    importance: 'low',
    estimatedMinutes: 60,
    category: 'Admin',
    energyLevel: 'low',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  }
];

export const STRATEGY_OPTIONS: StrategyOption[] = [
  {
    id: 'balanced',
    title: 'Intuitive AI Balance',
    description: 'Holistic AI reasoning that balances task impact, time length, cognitive fatigue, and deadline constraints.',
    iconName: 'Sparkles',
    badge: 'Recommended'
  },
  {
    id: 'eat_the_frog',
    title: 'Eat the Frog (High Impact First)',
    description: 'Prioritize heavy, critical, and high-impact tasks first when mental energy and focus are at peak levels.',
    iconName: 'Zap',
    badge: 'Deep Focus'
  },
  {
    id: 'quick_wins',
    title: 'Quick Wins & Momentum',
    description: 'Knock out rapid high-value short tasks first to clear your queue and generate rapid psychological momentum.',
    iconName: 'Flame',
    badge: 'Speed Run'
  },
  {
    id: 'deadline_first',
    title: 'Urgency & Deadline Focus',
    description: 'Strict priority sequence based on upcoming deadlines and time sensitivity to prevent missed targets.',
    iconName: 'Clock',
    badge: 'Deadline Guard'
  },
  {
    id: 'energy_flow',
    title: 'Cognitive Energy Sync',
    description: 'Align high-energy brain tasks with peak focus blocks, reserving low-energy admin tasks for afternoon lulls.',
    iconName: 'BatteryCharging',
    badge: 'Flow State'
  }
];

export const SAMPLE_BRAIN_DUMPS = [
  "I have to debug the checkout timeout on Safari (urgent 90m), write Q3 roadmap draft (2h high priority), approve 3 expense reports (15m low), review 2 PRs (45m), send weekly client status email before 5pm (20m), and clean up Drive folders (1h).",
  "Prepare client pitch deck for Friday (3h), fix CSS padding issue on header (15m), call supplier about shipping delay (30m high), schedule team 1-on-1s (20m), submit tax documentation (1h urgent).",
  "Write blog post announcement (90m), update dependencies in package.json (30m), respond to candidate interview feedback (20m), record product demo video (45m high priority)."
];
