// types/dietStyles.ts

// Central registry of all diet / lifestyle tags used in the app.
// Keep this as the single source of truth.
export const dietTags = [
  // ——— Diet patterns ———
  "balanced",
  "mediterranean",
  "keto",
  "modified-keto",
  "ketogenic-therapeutic",
  "low-carb",
  "high-carb",
  "paleo",
  "primal",
  "vegetarian",
  "vegan",
  "pescatarian",
  "flexitarian",
  "carnivore",
  "plant-based",
  "raw-food",
  "macrobiotic",
  "Nordic-diet",
  "MIND-diet",
  "Whole30",
  "DASH",
  "Atkins",
  "SouthBeach",
  "Zone",
  "volumetrics",

  // ——— Fasting patterns ———
  "intermittent-fasting",
  "16-8-fasting",
  "5-2-fasting",
  "OMAD",

  // ——— GI / Medical diets ———
  "low-fodmap",
  "FODMAP-friendly",
  "IBS-friendly",
  "low-residue",
  "SCD",
  "GAPS",
  "AIP",
  "diabetic-friendly",
  "diabetic-keto",
  "renal-diet",
  "cardiac-diet",
  "liver-friendly",
  "heart-healthy",
  "low-glycemic",
  "low-sodium",
  "low-cholesterol",

  // ——— Allergy & intolerance ———
  "gluten-free",
  "gluten-sensitive",
  "wheat-free",
  "dairy-free",
  "low-histamine",
  "low-oxalate",
  "low-purine",

  // ——— Macro / body comp ———
  "high-protein",
  "high-fat",
  "low-fat",
  "high-fiber",
  "low-fiber",
  "PSMF",
  "athletic-performance",
  "bodybuilding",
  "bulking",
  "cutting",
  "macro-tracking",
  "calorie-restriction",

  // ——— Safety ———
  "immune-safe",

  // ——— Lifestyle / convenience ———
  "quick-prep",
  "family-friendly",
  "comfort-food",
  "budget-friendly",
  "high-volume-low-calorie",
  "clean-eating",
  "food-combining",
  "sustainability-focused",
  "meal-replacement",
  "soup-diet",
  "juice-cleanse",
  "Soylent-based",

  // ——— Religious ———
  "kosher",
  "halal",
  "Buddhist-vegetarian",
] as const;

// Each diet style is one of the strings above.
export type DietStyle = (typeof dietTags)[number];
