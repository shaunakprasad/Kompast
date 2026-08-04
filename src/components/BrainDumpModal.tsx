import React, { useState } from 'react';
import { X, Brain, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';
import { Task } from '../types';
import { SAMPLE_BRAIN_DUMPS } from '../data/presetTasks';

interface BrainDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksImported: (newTasks: Omit<Task, 'id' | 'createdAt' | 'status'>[]) => void;
}

export const BrainDumpModal: React.FC<BrainDumpModalProps> = ({
  isOpen,
  onClose,
  onTasksImported
}) => {
  const [brainDumpText, setBrainDumpText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

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
    <div id="braindump-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div id="braindump-modal-card" className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                Natural Language Task Import
              </h2>
              <p className="text-xs text-slate-400">
                Paste raw notes, emails, or bullet points. AI will structure title, urgency & length.
              </p>
            </div>
          </div>
          <button
            id="btn-close-braindump"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <textarea
              id="input-braindump-text"
              rows={5}
              value={brainDumpText}
              onChange={(e) => setBrainDumpText(e.target.value)}
              placeholder="Example: Need to fix payment bug on Safari (urgent 1h), reply to team emails (30m), write Q3 strategy roadmap draft (2 hours high priority), approve expenses..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Preset Prompts / Sample Inputs */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Or try a sample brain dump:
            </span>
            <div className="space-y-1.5">
              {SAMPLE_BRAIN_DUMPS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBrainDumpText(sample)}
                  className="w-full text-left text-xs bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-2.5 rounded-xl text-slate-300 transition-colors line-clamp-1"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              id="btn-cancel-braindump"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-braindump"
              type="button"
              onClick={handleParse}
              disabled={!brainDumpText.trim() || isParsing}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                !brainDumpText.trim() || isParsing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Parsing Tasks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Parse & Import</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
