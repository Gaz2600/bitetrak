// app/api/generate-plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  MEALS,
  MealTemplate,
} from "@/data/meals";

console.log("BiteTrak: MEALS loaded =", MEALS.length);

// Diet styles used by the planner (not exported by @/data/meals)
type DietStyle =
  | "balanced"
  | "keto"
  | "high-protein"
  | "low-fodmap"
  | "mediterranean";

// Simple ingredient shape for recipes/shopping list
type Ingredient = {
  name: string;
  unit?: string;
  quantity?: number;
};

type MealType = "breakfast" | "lunch" | "dinner" | "small-meal";

type AllergyKey = "dairy" | "eggs" | "nuts" | "shellfish" | "soy";

type MacroMode = "calculator" | "custom";

type MacrosPayload = {
  proteinPct?: number;
  carbPct?: number;
  fatPct?: number;
};

type GeneratePlanRequest = {
  calories?: number;
  diet?: DietStyle | string;
  ibsSafe?: boolean;
  glutenFree?: boolean;
  immuneSafe?: boolean;
  mealsPerDay?: number;
  allergies?: AllergyKey[] | string[];
  lowHistamine?: boolean;
  lowOxalate?: boolean;
  gerdFriendly?: boolean;
  // NEW: macro settings from the dashboard
  macroMode?: MacroMode;
  macros?: MacrosPayload | null;
};

type MealRecipe = {
  ingredients: Ingredient[];
  steps: string[];
};

type Meal = {
  label: string;
  name: string;
  kcal: number;
  tag: string;
  recipe: MealRecipe;
};

type DayPlan = {
  day: string;
  totalCalories: number;
  meals: Meal[];
};

type ShoppingItem = {
  name: string;
  unit?: string;
  quantity: number;
};

type ApiResponse = {
  calories: number;
  diet: string;
  flags: string[];
  mealsPerDay: number;
  week: DayPlan[];
  shoppingList: ShoppingItem[];
};

// Normalize diet input into a known DietStyle
function normalizeDiet(diet: string | undefined): DietStyle {
  const d = (diet || "balanced").toLowerCase();
  if (
    d === "keto" ||
    d === "high-protein" ||
    d === "low-fodmap" ||
    d === "mediterranean"
  ) {
    return d;
  }
  return "balanced";
}

// Normalize allergies into a known set of keys
function normalizeAllergies(raw: unknown): AllergyKey[] {
  if (!Array.isArray(raw)) return [];
  const allowed: AllergyKey[] = ["dairy", "eggs", "nuts", "shellfish", "soy"];
  const out: AllergyKey[] = [];

  for (const item of raw) {
    const s = String(item).toLowerCase() as AllergyKey;
    if (allowed.includes(s) && !out.includes(s)) {
      out.push(s);
    }
  }
  return out;
}

// Build a human-readable tag string for the UI
function buildTag(template: MealTemplate): string {
  const tags: string[] = [];

  if (template.flags.ibsSafe) tags.push("IBS-safe");
  if (template.flags.glutenFree) tags.push("GF");
  if (template.flags.immuneSafe) tags.push("Immune-safe");

  if (template.dietStyles.includes("keto")) tags.push("Keto");
  if (template.dietStyles.includes("high-protein")) tags.push("High-protein");
  if (template.dietStyles.includes("mediterranean"))
    tags.push("Mediterranean");

  return tags.join(" · ") || "General";
}

// Label meals by index (Breakfast, Lunch, etc.)
function labelForIndex(index: number, mealsPerDay: number): string {
  if (mealsPerDay === 3) {
    return ["Breakfast", "Lunch", "Dinner"][index] ?? `Meal ${index + 1}`;
  }

  // 5-meal pattern: B, L, Snack, D, Snack
  const labels = ["Breakfast", "Lunch", "Snack", "Dinner", "Snack"];
  return labels[index] ?? `Meal ${index + 1}`;
}

// Decide which mealType to use for a given slot
function mealTypeForIndex(index: number, mealsPerDay: number): MealType {
  if (mealsPerDay === 3) {
    return (["breakfast", "lunch", "dinner"] as MealType[])[index] ?? "dinner";
  }

  // 5-meal pattern: breakfast, lunch, snack, dinner, snack
  const pattern: MealType[] = [
    "breakfast",
    "lunch",
    "small-meal",
    "dinner",
    "small-meal",
  ];
  return pattern[index] ?? "small-meal";
}

