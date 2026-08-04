import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to get initialized GoogleGenAI client
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Google OAuth Helper
function getOAuth2Client(req?: express.Request) {
  const clientId = process.env.CLIENT_ID || process.env.GOOGLE_CLIENT_ID || process.env.OAUTH_CLIENT_ID || "";
  const clientSecret = process.env.CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || process.env.OAUTH_CLIENT_SECRET || "";
  
  let redirectUri = "";
  if (req && req.query && typeof req.query.redirect_uri === "string" && req.query.redirect_uri) {
    redirectUri = req.query.redirect_uri;
  } else if (req && req.body && typeof req.body.redirect_uri === "string" && req.body.redirect_uri) {
    redirectUri = req.body.redirect_uri;
  } else if (process.env.REDIRECT_URI) {
    redirectUri = process.env.REDIRECT_URI;
  } else if (process.env.APP_URL) {
    redirectUri = `${process.env.APP_URL.replace(/\/$/, '')}/api/auth/google/callback`;
  } else if (req) {
    const xfp = req.headers["x-forwarded-proto"];
    const protocol = xfp ? (Array.isArray(xfp) ? xfp[0] : xfp.split(",")[0].trim()) : (req.protocol || "https");
    const xfh = req.headers["x-forwarded-host"];
    const host = xfh ? (Array.isArray(xfh) ? xfh[0] : xfh.split(",")[0].trim()) : (req.headers.host || "localhost:3000");
    redirectUri = `${protocol}://${host}/api/auth/google/callback`;
  } else {
    redirectUri = "http://localhost:3000/api/auth/google/callback";
  }

  console.log("[OAuth Helper] Client ID present:", !!clientId, "| Redirect URI:", redirectUri);

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  return { oauth2Client, redirectUri, clientId, clientSecret };
}

// OAuth Routes
app.get("/api/auth/google/url", (req, res) => {
  try {
    const { oauth2Client, redirectUri } = getOAuth2Client(req);
    const scopes = [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events.readonly"
    ];
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      redirect_uri: redirectUri
    });
    return res.json({ url, redirectUri });
  } catch (err: any) {
    console.error("Error generating auth url:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing authentication authorization code.");
  }

  try {
    const { oauth2Client, redirectUri } = getOAuth2Client(req);
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: redirectUri
    });

    // Send HTML script that posts message to opener or stores token and redirects home
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authentication Successful</title></head>
        <body style="font-family: sans-serif; background: #0F1117; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center; background: #16181D; padding: 30px; border-radius: 16px; border: 1px solid #334155;">
            <h2 style="color: #818cf8; margin-bottom: 10px;">Google Calendar Connected!</h2>
            <p style="color: #94a3b8; font-size: 14px;">Closing window and returning to Master Plan AI...</p>
          </div>
          <script>
            const tokens = ${JSON.stringify(tokens)};
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', tokens }, '*');
              window.close();
            } else {
              localStorage.setItem('google_calendar_tokens', JSON.stringify(tokens));
              window.location.href = '/?calendar_connected=true';
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error("Error exchanging OAuth code:", err);
    return res.status(500).send("Authentication failed: " + err.message);
  }
});

// Fetch Google Calendar Events Endpoint
app.post("/api/calendar/events", async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.body;
    if (!accessToken && !refreshToken) {
      return res.status(400).json({ error: "Access token or refresh token is required" });
    }

    const { oauth2Client } = getOAuth2Client(req);
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Fetch events for today & tomorrow
    const timeMin = new Date();
    timeMin.setHours(0, 0, 0, 0);

    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 2);
    timeMax.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const items = response.data.items || [];
    const formattedEvents = items.map((evt) => {
      const startIso = evt.start?.dateTime || evt.start?.date;
      const endIso = evt.end?.dateTime || evt.end?.date;

      const formatTime = (iso?: string) => {
        if (!iso) return "All Day";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };

      return {
        id: evt.id || `evt-${Math.random()}`,
        title: evt.summary || "Busy Event",
        startTime: formatTime(startIso),
        endTime: formatTime(endIso),
        startIso,
        endIso,
        location: evt.location || undefined,
        link: evt.htmlLink || undefined,
        isAllDay: !evt.start?.dateTime
      };
    });

    return res.json({ events: formattedEvents });
  } catch (err: any) {
    console.error("Error fetching Google Calendar events:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch Google Calendar events" });
  }
});

