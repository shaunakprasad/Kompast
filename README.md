# Ontask — Intuitive AI Task Strategist & Execution Engine

**Ontask** is an intelligent reasoning task strategist and schedule optimizer powered by Google Gemini AI. It converts unstructured brain dumps, messy to-do lists, and fixed deadlines into time-blocked, prioritized master execution plans—tailored to your energy levels, bedtime schedule, and Google Calendar.

---

## ✨ Features

- ⚡ **AI Plan Generation**: Uses Gemini reasoning to calculate realistic task durations, optimal task sequencing, buffer breaks, and deep-work strategy.
- 🧠 **Brain Dump Parser**: Paste raw text, emails, or bullet points to instantly extract structured tasks with estimated durations and priority tags.
- 🗓️ **Google Calendar Sync**: Authenticate with Google OAuth 2.0 to sync your generated AI execution plans directly into Google Calendar.
- 🎯 **Focus Runner Mode**: Interactive, distraction-free execution view with timer controls, task progress tracking, and session completion celebrations.
- 🌙 **Bedtime & Sleep Constraint Manager**: Configurable sleep schedules to ensure tasks are never scheduled past your target bedtime.
- 📊 **Multiple Scheduling Strategies**:
  - **Balanced (Recommended)**: Optimal mix of high-priority deep work and quick wins.
  - **Deep Work First**: Front-loads intense cognitive tasks when willpower is highest.
  - **Fast Wins First**: Build momentum early with quick, low-friction tasks.
  - **Burnout Prevention**: Gentle pacing with frequent rest breaks.
- 💬 **AI Reasoning Coach**: Interactive side-drawer chat to adjust schedules, ask for task breakdowns, or reprioritize on the fly.
- 🌗 **Adaptive Dark & Light Theme**: Polished, modern UI built for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React Icons
- **Backend**: Node.js, Express server (with Vite middleware in development)
- **AI Integration**: `@google/genai` SDK (Gemini 2.5 Flash)
- **Calendar Integration**: `googleapis` (OAuth 2.0 & Google Calendar API v3)
- **Build System**: Vite & `esbuild`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Gemini API Key (Required for AI planning & Brain Dump)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Calendar OAuth 2.0 Credentials (Optional, for Calendar Sync)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> **Note**: Never commit your actual `.env` file or API secrets to version control. Keep `.env` listed in `.gitignore`.

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ontask.git
   cd ontask
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🗓️ Google Calendar OAuth Setup Guide

To enable Google Calendar sync in Ontask:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable the **Google Calendar API**.
3. Configure the **OAuth Consent Screen** (User Type: External or Internal).
4. Navigate to **Credentials** -> **Create Credentials** -> **OAuth 2.0 Client ID**.
5. Select **Web application** as the application type.
6. Under **Authorized redirect URIs**, add your application's callback URL:
   - For local development: `http://localhost:3000/api/auth/google/callback`
   - For deployed environments: `https://your-domain.com/api/auth/google/callback`
7. Copy the **Client ID** and **Client Secret** into your `.env` file.

---

## 📁 Project Architecture

```
├── server.ts              # Express server with API routes & OAuth handlers
├── src/
│   ├── App.tsx            # Main layout and global state orchestrator
│   ├── components/        # UI Modals, Timelines, Priority Matrix & Drawers
│   │   ├── BedtimeModal.tsx
│   │   ├── BrainDumpModal.tsx
│   │   ├── CalendarConnectModal.tsx
│   │   ├── FocusRunnerModal.tsx
│   │   ├── Header.tsx
│   │   ├── PlanAssistantDrawer.tsx
│   │   ├── PriorityMatrix.tsx
│   │   ├── ReasoningBreakdown.tsx
│   │   ├── StrategySelector.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskFormModal.tsx
│   │   ├── TaskList.tsx
│   │   └── TimelineSchedule.tsx
│   ├── data/              # Default sample tasks and presets
│   ├── types.ts           # TypeScript type definitions
│   └── main.tsx           # React entry point
├── .env.example           # Template for required environment variables
├── metadata.json          # Applet config and permissions
├── package.json           # Scripts and dependencies
└── README.md              # Project documentation
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for details.