// Allergy matching: keyword-based scan on ingredients + name
const ALLERGEN_KEYWORDS: Record<AllergyKey, string[]> = {
  dairy: [
    "milk",
    "cheese",
    "yogurt",
    "cream",
    "butter",
    "ghee",
    "parmesan",
    "mozzarella",
    "feta",
    "sour cream",
  ],
  eggs: ["egg", "eggs", "scrambled egg", "omelet", "omelette"],
  nuts: [
    "almond",
    "almonds",
    "walnut",
    "walnuts",
    "cashew",
    "cashews",
    "pecan",
    "pecans",
    "hazelnut",
    "hazelnuts",
    "pistachio",
    "pistachios",
    "peanut",
    "peanuts",
    "peanut butter",
  ],
  shellfish: ["shrimp", "prawn", "prawns", "crab", "lobster", "scallop"],
  soy: ["tofu", "tempeh", "soy", "edamame", "soy sauce"],
};

function buildTextHaystack(meal: MealTemplate): string {
  const parts: string[] = [];
  parts.push(meal.name.toLowerCase());

const recipe = (meal as any).recipe;

if (recipe?.ingredients) {
  for (const ing of recipe.ingredients) {
    if (ing.name) parts.push(ing.name.toLowerCase());
  }
}

  return parts.join(" ");
}

function isMealSafeForAllergies(
  meal: MealTemplate,
  allergies: AllergyKey[]
): boolean {
  if (!allergies.length) return true;

  const haystack = buildTextHaystack(meal);

  for (const allergy of allergies) {
    const keywords = ALLERGEN_KEYWORDS[allergy];
    for (const kw of keywords) {
      if (haystack.includes(kw)) {
        return false;
      }
    }
  }

  return true;
}

// Extra gut/medical constraint keyword sets
const LOW_HISTAMINE_UNSAFE = [
  "aged cheese",
  "cheddar",
  "parmesan",
  "blue cheese",
  "salami",
  "pepperoni",
  "prosciutto",
  "cured ham",
  "bacon",
  "smoked",
  "fermented",
  "sauerkraut",
  "kimchi",
  "kombucha",
  "vinegar",
  "red wine",
  "wine",
  "canned tuna",
  "canned fish",
  "mackerel",
  "spinach",
  "tomato",
  "tomatoes",
  "eggplant",
  "avocado",
];

const LOW_OXALATE_UNSAFE = [
  "spinach",
  "almond",
  "almonds",
  "almond flour",
  "beet",
  "beets",
  "rhubarb",
  "sweet potato",
  "sweet potatoes",
  "swiss chard",
  "peanut",
  "peanuts",
  "cashew",
  "cashews",
  "cocoa",
  "chocolate",
];

const GERD_UNSAFE = [
  "tomato",
  "tomatoes",
  "marinara",
  "pasta sauce",
  "citrus",
  "lemon",
  "lime",
  "orange",
  "grapefruit",
  "chili",
  "chilli",
  "hot sauce",
  "spicy",
  "fried",
  "deep fried",
  "coffee",
  "espresso",
  "caffeinated",
  "chocolate",
  "peppermint",
  "mint",
];

function containsKeyword(haystack: string, list: string[]): boolean {
  for (const kw of list) {
    if (haystack.includes(kw)) return true;
  }
  return false;
}

function isMealSafeForExtraConstraints(
  meal: MealTemplate,
  opts: {
    lowHistamine: boolean;
    lowOxalate: boolean;
    gerdFriendly: boolean;
  }
): boolean {
  const { lowHistamine, lowOxalate, gerdFriendly } = opts;
  if (!lowHistamine && !lowOxalate && !gerdFriendly) return true;

  const haystack = buildTextHaystack(meal);

  if (lowHistamine && containsKeyword(haystack, LOW_HISTAMINE_UNSAFE)) {
    return false;
  }
  if (lowOxalate && containsKeyword(haystack, LOW_OXALATE_UNSAFE)) {
    return false;
  }
  if (gerdFriendly && containsKeyword(haystack, GERD_UNSAFE)) {
    return false;
  }

  return true;
}