// 1. Brain Dump Parser Endpoint
app.post("/api/parse-brain-dump", async (req, res) => {

  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text field is required" });
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are an expert executive productivity assistant. Parse the following unorganized task dump or notes into structured tasks. Extract titles, estimated minutes (estimate logically if unstated e.g. quick email = 15m, writing report = 90m), importance (critical, high, medium, low), category, deadlines, and subtask steps if mentioned.

User Task Brain Dump:
"${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Clear, actionable task name" },
                  description: { type: Type.STRING, description: "Detailed notes or background context" },
                  importance: { 
                    type: Type.STRING, 
                    description: "Importance level: critical, high, medium, or low" 
                  },
                  estimatedMinutes: { type: Type.NUMBER, description: "Estimated completion length in minutes" },
                  category: { type: Type.STRING, description: "Category name e.g. Engineering, Admin, Client, Personal" },
                  deadline: { type: Type.STRING, description: "Deadline if mentioned, otherwise empty" },
                  energyLevel: { type: Type.STRING, description: "Required cognitive focus: high, medium, or low" },
                  subtasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Actionable sub-steps if applicable"
                  }
                },
                required: ["title", "importance", "estimatedMinutes"]
              }
            }
          },
          required: ["tasks"]
        }
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json(parsedJson);
  } catch (error: any) {
    console.error("Error parsing brain dump:", error);
    // Graceful fallback if API key is missing or fails
    return res.status(500).json({ 
      error: error?.message || "Failed to parse brain dump text",
      fallback: true 
    });
  }
});

