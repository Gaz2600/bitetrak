// app/api/generate-plan/route.ts

import { NextRequest, NextResponse } from "next/server";
import { meals } from "@/data/meals";
import type { MealTemplate } from "@/types/meals";
import type { DietStyle } from "@/types/dietStyles";
import type {
  GeneratePlanRequest,
  GeneratePlanResponse,
  ApiDayPlan,
  ApiMeal,
} from "@/types/api";

// ——— Helpers ———

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function normaliseDiet(diet: string | undefined): DietStyle | "balanced" {
  if (!diet) return "balanced";
  // Let TS trust it's a DietStyle, but fall back at runtime if unknown
  const known = new Set(
    meals.flatMap((m) => m.dietStyles)
  ) as Set<string>;
  if (known.has(diet)) return diet as DietStyle;
  return "balanced";
}

function buildFlagStrings(opts: {
  ibsSafe: boolean;
  glutenFree: boolean;
  immuneSafe: boolean;
}): string[] {
  const out: string[] = [];
  if (opts.ibsSafe) out.push("IBS-safe");
  if (opts.glutenFree) out.push("Gluten-free");
  if (opts.immuneSafe) out.push("Immune-conscious");
  return out;
}

function matchesFlags(
  meal: MealTemplate,
  flags: { ibsSafe: boolean; glutenFree: boolean; immuneSafe: boolean }
): boolean {
  if (flags.ibsSafe && !meal.flags.ibsSafe) return false;
  if (flags.glutenFree && !meal.flags.glutenFree) return false;
  if (flags.immuneSafe && !meal.flags.immuneSafe) return false;
  return true;
}

function buildTagString(
  meal: MealTemplate,
  flags: { ibsSafe: boolean; glutenFree: boolean; immuneSafe: boolean }
): string {
  const bits: string[] = [];

  // Highlight a primary diet label, if present
  const primaryOrder: DietStyle[] = [
    "balanced",
    "high-protein",
    "keto",
    "mediterranean",
    "low-fodmap",
    "vegan",
    "vegetarian",
    "plant-based",
  ];
  const primary = primaryOrder.find((t) => meal.dietStyles.includes(t));
  if (primary) bits.push(primary.replace(/-/g, " "));

  // Safety tags
  if (flags.ibsSafe && meal.flags.ibsSafe) bits.push("IBS-safe");
  if (flags.glutenFree && meal.flags.glutenFree) bits.push("Gluten-free");
  if (flags.immuneSafe && meal.flags.immuneSafe) bits.push("Immune-conscious");

  // If still nothing, show the first diet tag as a fallback
  if (bits.length === 0 && meal.dietStyles.length > 0) {
    bits.push(meal.dietStyles[0].replace(/-/g, " "));
  }

  return bits.join(" • ");
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function makePoolForType(
  mealType: MealTemplate["mealType"],
  diet: DietStyle | "balanced",
  flags: { ibsSafe: boolean; glutenFree: boolean; immuneSafe: boolean }
): MealTemplate[] {
  // 1) Filter by diet + flags
  const byDietAndFlags = meals.filter(
    (m) =>
      m.mealType === mealType &&
      (diet === "balanced" || m.dietStyles.includes(diet)) &&
      matchesFlags(m, flags)
  );
  if (byDietAndFlags.length > 0) return byDietAndFlags;

  // 2) Relax: ignore diet, keep safety flags
  const byFlagsOnly = meals.filter(
    (m) => m.mealType === mealType && matchesFlags(m, flags)
  );
  if (byFlagsOnly.length > 0) return byFlagsOnly;

  // 3) Final fallback: any meal of this type
  return meals.filter((m) => m.mealType === mealType);
}

export async function POST(req: NextRequest) {
  let body: GeneratePlanRequest;
  try {
    body = (await req.json()) as GeneratePlanRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const targetCalories =
    typeof body.calories === "number" && body.calories > 0
      ? body.calories
      : 2100;

  const mealsPerDay =
    body.mealsPerDay === 5 || body.mealsPerDay === 3
      ? body.mealsPerDay
      : 3;

  const flags = {
    ibsSafe: !!body.ibsSafe,
    glutenFree: !!body.glutenFree,
    immuneSafe: !!body.immuneSafe,
  };

  const diet = normaliseDiet(body.diet as string | undefined);
  const flagStrings = buildFlagStrings(flags);

  // Prebuild pools
  const breakfastPool = makePoolForType("breakfast", diet, flags);
  const lunchPool = makePoolForType("lunch", diet, flags);
  const dinnerPool = makePoolForType("dinner", diet, flags);
  const snackPool = makePoolForType("small-meal", diet, flags);

  const week: ApiDayPlan[] = WEEK_DAYS.map((dayName) => {
    const dayMeals: ApiMeal[] = [];
    let total = 0;

    if (mealsPerDay === 3) {
      const slots: { label: string; pool: MealTemplate[] }[] = [
        { label: "Breakfast", pool: breakfastPool },
        { label: "Lunch", pool: lunchPool },
        { label: "Dinner", pool: dinnerPool },
      ];

      for (const { label, pool } of slots) {
        const mt = pickRandom(pool);
        total += mt.baseCalories;
        dayMeals.push({
          label,
          name: mt.name,
          kcal: mt.baseCalories,
          tag: buildTagString(mt, flags),
        });
      }
    } else {
      // 5 meals/day: B + snack + L + snack + D
      const slotDefs: { label: string; pool: MealTemplate[] }[] = [
        { label: "Meal 1", pool: breakfastPool },
        { label: "Meal 2", pool: snackPool },
        { label: "Meal 3", pool: lunchPool },
        { label: "Meal 4", pool: snackPool },
        { label: "Meal 5", pool: dinnerPool },
      ];

      for (const { label, pool } of slotDefs) {
        const mt = pickRandom(pool);
        total += mt.baseCalories;
        dayMeals.push({
          label,
          name: mt.name,
          kcal: mt.baseCalories,
          tag: buildTagString(mt, flags),
        });
      }
    }

    return {
      day: dayName,
      totalCalories: total,
      meals: dayMeals,
    };
  });

  const response: GeneratePlanResponse = {
    calories: targetCalories,
    diet,
    flags: flagStrings,
    mealsPerDay,
    week,
  };

  return NextResponse.json(response);
}
