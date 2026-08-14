import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  Rocket, 
  Palette, 
  Sliders, 
  Clock, 
  Moon, 
  Sun, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  RotateCcw,
  Zap,
  Flame,
  BatteryCharging,
  Layers,
  HelpCircle,
  Settings,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { 
  UserRoleCategory, 
  FocusPeakPeriod, 
  BreakStyle, 
  UserPersonaProfile, 
  ProductivityFramework, 
  Task, 
  MasterPlanStrategy 
} from '../types';
import { PRESET_FRAMEWORKS, STRATEGY_OPTIONS } from '../data/presetTasks';
import { formatTime24to12 } from '../data/defaultBedtime';

interface PersonaFrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserPersonaProfile | null;
  onApplyFramework: (
    framework: ProductivityFramework,
    profile: UserPersonaProfile,
    loadTasks: boolean
  ) => void;
  isFirstTime?: boolean;
}

const ROLE_OPTIONS: Array<{
  id: UserRoleCategory;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  defaultStart: string;
  defaultEnd: string;
  defaultPeak: FocusPeakPeriod;
  defaultBreak: BreakStyle;
  suggestedFwId: string;
  accentColor: string;
}> = [
  {
    id: 'university_student',
    title: 'University / College Student',
    subtitle: 'Undergrad, Master’s, or PhD juggling problem sets, lectures, and exams',
    icon: GraduationCap,
    defaultStart: '08:30 AM',
    defaultEnd: '03:30 PM',
    defaultPeak: 'morning',
    defaultBreak: 'deep_50',
    suggestedFwId: 'fw-university',
    accentColor: 'from-amber-500/20 to-indigo-500/20 border-amber-500/40 text-amber-300'
  },
  {
    id: 'high_school_student',
    title: 'High School Student',
    subtitle: 'AP/IB courses, exams, sports practice, and early class bell schedules',
    icon: BookOpen,
    defaultStart: '07:30 AM',
    defaultEnd: '03:00 PM',
    defaultPeak: 'morning',
    defaultBreak: 'pomodoro_25',
    suggestedFwId: 'fw-high-school',
    accentColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300'
  },
  {
    id: 'corporate_business',
    title: 'Business & Corporate (9-to-5)',
    subtitle: 'Office or hybrid professional managing deliverables, standups, and meetings',
    icon: Briefcase,
    defaultStart: '09:00 AM',
    defaultEnd: '05:00 PM',
    defaultPeak: 'morning',
    defaultBreak: 'deep_50',
    suggestedFwId: 'fw-corporate',
    accentColor: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300'
  },
  {
    id: 'startup_founder',
    title: 'Startup Founder & Builder',
    subtitle: 'Agile sprints, customer discovery, shipping product, and team unblocking',
    icon: Rocket,
    defaultStart: '08:00 AM',
    defaultEnd: '06:00 PM',
    defaultPeak: 'morning',
    defaultBreak: 'ultradian_90',
    suggestedFwId: 'fw-founder',
    accentColor: 'from-rose-500/20 to-orange-500/20 border-rose-500/40 text-rose-300'
  },
  {
    id: 'freelancer_creative',
    title: 'Freelance & Independent Creator',
    subtitle: 'Client design/code deliverables, invoices, and flexible creative flow',
    icon: Palette,
    defaultStart: '09:30 AM',
    defaultEnd: '05:30 PM',
    defaultPeak: 'afternoon',
    defaultBreak: 'flexible',
    suggestedFwId: 'fw-freelancer',
    accentColor: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300'
  },
  {
    id: 'custom',
    title: 'Custom Workflow / Other',
    subtitle: 'Design your own custom daily framework and hours from the ground up',
    icon: Sliders,
    defaultStart: '09:00 AM',
    defaultEnd: '05:00 PM',
    defaultPeak: 'flexible',
    defaultBreak: 'flexible',
    suggestedFwId: 'fw-corporate',
    accentColor: 'from-slate-500/20 to-indigo-500/20 border-slate-500/40 text-slate-300'
  }
];

const TIME_OPTIONS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '08:00 PM',
  '09:00 PM', '10:00 PM', '11:00 PM'
];