// Build candidate pools for a given mealType in relaxing order
function buildCandidatePools(
  mealType: MealType,
  diet: DietStyle,
  requireIbsSafe: boolean,
  requireGlutenFree: boolean,
  requireImmuneSafe: boolean,
  allergies: AllergyKey[],
  extra: {
    lowHistamine: boolean;
    lowOxalate: boolean;
    gerdFriendly: boolean;
  }
): MealTemplate[][] {
  const byType = MEALS.filter(
    (m) =>
      m.mealType === mealType &&
      isMealSafeForAllergies(m, allergies) &&
      isMealSafeForExtraConstraints(m, extra)
  );

  const matchesFlags = (m: MealTemplate) =>
    (!requireIbsSafe || m.flags.ibsSafe) &&
    (!requireGlutenFree || m.flags.glutenFree) &&
    (!requireImmuneSafe || m.flags.immuneSafe);

  const matchesDiet = (m: MealTemplate) =>
    diet === "balanced" ? true : m.dietStyles.includes(diet);

  // 1) diet + flags
  const strict = byType.filter((m) => matchesDiet(m) && matchesFlags(m));
  // 2) relax diet, keep flags
  const relaxedDiet = byType.filter((m) => matchesFlags(m));
  // 3) relax flags too (any meal of this type, still allergy/constraint safe)
  const relaxedAll = byType;

  const pools: MealTemplate[][] = [];
  if (strict.length) pools.push(strict);
  if (relaxedDiet.length) pools.push(relaxedDiet);
  if (relaxedAll.length) pools.push(relaxedAll);
  return pools;
}

// Choose a meal near the targetCalories, but randomize among the top candidates
function chooseClosestToCalories(
  candidates: MealTemplate[],
  targetCalories: number,
  usedCounts: Map<string, number>
): MealTemplate {
  // If candidates exist, pick among top calorie-closest few
  if (candidates.length > 0) {
    const scored = candidates.map((m) => {
      const diff = Math.abs(m.baseCalories - targetCalories);
      const usage = usedCounts.get(m.id) ?? 0;
      return { m, diff, usage };
    });

    scored.sort((a, b) => {
      if (a.diff !== b.diff) return a.diff - b.diff;
      return a.usage - b.usage;
    });

    const top = scored.slice(0, Math.min(10, scored.length));
    const randomIndex = Math.floor(Math.random() * top.length);
    return top[randomIndex].m;
  }

  // If NO candidates match (very rare), choose literally anything
  return MEALS[Math.floor(Math.random() * MEALS.length)];
}

// Pick one meal for a slot, obeying repetition + calorie targeting if possible
function pickMealForSlot(options: {
  mealType: MealType;
  diet: DietStyle;
  requireIbsSafe: boolean;
  requireGlutenFree: boolean;
  requireImmuneSafe: boolean;
  targetCalories: number;
  usedCounts: Map<string, number>;
  usedToday: Set<string>;
  maxPerWeek: number;
  allergies: AllergyKey[];
  extra: {
    lowHistamine: boolean;
    lowOxalate: boolean;
    gerdFriendly: boolean;
  };
}): MealTemplate {
  const {
    mealType,
    diet,
    requireIbsSafe,
    requireGlutenFree,
    requireImmuneSafe,
    targetCalories,
    usedCounts,
    usedToday,
    maxPerWeek,
    allergies,
    extra,
  } = options;

  const pools = buildCandidatePools(
    mealType,
    diet,
    requireIbsSafe,
    requireGlutenFree,
    requireImmuneSafe,
    allergies,
    extra
  );

  // Try pools respecting weekly + same-day repetition limits
  for (const pool of pools) {
    const filtered = pool.filter((m) => {
      const used = usedCounts.get(m.id) ?? 0;
      return used < maxPerWeek && !usedToday.has(m.id);
    });

    if (filtered.length) {
      return chooseClosestToCalories(filtered, targetCalories, usedCounts);
    }
  }

  // Relax weekly repetition, still avoid same-day duplicates
  for (const pool of pools) {
    const filtered = pool.filter((m) => !usedToday.has(m.id));
    if (filtered.length) {
      return chooseClosestToCalories(filtered, targetCalories, usedCounts);
    }
  }

  // Extreme fallback: ANY meal of this type that is allergy/constraint-safe
  const anyTypeSafe = MEALS.filter(
    (m) =>
      m.mealType === mealType &&
      isMealSafeForAllergies(m, allergies) &&
      isMealSafeForExtraConstraints(m, extra)
  );
  if (anyTypeSafe.length > 0) {
    return anyTypeSafe[Math.floor(Math.random() * anyTypeSafe.length)];
  }

  // Last resort: ANY meal that is allergy/constraint-safe
  const anySafe = MEALS.filter(
    (m) =>
      isMealSafeForAllergies(m, allergies) &&
      isMealSafeForExtraConstraints(m, extra)
  );
  if (anySafe.length > 0) {
    return anySafe[Math.floor(Math.random() * anySafe.length)];
  }

  // Truly nothing safe in the DB
  throw new Error(
    "No meals available for the selected allergies and medical constraints. Please loosen constraints or update the meal database."
  );
}

