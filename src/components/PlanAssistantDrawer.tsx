import React, { useState } from 'react';
import { X, Send, MessageSquare, Sparkles, RefreshCw, Bot, User } from 'lucide-react';
import { MasterPlan, Task } from '../types';

interface PlanAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  currentPlan: MasterPlan | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const PlanAssistantDrawer: React.FC<PlanAssistantDrawerProps> = ({
  isOpen,
  onClose,
  tasks,
  currentPlan
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hello! I'm Northy, your Kompast assistant. Ask me anything about your task order, time allocations, strategy trade-offs, or ask for custom schedule adjustments!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const question = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/quick-reasoning-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks,
          masterPlan: currentPlan,
          question
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "I evaluated your tasks and master plan. Let me know if you'd like to adjust specific time blocks!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const aiErr: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "I experienced a temporary connection hiccup, but generally: prioritize high-impact urgent tasks first and leave admin filler for later!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiErr]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "Why is my payment bug task placed before the Q3 document?",
    "I only have 3 hours today. Which tasks should I prioritize?",
    "How can I prevent fatigue during long deep work blocks?"
  ];

  return (
    <div id="drawer-backdrop" className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div id="drawer-card" className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Northy</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">Kompast Guide</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Ask schedule rationale & tweak your master strategy
              </p>
            </div>
          </div>

          <button
            id="btn-close-drawer"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
              }`}>
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-indigo-400" />}
              </div>

              <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className="text-[9px] text-slate-400 block mt-1 text-right opacity-70">
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-950/40 p-3 rounded-xl border border-indigo-800/40 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing master plan reasoning...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60">
          <span className="text-[10px] font-semibold text-slate-400 block mb-1">
            Suggested questions:
          </span>
          <div className="space-y-1">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="w-full text-left text-[11px] text-indigo-300 hover:text-indigo-200 bg-slate-950/60 hover:bg-slate-950 p-1.5 rounded-lg border border-slate-800/80 truncate"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask why a task was prioritized or ask for tips..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
