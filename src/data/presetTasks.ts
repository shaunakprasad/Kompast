import { Task, MasterPlanStrategy, StrategyOption, ProductivityFramework, UserRoleCategory } from '../types';

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

export const HIGH_SCHOOL_TASKS: Task[] = [
  {
    id: 'hs-1',
    title: 'AP Biology Lab Report on Photosynthesis',
    description: 'Calculate rate of oxygen production, graph results, and write conclusion section.',
    importance: 'critical',
    estimatedMinutes: 90,
    deadline: 'Tomorrow 8:00 AM',
    category: 'Science',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [
      { id: 'sub-hs1', title: 'Plot bar chart of wavelength vs rate', completed: false },
      { id: 'sub-hs2', title: 'Answer discussion questions 1-4', completed: false }
    ],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hs-2',
    title: 'Algebra II / Trigonometry Problem Set #14',
    description: 'Solve problems on unit circle angles and sine/cosine identities.',
    importance: 'high',
    estimatedMinutes: 50,
    deadline: 'Today 5:00 PM',
    category: 'Math',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hs-3',
    title: 'English Literature Essay Outline & Thesis',
    description: 'Outline 3 body paragraphs on Gatsby symbolism and formulate central thesis.',
    importance: 'medium',
    estimatedMinutes: 45,
    category: 'Humanities',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hs-4',
    title: 'Track Practice / Extracurricular Conditioning',
    description: '45-minute sprint intervals and team stretches.',
    importance: 'medium',
    estimatedMinutes: 45,
    category: 'Extracurricular',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hs-5',
    title: 'Review Spanish Vocabulary Flashcards on Quizlet',
    description: 'Quick 20-minute vocab review for Friday subjunctive test.',
    importance: 'low',
    estimatedMinutes: 20,
    category: 'Language',
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
  },
  {
    id: 'w-5',
    title: 'Organize Next Week Project Milestones in Jira',
    description: 'Clean backlog, assign story points, and verify ticket dependencies.',
    importance: 'low',
    estimatedMinutes: 25,
    category: 'Operations',
    energyLevel: 'low',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  }
];

export const FOUNDER_TASKS: Task[] = [
  {
    id: 'fd-1',
    title: 'Deploy Critical Payment Gateway Integration Patch',
    description: 'Test checkout webhooks, verify production SSL certificates, and confirm zero error spikes.',
    importance: 'critical',
    estimatedMinutes: 90,
    deadline: 'Today 1:00 PM',
    category: 'Product & Tech',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [
      { id: 'sub-f1', title: 'Run end-to-end sandbox purchase', completed: false },
      { id: 'sub-f2', title: 'Verify Sentry alert rules', completed: false }
    ],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fd-2',
    title: 'Conduct 3 Customer Discovery & Feedback Calls',
    description: 'Deep dive interviews on onboarding drop-off and requested enterprise export features.',
    importance: 'high',
    estimatedMinutes: 75,
    deadline: 'Today 4:00 PM',
    category: 'Growth & Sales',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fd-3',
    title: 'Investor & Runway Monthly Update Memo',
    description: 'Synthesize monthly MRR growth, burn rate, key hires, and top 2 asks.',
    importance: 'high',
    estimatedMinutes: 45,
    category: 'Fundraising',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fd-4',
    title: 'Unblock Engineering Team & Review 2 Urgent PRs',
    description: 'Provide architectural feedback and sign off on database schema migrations.',
    importance: 'medium',
    estimatedMinutes: 30,
    category: 'Leadership',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  }
];

export const FREELANCER_TASKS: Task[] = [
  {
    id: 'fl-1',
    title: 'Finalize Interactive UI Design Prototypes for Client X',
    description: 'Deliver responsive mobile layouts and Figma component auto-layout specs.',
    importance: 'critical',
    estimatedMinutes: 120,
    deadline: 'Today 3:30 PM',
    category: 'Client Deliverable',
    energyLevel: 'high',
    dependencies: [],
    subtasks: [
      { id: 'sub-fl1', title: 'Design checkout modal states', completed: false },
      { id: 'sub-fl2', title: 'Export asset tokens & icons', completed: false }
    ],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fl-2',
    title: 'Send Invoice Batch & Follow up on Milestone Payments',
    description: 'Generate Stripe invoices for completed Phase 2 and confirm wire receipts.',
    importance: 'high',
    estimatedMinutes: 25,
    category: 'Finance & Admin',
    energyLevel: 'low',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fl-3',
    title: 'Pitch Proposal & Scope Estimate for New Retainer',
    description: 'Draft statement of work, milestone deliverables, and hourly cap breakdown.',
    importance: 'medium',
    estimatedMinutes: 60,
    category: 'Business Development',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fl-4',
    title: 'Curate Design Portfolio Case Study & Post on Dribbble',
    description: 'Write 200-word overview and upload 3 high-res mockups for social reach.',
    importance: 'low',
    estimatedMinutes: 35,
    category: 'Marketing',
    energyLevel: 'medium',
    dependencies: [],
    subtasks: [],
    status: 'todo',
    createdAt: new Date().toISOString()
  }
];

