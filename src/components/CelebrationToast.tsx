import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, CheckCircle2, Zap, X, Flame, Star, Award } from 'lucide-react';

export interface ComplimentData {
  id: string;
  headline: string;
  compliment: string;
  taskTitle: string;
}

interface CelebrationToastProps {
  data: ComplimentData | null;
  onDismiss: () => void;
  durationMs?: number;
}

export const CelebrationToast: React.FC<CelebrationToastProps> = ({
  data,
  onDismiss,
  durationMs = 5000
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!data) return;

    setProgress(100);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remaining);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [data, durationMs, onDismiss]);

  if (!data) return null;

  return (
    <div 
      id="celebration-toast-container"
      className="fixed top-6 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/95 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 text-white p-4 backdrop-blur-md">
        {/* Glowing aura */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start gap-3 relative z-10">
          {/* Animated badge icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/30 animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {data.headline}
              </span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                +1 Victory
              </span>
            </div>

            <p className="text-xs font-extrabold text-slate-100 leading-snug">
              "{data.taskTitle}"
            </p>

            <p className="text-xs text-emerald-200/90 mt-1 font-medium leading-relaxed">
              {data.compliment}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Dismiss compliment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar timer */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
