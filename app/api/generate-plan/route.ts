import { NextResponse } from "next/server";

type GenerateBody = {
  calories?: number;
  diet?: string;
  ibsSafe?: boolean;
  glutenFree?: boolean;
  immuneSafe?: boolean;
  mealsPerDay?: number; // NEW
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export async function POST(req: Request) {
  const body = (await req.json()) as GenerateBody;

  const calories = body.calories && body.calories > 0 ? body.calories : 2100;
  const diet = body.diet || "balanced";
  const ibsSafe = body.ibsSafe ?? true;
  const glutenFree = body.glutenFree ?? false;
  const immuneSafe = body.immuneSafe ?? false;
  const mealsPerDay = body.mealsPerDay === 5 ? 5 : 3; // 3 by default

  const flags: string[] = [];
  if (ibsSafe) flags.push("IBS-safe");
  if (glutenFree) flags.push("gluten-free");
  if (immuneSafe) flags.push("immune-conscious");

  const perMeal = Math.max(150, Math.round(calories / mealsPerDay));

  function baseTag() {
    if (diet === "high-protein") return "High-protein";
    if (diet === "keto") return "Low-carb";
    if (diet === "mediterranean") return "Mediterranean";
    if (diet === "low-fodmap") return "Low-FODMAP";
    return "Balanced";
  }

  const safetyTag = flags.length ? flags.join(" • ") : "General";

  // Build meals for a single day based on mealsPerDay
  function buildMealsForDay(): {
    label: string;
    name: string;
    kcal: number;
    tag: string;
  }[] {
    if (mealsPerDay === 5) {
      return [
        {
          label: "Meal 1",
          name:
            diet === "keto"
              ? "Eggs & greens mini-plate"
              : "Light breakfast (oats / toast alt.)",
          kcal: perMeal - 80,
          tag: `${baseTag()} • ${safetyTag}`,
        },
        {
          label: "Meal 2",
          name: "Mid-morning protein + fruit/veg",
          kcal: perMeal - 40,
          tag: `${baseTag()} • ${safetyTag}`,
        },
        {
          label: "Meal 3",
          name:
            diet === "mediterranean"
              ? "Small grain & veg bowl"
              : "Small protein + grain + veg",
          kcal: perMeal,
          tag: `${baseTag()} • ${safetyTag}`,
        },
        {
          label: "Meal 4",
          name: "Afternoon snack (nuts, yogurt alt., fruit)",
          kcal: perMeal - 40,
          tag: `${baseTag()} • ${safetyTag}`,
        },
        {
          label: "Meal 5",
          name:
            ibsSafe || immuneSafe
              ? "Gentle cooked protein + safe sides"
              : "Light dinner template",
          kcal: perMeal + 40,
          tag: `${baseTag()} • ${safetyTag}`,
        },
      ];
    }

    // Default: 3 meals (what you had before)
    return [
      {
        label: "Breakfast",
        name:
          diet === "keto"
            ? "Eggs & greens plate"
            : "Overnight oats / simple porridge",
        kcal: perMeal - 120,
        tag: `${baseTag()} • ${safetyTag}`,
      },
      {
        label: "Lunch",
        name:
          diet === "mediterranean"
            ? "Grain bowl with veggies & olive oil"
            : "Protein + grain + cooked veg bowl",
        kcal: perMeal,
        tag: `${baseTag()} • ${safetyTag}`,
      },
      {
        label: "Dinner",
        name:
          ibsSafe || immuneSafe
            ? "Cooked protein with low-FODMAP sides"
            : "Flexible dinner template",
        kcal: perMeal + 80,
        tag: `${baseTag()} • ${safetyTag}`,
      },
    ];
  }

  const week = DAYS.map((day) => {
    const meals = buildMealsForDay();
    const total = meals.reduce((sum, m) => sum + m.kcal, 0);

    return {
      day,
      totalCalories: total,
      meals,
    };
  });

  return NextResponse.json({
    calories,
    diet,
    flags,
    mealsPerDay,
    week,
  });
}