export const PRESET_FRAMEWORKS: ProductivityFramework[] = [
  {
    id: 'fw-university',
    name: 'University Academic Sprint & Deep Study',
    badge: 'College / Higher Ed',
    roleCategory: 'university_student',
    summary: 'Optimized for heavy cognitive problem sets, lectures, campus collaboration, and exam mastery without burning out.',
    idealFor: 'Undergraduate and graduate students balancing problem sets, lectures, research, and campus projects.',
    recommendedStrategy: 'balanced',
    recommendedStartTime: '08:30 AM',
    suggestedBedtime: {
      bedtime: '11:30 PM',
      wakeTime: '07:30 AM'
    },
    scheduleStructure: [
      {
        phase: 'Morning Prime Focus',
        timeRange: '08:30 AM - 11:30 AM',
        focusType: 'High-Impact Cognition',
        tip: 'Tackle exam prep and heavy conceptual study before campus distractions begin.'
      },
      {
        phase: 'Midday Problem Sets & Classes',
        timeRange: '11:30 AM - 03:30 PM',
        focusType: 'Execution & Lecture Processing',
        tip: 'Submit assignments and attend labs or problem set review sessions.'
      },
      {
        phase: 'Afternoon Collaboration & Readings',
        timeRange: '03:30 PM - 06:30 PM',
        focusType: 'Group Syncs & Low-Stress Reading',
        tip: 'Sync with project partners and complete weekly seminar reading.'
      },
      {
        phase: 'Nightly Wind-Down & Review',
        timeRange: '10:00 PM - 11:30 PM',
        focusType: 'Buffer & Cognitive Recovery',
        tip: 'Avoid late-night cramming; prioritize 8 hours of sleep for memory retention.'
      }
    ],
    starterTasks: []
  },
  {
    id: 'fw-high-school',
    name: 'High School Dual-Track Academic & Activity',
    badge: 'High School',
    roleCategory: 'high_school_student',
    summary: 'Balances early bell schedules, structured homework sprints, test review, sports/extracurriculars, and disciplined bedtime.',
    idealFor: 'High school students preparing for AP/IB courses, exams, sports practice, and college applications.',
    recommendedStrategy: 'deadline_first',
    recommendedStartTime: '07:30 AM',
    suggestedBedtime: {
      bedtime: '10:30 PM',
      wakeTime: '06:30 AM'
    },
    scheduleStructure: [
      {
        phase: 'Early Morning Prep & Classes',
        timeRange: '07:30 AM - 12:00 PM',
        focusType: 'Core Academic Subjects',
        tip: 'Focus on science and math classes when morning alert levels are high.'
      },
      {
        phase: 'Afternoon Classes & Athletics/Clubs',
        timeRange: '12:00 PM - 04:30 PM',
        focusType: 'Labs, Discussions & Team Practice',
        tip: 'Engage physically in sports or extracurriculars to reset mental energy.'
      },
      {
        phase: 'Golden Homework Sprint',
        timeRange: '05:00 PM - 07:30 PM',
        focusType: 'Immediate Homework & Lab Reports',
        tip: 'Finish tonight’s assignments immediately after practice before evening fatigue sets in.'
      },
      {
        phase: 'Rest & Early Sleep Buffer',
        timeRange: '09:30 PM - 10:30 PM',
        focusType: 'Device-Free Relaxation',
        tip: 'Set devices to sleep mode for a solid 8-hour rest before early morning class.'
      }
    ],
    starterTasks: []
  },
  {
    id: 'fw-corporate',
    name: 'Corporate 9-to-5 High-Leverage Strategic',
    badge: 'Business & Office',
    roleCategory: 'corporate_business',
    summary: 'Structured around morning strategic deep work, meeting buffers, afternoon comms sweeps, and a clean shutdown routine.',
    idealFor: 'Professionals, managers, engineers, and knowledge workers in corporate or hybrid office environments.',
    recommendedStrategy: 'eat_the_frog',
    recommendedStartTime: '09:00 AM',
    suggestedBedtime: {
      bedtime: '11:00 PM',
      wakeTime: '07:00 AM'
    },
    scheduleStructure: [
      {
        phase: 'Morning High-Value Deep Work',
        timeRange: '09:00 AM - 11:30 AM',
        focusType: 'Eat The Frog (Highest Impact Task)',
        tip: 'Work on your hardest strategic deliverable before checking email or Slack.'
      },
      {
        phase: 'Midday Team Sync & Meetings',
        timeRange: '11:30 AM - 02:00 PM',
        focusType: 'Collaborations & Alignment',
        tip: 'Group meetings and standups together to protect your afternoon.'
      },
      {
        phase: 'Afternoon Execution & Comms',
        timeRange: '02:00 PM - 04:30 PM',
        focusType: 'Reviews, Code/Docs & Inbox Zero',
        tip: 'Clear pending approvals, answer stakeholder emails, and review peer deliverables.'
      },
      {
        phase: 'Shutdown & Next-Day Planning',
        timeRange: '04:30 PM - 05:00 PM',
        focusType: 'Daily Wrap-up',
        tip: 'Clean your desk, log accomplished tasks, and confirm tomorrow’s top priority.'
      }
    ],
    starterTasks: []
  },
  {
    id: 'fw-founder',
    name: 'Startup Founder Agile Sprint & Leverage',
    badge: 'Founders & Builders',
    roleCategory: 'startup_founder',
    summary: 'Built for founders juggling product builds, rapid customer feedback loops, investor comms, and team unblocking.',
    idealFor: 'Early-stage founders, startup operators, solo builders, and tech entrepreneurs.',
    recommendedStrategy: 'eat_the_frog',
    recommendedStartTime: '08:00 AM',
    suggestedBedtime: {
      bedtime: '11:15 PM',
      wakeTime: '06:45 AM'
    },
    scheduleStructure: [
      {
        phase: 'Zero-Distraction Build Sprint',
        timeRange: '08:00 AM - 11:00 AM',
        focusType: 'Core Product & Architecture',
        tip: 'Code, design, or ship the #1 most critical blocker before external inbound calls.'
      },
      {
        phase: 'Customer & Investor Outbound',
        timeRange: '11:00 AM - 02:30 PM',
        focusType: 'Feedback Loops & Sales',
        tip: 'Run customer discovery interviews, pitch calls, and user onboarding walkthroughs.'
      },
      {
        phase: 'Team Unblocking & Speed Run',
        timeRange: '02:30 PM - 05:30 PM',
        focusType: 'Fast Decision Making',
        tip: 'Review pull requests, answer urgent team questions, and sign off on deployments.'
      },
      {
        phase: 'Strategic Reflection & Health',
        timeRange: '08:30 PM - 10:00 PM',
        focusType: 'Decompression & Overview',
        tip: 'Review high-level metrics and protect sleep consistency for sustained endurance.'
      }
    ],
    starterTasks: []
  },
  {
    id: 'fw-freelancer',
    name: 'Independent Flow & Client Output',
    badge: 'Freelance & Creative',
    roleCategory: 'freelancer_creative',
    summary: 'Balances sustained creative flow blocks with client feedback turnaround, billing admin, and new proposal pitching.',
    idealFor: 'Designers, writers, consultants, developers, and independent creators.',
    recommendedStrategy: 'energy_flow',
    recommendedStartTime: '09:30 AM',
    suggestedBedtime: {
      bedtime: '11:45 PM',
      wakeTime: '08:00 AM'
    },
    scheduleStructure: [
      {
        phase: 'Creative Flow Block',
        timeRange: '09:30 AM - 12:30 PM',
        focusType: 'Deep Client Deliverables',
        tip: 'Produce core client creative assets while mental clarity and enthusiasm are peak.'
      },
      {
        phase: 'Client Revisions & Feedback',
        timeRange: '01:30 PM - 03:30 PM',
        focusType: 'Iterative Turnaround',
        tip: 'Incorporate client feedback and export reviewed deliverables.'
      },
      {
        phase: 'Business Ops & Invoicing',
        timeRange: '03:30 PM - 05:30 PM',
        focusType: 'Proposals, Invoices & Pipeline',
        tip: 'Send invoices, respond to inbound inquiries, and draft next week’s scopes.'
      }
    ],
    starterTasks: []
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
