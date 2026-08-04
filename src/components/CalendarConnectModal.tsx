import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, X, Shield, Lock, Sparkles, Check } from 'lucide-react';
import { GoogleCalendarEvent } from '../types';

interface CalendarConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  events: GoogleCalendarEvent[];
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  includeInMasterPlan: boolean;
  onToggleIncludeInMasterPlan: (val: boolean) => void;
}

export const CalendarConnectModal: React.FC<CalendarConnectModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  events,
  isLoading,
  onConnect,
  onDisconnect,
  onSync,
  includeInMasterPlan,
  onToggleIncludeInMasterPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div id="calendar-modal-backdrop" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div id="calendar-modal-card" className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Google Calendar Integration
              </h2>
              <p className="text-xs text-slate-400">
                Fit your AI master task sequence around your real-world meetings.
              </p>
            </div>
          </div>

          <button
            id="btn-close-calendar-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Connection Status Card */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isConnected
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold text-white">
                  {isConnected ? 'Google Calendar Connected' : 'Google Calendar Disconnected'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isConnected
                    ? `${events.length} calendar events loaded as hard schedule constraints.`
                    : 'Authorize Google Calendar read permissions to avoid scheduling conflicts.'}
                </p>
              </div>
            </div>

            {isConnected ? (
              <button
                type="button"
                onClick={onDisconnect}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={onConnect}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                <span>Connect Account</span>
              </button>
            )}
          </div>

          {/* Settings & Toggle */}
          {isConnected && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">Constraint Mode</span>
                  <p className="text-[11px] text-slate-400">
                    Skip Google Calendar meeting hours when time-boxing tasks.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInMasterPlan}
                    onChange={(e) => onToggleIncludeInMasterPlan(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {events.length} Upcoming Events Today
                </span>
                <button
                  type="button"
                  onClick={onSync}
                  disabled={isLoading}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Events</span>
                </button>
              </div>
            </div>
          )}

          {/* Events Preview */}
          {isConnected && events.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Detected Calendar Events
              </span>
              <div className="space-y-2">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <div>
                        <span className="font-semibold text-white">{evt.title}</span>
                        {evt.location && <span className="text-slate-400 text-[10px] block">{evt.location}</span>}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40">
                      {evt.startTime} – {evt.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OAuth Setup Info & Copyable Redirect URI */}
          {!isConnected && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" /> Authorized Callback Redirect URI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                In your Google Cloud Console OAuth 2.0 Client credentials, register this exact Authorized Redirect URI:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-blue-300 flex items-center justify-between gap-2 overflow-x-auto">
                <span className="truncate">{typeof window !== 'undefined' ? `${window.location.origin}/api/auth/google/callback` : '/api/auth/google/callback'}</span>
                <button
                  type="button"
                  onClick={() => {
                    const uri = `${window.location.origin}/api/auth/google/callback`;
                    navigator.clipboard.writeText(uri);
                    alert('Copied Authorized Redirect URI to clipboard!');
                  }}
                  className="px-2 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-[10px] font-sans font-bold shrink-0 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 flex items-center gap-2.5 text-[11px] text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Read-only access is used exclusively for event timeline matching. Your data stays private.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
