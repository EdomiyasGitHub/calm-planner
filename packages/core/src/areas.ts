/**
 * Built-in Areas (life roles) and their subcategories.
 * Seeded for every new user; users can rename, hide, reorder and extend them.
 * See handbook section 2.
 */

export type RecurringKind = "habit" | "obligation";

export interface SubcategorySeed {
  readonly key: string;
  readonly name: string;
  /** Overrides the Area's default recurring type, if set. */
  readonly recurringKind?: RecurringKind;
}

export interface AreaSeed {
  readonly key: string;
  readonly name: string;
  readonly icon: string;
  /** Default type for recurring tasks in this Area. */
  readonly recurringKind: RecurringKind;
  /** Which onboarding roles show this Area by default. */
  readonly roles: readonly Role[];
  readonly subcategories: readonly SubcategorySeed[];
}

export type Role = "student" | "working";

export const AREAS: readonly AreaSeed[] = [
  {
    key: "study",
    name: "Study",
    icon: "graduation-cap",
    recurringKind: "obligation",
    roles: ["student"],
    subcategories: [
      { key: "classes", name: "Classes" },
      { key: "assignments-exams", name: "Assignments & Exams" },
      { key: "self-learning", name: "Self-learning" },
      { key: "research", name: "Research" },
    ],
  },
  {
    key: "work",
    name: "Work",
    icon: "briefcase",
    recurringKind: "obligation",
    roles: ["working"],
    subcategories: [
      { key: "meetings", name: "Meetings" },
      { key: "focused-work", name: "Focused work" },
      { key: "admin-email", name: "Admin & Email" },
      { key: "career-growth", name: "Career growth" },
    ],
  },
  {
    key: "health",
    name: "Health",
    icon: "heart-pulse",
    recurringKind: "habit",
    roles: ["student", "working"],
    subcategories: [
      { key: "exercise", name: "Exercise" },
      { key: "mental-wellbeing", name: "Mental wellbeing" },
      { key: "sleep-rest", name: "Sleep & Rest" },
      { key: "medical", name: "Medical", recurringKind: "obligation" },
    ],
  },
  {
    key: "relationships",
    name: "Relationships",
    icon: "users",
    recurringKind: "habit",
    roles: ["student", "working"],
    subcategories: [
      { key: "family", name: "Family" },
      { key: "friends", name: "Friends" },
      { key: "partner", name: "Partner" },
      { key: "community", name: "Community" },
    ],
  },
  {
    key: "life-admin",
    name: "Life Admin",
    icon: "clipboard-list",
    recurringKind: "obligation",
    roles: ["student", "working"],
    subcategories: [
      { key: "chores", name: "Chores" },
      { key: "errands", name: "Errands" },
      { key: "finances", name: "Finances" },
      { key: "paperwork", name: "Paperwork" },
    ],
  },
  {
    key: "growth-play",
    name: "Growth & Play",
    icon: "sparkles",
    recurringKind: "habit",
    roles: ["student", "working"],
    subcategories: [
      { key: "reading", name: "Reading" },
      { key: "hobbies", name: "Hobbies" },
      { key: "creative", name: "Creative" },
      { key: "side-projects", name: "Side projects" },
    ],
  },
];

/** Areas visible by default for the roles chosen in onboarding. */
export function areasForRoles(roles: readonly Role[]): AreaSeed[] {
  return AREAS.filter((area) => area.roles.some((r) => roles.includes(r)));
}

/** Default recurring type for a subcategory, falling back to its Area's default. */
export function defaultRecurringKind(areaKey: string, subcategoryKey?: string): RecurringKind | undefined {
  const area = AREAS.find((a) => a.key === areaKey);
  if (!area) return undefined;
  const sub = subcategoryKey ? area.subcategories.find((s) => s.key === subcategoryKey) : undefined;
  return sub?.recurringKind ?? area.recurringKind;
}
