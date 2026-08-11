import React, { useState } from 'react';
import { X, Brain, Sparkles, RefreshCw, HelpCircle, Code, Briefcase, FileText, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';

interface BrainDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksImported: (newTasks: Omit<Task, 'id' | 'createdAt' | 'status'>[]) => void;
}

const SAMPLE_PRESETS = [
  {
    id: 'engineering',
    title: 'Engineering & Strategy',
    icon: Code,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    text: 'I have to debug the checkout timeout on Safari (urgent 90m), write Q3 roadmap draft (2h high priority), approve 3 expense reports (15m low), review 2 PRs (45m), send weekly client status email before 5pm (20m), and clean up Drive folders (1h).'
  },
  {
    id: 'operations',
    title: 'Client & Operations',
    icon: Briefcase,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    text: 'Prepare client pitch deck for Friday (3h), fix CSS padding issue on header (15m), call supplier about shipping delay (30m high), schedule team 1-on-1s (20m), submit tax documentation (1h urgent).'
  },
  {
    id: 'content',
    title: 'Content & Product',
    icon: FileText,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    text: 'Write blog post announcement (90m), update dependencies in package.json (30m), respond to candidate interview feedback (20m), record product demo video (45m high priority).'
  }
];

export const BrainDumpModal: React.FC<BrainDumpModalProps> = ({
  isOpen,
  onClose,
  onTasksImported
}) => {
  const [brainDumpText, setBrainDumpText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectSample = (sample: typeof SAMPLE_PRESETS[0]) => {
    setBrainDumpText(sample.text);
    setSelectedSample(sample.id);
  };

  const handleParse = async () => {
    if (!brainDumpText.trim()) return;

    setIsParsing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/parse-brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: brainDumpText.trim() })
      });

      const data = await response.json();

      if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
        const mappedTasks = data.tasks.map((t: any) => ({
          title: t.title || 'Untitled Task',
          description: t.description || '',
          importance: ['low', 'medium', 'high', 'critical'].includes(t.importance) ? t.importance : 'medium',
          estimatedMinutes: Number(t.estimatedMinutes) || 30,
          category: t.category || 'Work',
          deadline: t.deadline || undefined,
          energyLevel: ['low', 'medium', 'high'].includes(t.energyLevel) ? t.energyLevel : 'medium',
          subtasks: Array.isArray(t.subtasks)
            ? t.subtasks.map((sTitle: string, idx: number) => ({
                id: `st-${Date.now()}-${idx}`,
                title: sTitle,
                completed: false
              }))
            : []
        }));

        onTasksImported(mappedTasks);
        setBrainDumpText('');
        onClose();
      } else {
        throw new Error('Could not identify tasks in text.');
      }
    } catch (err: any) {
      console.error('Brain dump parsing failed:', err);
      setErrorMsg('Failed to parse text with AI. Please check your text format.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div id="braindump-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="braindump-modal-card" className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black font-fun text-white flex items-center gap-2">
                <span>Natural Language Task Import</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AI Smart Parser
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Paste raw notes, emails, or bullet points. AI automatically extracts titles, urgency & durations.
              </p>
            </div>
          </div>
          <button
            id="btn-close-braindump"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Input Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="input-braindump-text" className="font-extrabold font-fun text-amber-300 flex items-center gap-1.5">
                <span>Your Brain Dump / Notes:</span>
              </label>
              {brainDumpText && (
                <button
                  type="button"
                  onClick={() => { setBrainDumpText(''); setSelectedSample(null); }}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>
            <textarea
              id="input-braindump-text"
              rows={4}
              value={brainDumpText}
              onChange={(e) => {
                setBrainDumpText(e.target.value);
                setSelectedSample(null);
              }}
              placeholder="Paste raw text here... e.g. Fix checkout bug (urgent 90m), draft Q3 roadmap (2h high priority), approve expenses (15m low)..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-indigo-500/30 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-sans leading-relaxed"
            />
          </div>

          {/* Quick Syntax Tips */}
          <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-3 text-xs text-indigo-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <p>
                <strong className="text-amber-300 font-bold">Pro Tip:</strong> Include durations like <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">30m</code> or <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">2h</code>, urgency like <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">urgent</code> or <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">high priority</code>, and deadlines like <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-200">before 5pm</code>!
              </p>
            </div>
          </div>

          {/* Preset Prompts / Sample Inputs */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold font-fun text-slate-300 block">
              Or click a sample brain dump to try:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_PRESETS.map((sample) => {
                const Icon = sample.icon;
                const isSelected = selectedSample === sample.id;

                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-indigo-950/90 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                        : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-xl border ${sample.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-extrabold font-fun text-white">{sample.title}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed italic">
                      "{sample.text}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-braindump"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-braindump"
              type="button"
              onClick={handleParse}
              disabled={!brainDumpText.trim() || isParsing}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-extrabold transition-all active:scale-95 ${
                !brainDumpText.trim() || isParsing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-500 hover:from-amber-400 hover:to-indigo-400 text-white shadow-lg shadow-amber-500/20'
              }`}
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Parsing Tasks with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Parse & Import Tasks</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
