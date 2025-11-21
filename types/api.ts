// types/api.ts

import type { DietStyle } from "./dietStyles";

/**
 * Shape of each meal block returned to the UI
 */
export type ApiMeal = {
  label: string; // "Breakfast", "Lunch", etc.
  name: string;
  kcal: number;
  tag: string; // UI-friendly diet/safety label
};

/**
 * Shape of each day's plan
 */
export type ApiDayPlan = {
  day: string;             // "Monday"
  totalCalories: number;   // sum of day's kcal
  meals: ApiMeal[];
};

/**
 * API response returned from POST /api/generate-plan
 */
export type GeneratePlanResponse = {
  calories: number;
  diet: DietStyle | "balanced";
  flags: string[];        // ["IBS-safe", "Gluten-free", ...]
  mealsPerDay: number;    // 3 or 5
  week: ApiDayPlan[];
};

/**
 * Expected request body *sent from DashboardClient*
 */
export type GeneratePlanRequest = {
  calories?: number;
  diet?: DietStyle | "balanced" | string;
  ibsSafe?: boolean;
  glutenFree?: boolean;
  immuneSafe?: boolean;
  mealsPerDay?: 3 | 5;
};
