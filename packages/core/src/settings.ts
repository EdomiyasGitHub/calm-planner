/**
 * Default user settings. See handbook section 2, "Default settings".
 * Times are minutes after local midnight.
 */

export type AutomationLevel = 1 | 2 | 3;

export interface TimeWindow {
  readonly start: number;
  readonly end: number;
}

export interface UserSettings {
  readonly dayWindow: TimeWindow;
  readonly timeOfDay: {
    readonly morning: TimeWindow;
    readonly afternoon: TimeWindow;
    readonly evening: TimeWindow;
  };
  /** Maximum minutes of flexible work the engine plans per day. */
  readonly dailyCapacityMin: number;
  readonly bufferMin: number;
  readonly breakAfterMin: number;
  readonly minChunkMin: number;
  readonly automationLevel: AutomationLevel;
  /** Daily plan reminder time, or null when turned off. */
  readonly planReminderAt: number | null;
  readonly quietHours: TimeWindow;
  readonly maxNudgesPerDay: number;
}

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

export const DEFAULT_SETTINGS: UserSettings = {
  dayWindow: { start: h(7), end: h(22) },
  timeOfDay: {
    morning: { start: h(7), end: h(12) },
    afternoon: { start: h(12), end: h(17) },
    evening: { start: h(17), end: h(22) },
  },
  dailyCapacityMin: h(8),
  bufferMin: 10,
  breakAfterMin: 90,
  minChunkMin: 30,
  automationLevel: 2,
  planReminderAt: h(8),
  quietHours: { start: h(22), end: h(7) },
  maxNudgesPerDay: 5,
};

/** Fixed engine constants (not user-editable). */
export const ENGINE = {
  horizonDays: 14,
  slotMin: 15,
  fallbackDurationMin: 30,
} as const;
