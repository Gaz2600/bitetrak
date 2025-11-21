// types/meals.ts

import type { DietStyle } from "./dietStyles";

export type MealType = "breakfast" | "lunch" | "dinner" | "small-meal";

export type MealTemplateFlags = {
  ibsSafe: boolean;
  glutenFree: boolean;
  immuneSafe: boolean;
};

export type MealTemplate = {
  id: string;            // slug or UUID
  name: string;          // Display name
  mealType: MealType;    // breakfast | lunch | dinner | small-meal
  baseCalories: number;  // Approx kcal per serving
  dietStyles: DietStyle[];
  flags: MealTemplateFlags;
  description?: string;  // Optional for UI
};