export const PersonaFrameworkModal: React.FC<PersonaFrameworkModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onApplyFramework,
  isFirstTime = false
}) => {
  // Wizard view mode: 'questionnaire' | 'recommendation' | 'customize'
  const [viewMode, setViewMode] = useState<'questionnaire' | 'recommendation' | 'customize'>(
    currentProfile && currentProfile.hasCompletedOnboarding ? 'recommendation' : 'questionnaire'
  );

  // Form State
  const [selectedRole, setSelectedRole] = useState<UserRoleCategory>(
    currentProfile?.roleCategory || 'university_student'
  );
  const [institution, setInstitution] = useState<string>(
    currentProfile?.institutionOrCompany || ''
  );
  const [startHour, setStartHour] = useState<string>(
    currentProfile?.workStartHour || '08:30 AM'
  );
  const [endHour, setEndHour] = useState<string>(
    currentProfile?.workEndHour || '05:00 PM'
  );
  const [focusPeak, setFocusPeak] = useState<FocusPeakPeriod>(
    currentProfile?.focusPeak || 'morning'
  );
  const [breakStyle, setBreakStyle] = useState<BreakStyle>(
    currentProfile?.breakStyle || 'deep_50'
  );
  const [primaryGoal, setPrimaryGoal] = useState<string>(
    currentProfile?.primaryGoal || ''
  );

  // Customization state
  const [customFrameworkName, setCustomFrameworkName] = useState<string>('');
  const [customStrategy, setCustomStrategy] = useState<MasterPlanStrategy>('balanced');

  // Reset when modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      if (currentProfile && currentProfile.hasCompletedOnboarding) {
        setSelectedRole(currentProfile.roleCategory);
        setInstitution(currentProfile.institutionOrCompany || '');
        setStartHour(currentProfile.workStartHour || '08:30 AM');
        setEndHour(currentProfile.workEndHour || '05:00 PM');
        setFocusPeak(currentProfile.focusPeak || 'morning');
        setBreakStyle(currentProfile.breakStyle || 'deep_50');
        setPrimaryGoal(currentProfile.primaryGoal || '');
        setViewMode('recommendation');
      } else {
        setViewMode('questionnaire');
      }
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  // Find matching framework
  const getMatchedFramework = (): ProductivityFramework => {
    const roleConfig = ROLE_OPTIONS.find(r => r.id === selectedRole);
    const fwId = roleConfig?.suggestedFwId || 'fw-university';
    const found = PRESET_FRAMEWORKS.find(f => f.id === fwId);
    if (found) {
      return {
        ...found,
        recommendedStartTime: startHour || found.recommendedStartTime
      };
    }
    return PRESET_FRAMEWORKS[0];
  };

  const currentFramework = getMatchedFramework();

  // Handle role selection quick defaults
  const handleSelectRole = (role: UserRoleCategory) => {
    setSelectedRole(role);
    const config = ROLE_OPTIONS.find(r => r.id === role);
    if (config) {
      setStartHour(config.defaultStart);
      setEndHour(config.defaultEnd);
      setFocusPeak(config.defaultPeak);
      setBreakStyle(config.defaultBreak);
    }
  };

  // Submit Questionnaire -> Go to Recommendation
  const handleProceedToRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomFrameworkName(currentFramework.name);
    setCustomStrategy(currentFramework.recommendedStrategy);
    setViewMode('recommendation');
  };

  // Action: Apply Suggested Framework directly (Never inject fake starter tasks)
  const handleAcceptSuggestedFramework = () => {
    const profile: UserPersonaProfile = {
      roleCategory: selectedRole,
      institutionOrCompany: institution.trim() || undefined,
      workStartHour: startHour,
      workEndHour: endHour,
      focusPeak,
      breakStyle,
      primaryGoal: primaryGoal.trim() || undefined,
      hasCompletedOnboarding: true,
      activeFrameworkId: currentFramework.id
    };

    onApplyFramework(currentFramework, profile, false);
    onClose();
  };

  // Action: Apply Custom Framework (Never inject fake starter tasks)
  const handleSaveCustomFramework = () => {
    const profile: UserPersonaProfile = {
      roleCategory: selectedRole,
      customRoleTitle: selectedRole === 'custom' ? (customFrameworkName || 'Custom Persona') : undefined,
      institutionOrCompany: institution.trim() || undefined,
      workStartHour: startHour,
      workEndHour: endHour,
      focusPeak,
      breakStyle,
      primaryGoal: primaryGoal.trim() || undefined,
      hasCompletedOnboarding: true,
      activeFrameworkId: 'custom-framework'
    };

    const customizedFw: ProductivityFramework = {
      ...currentFramework,
      id: 'custom-framework',
      name: customFrameworkName || `${currentFramework.name} (Customized)`,
      badge: 'Customized',
      recommendedStrategy: customStrategy,
      recommendedStartTime: startHour,
      starterTasks: []
    };

    onApplyFramework(customizedFw, profile, false);
    onClose();
  };

  return (
    <div 
      id="persona-framework-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="persona-framework-modal"
        className="bg-slate-950 border border-indigo-500/30 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-indigo-500/20 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black font-fun text-white flex items-center gap-2">
                <span>{viewMode === 'questionnaire' ? 'Personalize Your Schedule Framework' : viewMode === 'recommendation' ? 'Suggested Productivity Framework' : 'Customize Your Framework'}</span>
                {isFirstTime && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Setup
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                {viewMode === 'questionnaire' 
                  ? 'Tell us your role & busy hours so Kompast can schedule your tasks in open windows.' 
                  : viewMode === 'recommendation'
                  ? 'Your personalized daily framework is ready. Use it as-is or customize your strategy.'
                  : 'Tailor your busy time slots and planning strategy.'}
              </p>
            </div>
          </div>

          {!isFirstTime && (
            <button
              id="btn-close-persona-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* VIEW 1: QUESTIONNAIRE */}
          {viewMode === 'questionnaire' && (
            <form onSubmit={handleProceedToRecommendation} className="space-y-6">
              
              {/* Question 1: Role Category */}
              <div className="space-y-2.5">
                <label className="text-xs font-black font-fun text-slate-200 flex items-center gap-1.5">
                  <span>1. What best describes your daily focus role?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ROLE_OPTIONS.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleSelectRole(role.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                          isSelected
                            ? 'bg-indigo-950/60 border-amber-400 shadow-md shadow-amber-500/10'
                            : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border shrink-0 ${role.accentColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>{role.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                            {role.subtitle}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-950">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Institution / Organization / School (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>University, School, or Company (Optional)</span>
                  <span className="text-[10px] text-slate-500">e.g. UC Berkeley, Lincoln High, Stripe</span>
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder={
                    selectedRole.includes('student')
                      ? 'e.g. Stanford University / Lincoln High School'
                      : 'e.g. Acme Corp / Tech Startup / Self-Employed'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-xs text-white placeholder-slate-500 transition-all"
                />
              </div>

              {/* Question 2: What hours are you usually booked / busy? */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <label className="text-xs font-black font-fun text-slate-200 block">
                      2. What hours are you usually booked or busy?
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tell us when you are tied up with classes, lectures, recurring meetings, or fixed commitments. MasterPlan AI treats these as blocked windows and will <strong>not</strong> place your focus tasks during these times.
                    </p>
                  </div>
                </div>

                {/* Time Pickers for Booked Hours */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">Booked / Busy Starts:</span>
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold focus:border-indigo-400 transition-all"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">Booked / Busy Ends:</span>
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-indigo-300 font-bold focus:border-indigo-400 transition-all"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Little note explaining they can add more busy hours later */}
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> You can add onto or adjust your busy hours anytime later, or connect Google Calendar from the top bar to auto-import busy slots.
                  </span>
                </div>
              </div>

              {/* Question 3: Peak Focus Period & Break Rhythm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Peak Energy Window</span>
                  </label>
                  <select
                    value={focusPeak}
                    onChange={(e) => setFocusPeak(e.target.value as FocusPeakPeriod)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-400"
                  >
                    <option value="morning">Morning (Early clarity & focus)</option>
                    <option value="afternoon">Midday / Afternoon (Post-lunch energy)</option>
                    <option value="evening">Evening / Night Owl</option>
                    <option value="flexible">Flexible / Fluctuates daily</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Focus & Break Rhythm</span>
                  </label>
                  <select
                    value={breakStyle}
                    onChange={(e) => setBreakStyle(e.target.value as BreakStyle)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-400"
                  >
                    <option value="deep_50">50 min Focus + 10 min Break</option>
                    <option value="pomodoro_25">25 min Pomodoro Sprints</option>
                    <option value="ultradian_90">90 min Deep Ultradian Blocks</option>
                    <option value="flexible">Fluid Flow State (Flexible)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Generate Recommended Framework</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}


          {/* VIEW 2: RECOMMENDED FRAMEWORK PREVIEW & CHOICE */}
          {viewMode === 'recommendation' && (
            <div className="space-y-6">
              
              {/* Framework Header Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-slate-950 border border-amber-500/40 shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold mb-1.5">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{currentFramework.badge}</span>
                    </div>
                    <h3 className="text-base font-black font-fun text-white">
                      {currentFramework.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewMode('questionnaire')}
                    className="text-[11px] font-bold text-slate-400 hover:text-amber-300 underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retake Quiz</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {currentFramework.summary}
                </p>

                {/* Framework Metrics & Config */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-indigo-500/20 text-[11px]">
                  <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Booked / Busy Hours</span>
                    <span className="font-extrabold text-amber-300">{startHour} – {endHour}</span>
                  </div>
                  <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">AI Strategy</span>
                    <span className="font-extrabold text-indigo-300 capitalize">{currentFramework.recommendedStrategy.replace('_', ' ')}</span>
                  </div>
                  <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-bold">Suggested Sleep</span>
                    <span className="font-extrabold text-emerald-300">
                      {formatTime24to12(currentFramework.suggestedBedtime.bedtime)} (Wake {formatTime24to12(currentFramework.suggestedBedtime.wakeTime)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule Rhythm Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black font-fun text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Suggested Daily Rhythm & Focus Phases</span>
                </h4>
                <div className="space-y-2">
                  {currentFramework.scheduleStructure.map((phase, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white">{phase.phase}</span>
                          <span className="text-[10px] text-amber-300/80 font-mono">({phase.timeRange})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 pl-6">
                          {phase.tip}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg shrink-0">
                        {phase.focusType}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Busy Hours Protection Note */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Your tasks will be placed around your booked hours (<strong className="text-slate-200">{startHour} – {endHour}</strong>) and stop before bedtime (<strong className="text-emerald-300">{formatTime24to12(currentFramework.suggestedBedtime.bedtime)}</strong>). You can add additional busy commitments later anytime.
                </p>
              </div>

              {/* Decision Action Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomFrameworkName(currentFramework.name);
                      setCustomStrategy(currentFramework.recommendedStrategy);
                      setViewMode('customize');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Customize This Framework</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleAcceptSuggestedFramework}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Suggested Framework</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* VIEW 3: CUSTOMIZE FRAMEWORK MODE */}
          {viewMode === 'customize' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/30 space-y-4">
                {/* Custom Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Framework Name
                  </label>
                  <input
                    type="text"
                    value={customFrameworkName}
                    onChange={(e) => setCustomFrameworkName(e.target.value)}
                    placeholder="e.g. My Personalized Productivity System"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-indigo-400"
                  />
                </div>

                {/* Hours Adjuster */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Booked / Busy Starts:
                    </label>
                    <select
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Booked / Busy Ends:
                    </label>
                    <select
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-indigo-300 font-bold"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>The AI will keep these booked hours blocked and place your tasks into open slots.</span>
                </div>

                {/* Strategy Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Select Planning Strategy:
                  </label>
                  <div className="space-y-1.5">
                    {STRATEGY_OPTIONS.map((strat) => (
                      <button
                        key={strat.id}
                        type="button"
                        onClick={() => setCustomStrategy(strat.id)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                          customStrategy === strat.id
                            ? 'bg-indigo-950 border-amber-400 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <span className="font-bold">{strat.title}</span>
                          <p className="text-[10px] text-slate-400 truncate max-w-sm">{strat.description}</p>
                        </div>
                        {customStrategy === strat.id && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode('recommendation')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold"
                >
                  Back to Suggested
                </button>

                <button
                  type="button"
                  onClick={handleSaveCustomFramework}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Apply Custom Framework</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
