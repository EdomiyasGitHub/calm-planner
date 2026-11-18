import { describe, expect, it } from "vitest";
import { AREAS, areasForRoles, defaultRecurringKind, DEFAULT_SETTINGS, ENGINE } from "../src";

describe("Areas seed", () => {
  it("has six Areas with four subcategories each", () => {
    expect(AREAS).toHaveLength(6);
    for (const area of AREAS) expect(area.subcategories).toHaveLength(4);
  });

  it("uses unique keys", () => {
    const areaKeys = AREAS.map((a) => a.key);
    expect(new Set(areaKeys).size).toBe(areaKeys.length);
    for (const area of AREAS) {
      const subKeys = area.subcategories.map((s) => s.key);
      expect(new Set(subKeys).size).toBe(subKeys.length);
    }
  });

  it("hides Work for students only and Study for working only", () => {
    const student = areasForRoles(["student"]).map((a) => a.key);
    const working = areasForRoles(["working"]).map((a) => a.key);
    const both = areasForRoles(["student", "working"]).map((a) => a.key);
    expect(student).not.toContain("work");
    expect(working).not.toContain("study");
    expect(both).toHaveLength(6);
  });

  it("resolves recurring kind with subcategory override", () => {
    expect(defaultRecurringKind("health", "exercise")).toBe("habit");
    expect(defaultRecurringKind("health", "medical")).toBe("obligation");
    expect(defaultRecurringKind("life-admin")).toBe("obligation");
    expect(defaultRecurringKind("unknown")).toBeUndefined();
  });
});

describe("Default settings", () => {
  it("matches the agreed defaults", () => {
    expect(DEFAULT_SETTINGS.dailyCapacityMin).toBe(480);
    expect(DEFAULT_SETTINGS.automationLevel).toBe(2);
    expect(DEFAULT_SETTINGS.planReminderAt).toBe(8 * 60);
    expect(ENGINE.horizonDays).toBe(14);
    expect(ENGINE.slotMin).toBe(15);
  });

  it("keeps time-of-day windows inside the day window", () => {
    const { dayWindow, timeOfDay } = DEFAULT_SETTINGS;
    for (const w of Object.values(timeOfDay)) {
      expect(w.start).toBeGreaterThanOrEqual(dayWindow.start);
      expect(w.end).toBeLessThanOrEqual(dayWindow.end);
      expect(w.start).toBeLessThan(w.end);
    }
  });
});