// Aggregate ingredients into a shopping list
function buildShoppingList(week: DayPlan[]): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();

  for (const day of week) {
    for (const meal of day.meals) {
      for (const ing of meal.recipe.ingredients || []) {
        if (!ing.name) continue;
        const key = `${ing.name.toLowerCase()}|${ing.unit || ""}`;
        const existing = map.get(key);
        const quantity = ing.quantity ?? 0;

        if (existing) {
          existing.quantity += quantity;
        } else {
          map.set(key, {
            name: ing.name,
            unit: ing.unit,
            quantity,
          });
        }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export async function POST(req: NextRequest) {
  let body: GeneratePlanRequest;

  try {
    body = (await req.json()) as GeneratePlanRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    // Normalize inputs with sane defaults
    const calories =
      typeof body.calories === "number" && body.calories > 0
        ? Math.round(body.calories)
        : 2100;

    const diet = normalizeDiet(body.diet as string | undefined);

    const mealsPerDay =
      typeof body.mealsPerDay === "number" &&
      (body.mealsPerDay === 3 || body.mealsPerDay === 5)
        ? body.mealsPerDay
        : 3;

    const requireIbsSafe = Boolean(body.ibsSafe);
    const requireGlutenFree = Boolean(body.glutenFree);
    const requireImmuneSafe = Boolean(body.immuneSafe);

    const allergies = normalizeAllergies(body.allergies);

    const lowHistamine = Boolean(body.lowHistamine);
    const lowOxalate = Boolean(body.lowOxalate);
    const gerdFriendly = Boolean(body.gerdFriendly);

    // These are accepted from the client; for now, they are not used
    // but having them typed means the endpoint "supports" them.
    const macroMode = body.macroMode ?? "calculator";
    const macros = body.macros ?? null;
    // If you want to sanity-check later:
    // console.log("Macro settings:", { macroMode, macros });

    const flags: string[] = [];
    if (requireIbsSafe) flags.push("IBS / low-FODMAP focus");
    if (requireGlutenFree) flags.push("Gluten-free only");
    if (requireImmuneSafe) flags.push("Immune-conscious");
    if (lowHistamine) flags.push("Low-histamine");
    if (lowOxalate) flags.push("Low-oxalate");
    if (gerdFriendly) flags.push("GERD / reflux-friendly");
    if (allergies.length) {
      flags.push(
        `Allergies: ${allergies
          .map((a) => a.charAt(0).toUpperCase() + a.slice(1))
          .join(", ")}`
      );
    }

    const targetPerMeal = calories / mealsPerDay;
    const maxPerWeek = 2; // don’t repeat the same meal more than 2x/week

    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const usedCounts = new Map<string, number>();
    const week: DayPlan[] = [];

    const extraConstraints = {
      lowHistamine,
      lowOxalate,
      gerdFriendly,
    };

    for (const dayName of daysOfWeek) {
      const usedToday = new Set<string>();
      const mealsForDay: Meal[] = [];
      let remaining = calories;

      for (let slot = 0; slot < mealsPerDay; slot++) {
        const remainingSlots = mealsPerDay - slot;
        const slotTarget =
          remainingSlots > 0 ? remaining / remainingSlots : targetPerMeal;

        const mealType = mealTypeForIndex(slot, mealsPerDay);
        const chosenTemplate = pickMealForSlot({
          mealType,
          diet,
          requireIbsSafe,
          requireGlutenFree,
          requireImmuneSafe,
          targetCalories: slotTarget,
          usedCounts,
          usedToday,
          maxPerWeek,
          allergies,
          extra: extraConstraints,
        });

        usedToday.add(chosenTemplate.id);
        usedCounts.set(
          chosenTemplate.id,
          (usedCounts.get(chosenTemplate.id) ?? 0) + 1
        );

        remaining -= chosenTemplate.baseCalories;

		const chosenRecipe = (chosenTemplate as any).recipe;

		mealsForDay.push({
		  label: labelForIndex(slot, mealsPerDay),
		  name: chosenTemplate.name,
		  kcal: chosenTemplate.baseCalories,
		  tag: buildTag(chosenTemplate),
		  recipe: {
			ingredients: chosenRecipe?.ingredients ?? [],
			steps: chosenRecipe?.steps ?? [],
		  },
		});
      }

      const totalCalories = mealsForDay.reduce((sum, m) => sum + m.kcal, 0);

      week.push({
        day: dayName,
        totalCalories,
        meals: mealsForDay,
      });
    }

    const shoppingList = buildShoppingList(week);

    const response: ApiResponse = {
      calories,
      diet,
      flags,
      mealsPerDay,
      week,
      shoppingList,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Error generating plan:", err);
    const message =
      typeof err?.message === "string"
        ? err.message
        : "Unable to generate a plan with the selected constraints.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
