import { BedtimeSchedule, DayOfWeek } from '../types';

export const DEFAULT_BEDTIME_SCHEDULE: BedtimeSchedule = {
  monday:    { bedtime: '22:30', wakeTime: '07:00', enabled: true },
  tuesday:   { bedtime: '22:30', wakeTime: '07:00', enabled: true },
  wednesday: { bedtime: '22:30', wakeTime: '07:00', enabled: true },
  thursday:  { bedtime: '22:30', wakeTime: '07:00', enabled: true },
  friday:    { bedtime: '23:30', wakeTime: '08:00', enabled: true },
  saturday:  { bedtime: '23:30', wakeTime: '08:00', enabled: true },
  sunday:    { bedtime: '22:30', wakeTime: '07:00', enabled: true },
};

export function getTodayDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

export function formatTime24to12(time: string): string {
  if (!time) return '10:30 PM';
  const trimmed = time.trim();
  if (trimmed.toUpperCase().includes('AM') || trimmed.toUpperCase().includes('PM')) {
    return trimmed;
  }
  const [hStr, mStr] = trimmed.split(':');
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return trimmed;
  const m = (mStr || '00').replace(/[^0-9]/g, '').padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const padH = h.toString().padStart(2, '0');
  return `${padH}:${m} ${ampm}`;
}

export function time12ToMinutesFromMidnight(time12: string): number {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 22 * 60 + 30; // 10:30 PM default
  let [_, hStr, mStr, ampm] = match;
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);
  if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
  if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

export function time24ToMinutesFromMidnight(time24: string): number {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10) || 22;
  let m = parseInt(mStr, 10) || 30;
  return h * 60 + m;
}
