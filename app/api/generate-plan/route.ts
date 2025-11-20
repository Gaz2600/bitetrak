import { NextRequest, NextResponse } from "next/server";
import { mealTemplates, MealTemplate, DietStyle, MealType } from "@/data/meals";

type GeneratePlanRequest = {
  calories?: number;
  mealsPerDay: number;
  diet?: string;
  ibsSafe?: boolean;
  glutenFree?: boolean;
  immuneSafe?: boolean;
};

type Meal = {
  label: string; // "Breakfast" | "Lunch" | "Dinner" | "Meal 1" | ...
  name: string;
  kcal: number;
  tag: string;
};

type DayPlan = {
  day: string; // "Monday"..."Sunday"
  totalCalories: number;
  meals: Meal[];
};

type ApiResponse = {
  calories: number;
  diet: string;
  flags: string[];
  mealsPerDay: number;
  week: DayPlan[];
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const LABELS_3 = ["Breakfast", "Lunch", "Dinner"];
const LABELS_5 = ["Meal 1", "Meal 2", "Meal 3", "Meal 4", "Meal 5"];

// Map UI labels (Breakfast, Lunch, Dinner, Meal 1, etc.) to MealType in the DB
function labelToMealType(label: string, mealsPerDay: number): MealType {
  if (mealsPerDay === 3) {
    if (label === "Breakfast") return "breakfast";
    if (label === "Lunch") return "lunch";
    return "dinner";
  }

  // For 5 meals, treat them all as small balanced meals/snacks.
  return "small-meal";
}

function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx] ?? null;
}

function filterMeals(
  mealType: MealType,
  diet: DietStyle,
  ibsSafe: boolean,
  glutenFree: boolean,
  immuneSafe: boolean
): MealTemplate[] {
  // Start with just meals of the requested type
  let candidates = mealTemplates.filter((m) => m.mealType === mealType);

  // Filter by diet style (allow "balanced" meals for all diets as a fallback)
  candidates = candidates.filter((m) => {
    if (m.dietStyles.includes(diet)) return true;
    // Always allow balanced as a fallback
    if (diet !== "balanced" && m.dietStyles.includes("balanced")) return true;
    return false;
  });

  if (ibsSafe) {
    candidates = candidates.filter((m) => m.ibsSafe);
  }
  if (glutenFree) {
    candidates = candidates.filter((m) => m.glutenFree);
  }
  if (immuneSafe) {
    candidates = candidates.filter((m) => m.immuneSafe);
  }

  // If filters are too strict and we end up empty, relax gradually.
  if (!candidates.length) {
    // 1. Drop diet filter
    candidates = mealTemplates.filter((m) => m.mealType === mealType);
    if (ibsSafe) {
      candidates = candidates.filter((m) => m.ibsSafe);
    }
    if (glutenFree) {
      candidates = candidates.filter((m) => m.glutenFree);
    }
    if (immuneSafe) {
      candidates = candidates.filter((m) => m.immuneSafe);
    }
  }

  // 2. If still empty, just take ANY meals of that type
  if (!candidates.length) {
    candidates = mealTemplates.filter((m) => m.mealType === mealType);
  }

  // 3. Last resort: any meal at all
  if (!candidates.length) {
    candidates = mealTemplates.slice();
  }

  return candidates;
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

  const {
    calories: rawCalories,
    diet: rawDiet,
    ibsSafe = false,
    glutenFree = false,
    immuneSafe = false,
    mealsPerDay: rawMealsPerDay,
  } = body;

  const calories =
    typeof rawCalories === "number" && rawCalories > 0 ? rawCalories : 2100;

  const dietString =
    typeof rawDiet === "string" && rawDiet.length > 0
      ? (rawDiet as DietStyle)
      : ("balanced" as DietStyle);

  const mealsPerDay =
    typeof rawMealsPerDay === "number" &&
    (rawMealsPerDay === 3 || rawMealsPerDay === 5)
      ? rawMealsPerDay
      : 3;

  const flags: string[] = [];
  if (ibsSafe) flags.push("IBS-safe / low-FODMAP aware");
  if (glutenFree) flags.push("Gluten-free");
  if (immuneSafe) flags.push("Immune-conscious");

  const labels = mealsPerDay === 5 ? LABELS_5 : LABELS_3;

  const week: DayPlan[] = DAYS.map((day) => {
    const meals: Meal[] = [];

    labels.forEach((label) => {
      const mealType = labelToMealType(label, mealsPerDay);

      const candidates = filterMeals(
        mealType,
        dietString,
        ibsSafe,
        glutenFree,
        immuneSafe
      );

      const chosen = pickRandom(candidates);
      if (!chosen) {
        return;
      }

      // For now, use baseCalories +/- small random jitter (±40 kcal)
      const jitter = Math.round((Math.random() - 0.5) * 80);
      const kcal = Math.max(80, chosen.baseCalories + jitter);

      const tagPieces: string[] = [];
      tagPieces.push(dietString);
      if (ibsSafe) tagPieces.push("IBS-safe");
      if (glutenFree) tagPieces.push("GF");
      if (immuneSafe) tagPieces.push("immune-safe");

      meals.push({
        label,
        name: chosen.name,
        kcal,
        tag: tagPieces.join(", "),
      });
    });

    const totalCalories = meals.reduce((sum, m) => sum + m.kcal, 0);

    return {
      day,
      totalCalories,
      meals,
    };
  });

  const response: ApiResponse = {
    calories,
    diet: dietString,
    flags,
    mealsPerDay,
    week,
  };

  return NextResponse.json(response, { status: 200 });
}