// 2. Master Plan Generator Endpoint
app.post("/api/generate-master-plan", async (req, res) => {
  try {
    const { tasks, strategy = "balanced", startTime = "09:00 AM", calendarEvents = [], bedtimeLimit = "10:30 PM" } = req.body;
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "At least one task is required to generate a master plan." });
    }

    const ai = getAIClient();

    const systemInstruction = `You are MasterPlan AI, a world-class productivity strategist specializing in intuitive reasoning, cognitive load management, priority matrix calculations, time-boxing, and calendar integration.

Your goal: Take the list of work tasks and perform deep intuitive reasoning to generate a Master Execution Plan.

CRITICAL TIMELINE & CONSTRAINTS:
1. Bedtime Constraint: The user's bedtime for today is set to ${bedtimeLimit}. NO WORK TASKS should be scheduled after ${bedtimeLimit}. If total tasks exceed available hours before bedtime, schedule what fits and explicitly note in 'bedtimeConstraintAlert' how many tasks were pushed to tomorrow to protect sleep.
2. Google Calendar Constraints: The user has existing calendar events: ${JSON.stringify(calendarEvents)}. Treat these as HARD BUSY TIME BLOCKS. Work tasks MUST fit around these calendar event slots without overlapping.

Consider the user's strategy preference:
- 'balanced': Deep balance of high-impact importance, duration length, deadlines, dependencies, and burnout prevention.
- 'eat_the_frog': Put the heaviest/highest importance tasks first while focus energy is at peak.
- 'quick_wins': Put quick, high-impact short tasks first to clear queue velocity and build psychological momentum.
- 'deadline_first': Prioritize tasks with imminent deadlines and time constraints.
- 'energy_flow': Match high-focus tasks in the early blocks and low-focus administrative tasks in afternoon slots.

Intuitive Reasoning Guidelines:
1. Assess task Importance vs Length (Duration). Short, critical tasks are Quick Wins. Long, critical tasks are Major Projects. Short, low-importance tasks are Fill-ins. Long, low-importance tasks are Hard Slogs.
2. Evaluate dependencies: if Task B depends on Task A, Task A must come before Task B.
3. Schedule precise start and end times starting from ${startTime}, accounting for task durations, skipping over Google Calendar event blocks, and inserting 10-15 minute cognitive recovery breaks after intense sessions (>60 minutes).
4. Provide transparent, compelling intuitive reasoning for EVERY single task's placement (e.g. "Scheduled #1 because it resolves a critical blocker with short duration before your 11:00 AM Team Sync.")
5. Assign a priority score (0-100) reflecting its strategic ranking.
6. Provide an Executive Summary explaining the overall tactical strategy of this master plan.
7. Outline 3 Key Strategic Principles applied and 3 Productivity Insights tailored specifically to these tasks.`;

    const promptText = `Tasks to analyze and sequence (Start time: ${startTime}, Strategy: ${strategy}, Bedtime limit: ${bedtimeLimit}):
Tasks: ${JSON.stringify(tasks, null, 2)}
Calendar Events: ${JSON.stringify(calendarEvents, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING, description: "2-3 sentence overview of the master plan design" },
            keyPrinciples: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 strategic principles used to structure this sequence" 
            },
            totalEstimatedMinutes: { type: Type.NUMBER, description: "Total minutes including work + breaks" },
            productivityInsights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable advice specific to these tasks" 
            },
            bedtimeConstraintAlert: { 
              type: Type.STRING, 
              description: "Optional notice if tasks overflowed past bedtime or if bedtime protection was applied" 
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskId: { type: Type.STRING, description: "Must match input task id" },
                  order: { type: Type.NUMBER, description: "1-based order in master plan sequence" },
                  scheduledStartTime: { type: Type.STRING, description: "e.g. 09:00 AM" },
                  scheduledEndTime: { type: Type.STRING, description: "e.g. 10:30 AM" },
                  reasoning: { type: Type.STRING, description: "Intuitive reasoning explaining task placement based on importance and length" },
                  priorityScore: { type: Type.NUMBER, description: "Score between 0 and 100" },
                  effortVsImpactCategory: {
                    type: Type.STRING,
                    description: "Must be one of: quick_win, major_project, fill_in, hard_slog"
                  },
                  subtaskRecommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Actionable micro-steps to accomplish this task smoothly"
                  },
                  riskWarning: { type: Type.STRING, description: "Risk note or bottleneck caution if any" }
                },
                required: ["taskId", "order", "reasoning", "priorityScore", "effortVsImpactCategory"]
              }
            },
            recommendedBreaks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  afterTaskId: { type: Type.STRING, description: "ID of task after which break should occur" },
                  durationMinutes: { type: Type.NUMBER, description: "Break length e.g. 15" },
                  rationale: { type: Type.STRING, description: "Why break is recommended here" }
                },
                required: ["afterTaskId", "durationMinutes", "rationale"]
              }
            }
          },
          required: ["executiveSummary", "keyPrinciples", "tasks", "totalEstimatedMinutes", "productivityInsights"]
        }
      }
    });

    const masterPlanResult = JSON.parse(response.text || "{}");
    return res.json(masterPlanResult);
  } catch (error: any) {
    console.error("Error generating master plan:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate AI master plan.",
      fallback: true
    });
  }
});

// 3. AI Plan Assistant / Reasoning Chat Endpoint
app.post("/api/quick-reasoning-chat", async (req, res) => {
  try {
    const { tasks, masterPlan, question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    const ai = getAIClient();
    const systemInstruction = `You are MasterPlan AI Assistant, an empathetic, sharp productivity coach. The user is asking a question or requesting a adjustment about their tasks or master plan.

Answer with intuitive clarity, practical time management logic, and actionable suggestions. Keep response engaging, concise, and formatted nicely in markdown.`;

    const promptText = `User Tasks:
${JSON.stringify(tasks, null, 2)}

Current Master Plan:
${JSON.stringify(masterPlan, null, 2)}

User Question/Request:
"${question}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: { systemInstruction }
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in reasoning chat:", error);
    return res.status(500).json({ error: error?.message || "Failed to answer question." });
  }
});

// Start Vite middleware in dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
