// data/meals.ts

export type MealTemplate = {
  id: string;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "small-meal";
  baseCalories: number;
  dietStyles: ("balanced" | "keto" | "high-protein" | "low-fodmap" | "mediterranean")[];
  flags: {
    ibsSafe: boolean;
    glutenFree: boolean;
    immuneSafe: boolean;
  };
};

// Helper to keep objects compact
function flags(ibsSafe: boolean, glutenFree: boolean, immuneSafe: boolean) {
  return { ibsSafe, glutenFree, immuneSafe };
}

/**
 * Curated mock DB:
 * - ~10 breakfasts
 * - ~10 lunches
 * - ~10 dinners
 * - ~10 small meals / snacks
 * Spread across diets + safety flags.
 */
export const MEALS: MealTemplate[] = [
  // BREAKFASTS (balanced / high-protein / low-fodmap / keto / mediterranean)
  {
    id: "b1-oats-ibs",
    name: "IBS-Safe Overnight Oats",
    mealType: "breakfast",
    baseCalories: 380,
    dietStyles: ["balanced", "low-fodmap"],
    flags: flags(true, true, true),
  },
  {
    id: "b2-egg-scramble",
    name: "Spinach & Egg Scramble",
    mealType: "breakfast",
    baseCalories: 320,
    dietStyles: ["balanced", "high-protein", "mediterranean"],
    flags: flags(true, true, true),
  },
  {
    id: "b3-greek-yogurt-bowl",
    name: "Greek Yogurt Berry Bowl",
    mealType: "breakfast",
    baseCalories: 340,
    dietStyles: ["balanced", "high-protein"],
    flags: flags(false, false, true),
  },
  {
    id: "b4-keto-omelette",
    name: "Keto Veggie Omelette",
    mealType: "breakfast",
    baseCalories: 410,
    dietStyles: ["keto", "high-protein"],
    flags: flags(true, true, true),
  },
  {
    id: "b5-fodmap-smoothie",
    name: "Low-FODMAP Green Smoothie",
    mealType: "breakfast",
    baseCalories: 290,
    dietStyles: ["balanced", "low-fodmap"],
    flags: flags(true, true, true),
  },
  {
    id: "b6-avocado-toast-gf",
    name: "Gluten-Free Avocado Toast",
    mealType: "breakfast",
    baseCalories: 360,
    dietStyles: ["balanced", "mediterranean"],
    flags: flags(true, true, true),
  },
  {
    id: "b7-protein-pancakes",
    name: "High-Protein Banana Pancakes",
    mealType: "breakfast",
    baseCalories: 430,
    dietStyles: ["high-protein", "balanced"],
    flags: flags(false, false, true),
  },
  {
    id: "b8-keto-chia-pudding",
    name: "Keto Chia Pudding",
    mealType: "breakfast",
    baseCalories: 360,
    dietStyles: ["keto"],
    flags: flags(true, true, true),
  },
  {
    id: "b9-med-breakfast-plate",
    name: "Mediterranean Breakfast Plate",
    mealType: "breakfast",
    baseCalories: 390,
    dietStyles: ["mediterranean", "balanced"],
    flags: flags(false, true, true),
  },
  {
    id: "b10-egg-white-wrap",
    name: "Egg White Breakfast Wrap (GF Tortilla)",
    mealType: "breakfast",
    baseCalories: 310,
    dietStyles: ["high-protein", "balanced"],
    flags: flags(true, true, true),
  },

  // LUNCHES
  {
    id: "l1-quinoa-bowl",
    name: "Turkey Quinoa Power Bowl",
    mealType: "lunch",
    baseCalories: 520,
    dietStyles: ["balanced", "high-protein"],
    flags: flags(true, true, true),
  },
  {
    id: "l2-chicken-salad-gf",
    name: "Herbed Chicken & Greens (GF)",
    mealType: "lunch",
    baseCalories: 480,
    dietStyles: ["balanced", "mediterranean", "high-protein"],
    flags: flags(true, true, true),
  },
  {
    id: "l3-lf-pasta-salad",
    name: "Low-FODMAP Pasta Salad",
    mealType: "lunch",
    baseCalories: 540,
    dietStyles: ["balanced", "low-fodmap"],
    flags: flags(true, true, true),
  },
  {
    id: "l4-keto-chicken-bowl",
    name: "Keto Chicken & Veg Bowl",
    mealType: "lunch",
    baseCalories: 560,
    dietStyles: ["keto", "high-protein"],
    flags: flags(true, true, true),
  },
  {
    id: "l5-salmon-salad",
    name: "Mediterranean Salmon Salad",
    mealType: "lunch",
    baseCalories: 510,
    dietStyles: ["mediterranean", "balanced"],
    flags: flags(false, true, true),
  },
  {
    id: "l6-rice-bowl-tofu",
    name: "Ginger Tofu Rice Bowl",
    mealType: "lunch",
    baseCalories: 520,
    dietStyles: ["balanced"],
    flags: flags(true, true, true),
  },
  {
    id: "l7-chicken-wrap-gf",
    name: "Grilled Chicken Wrap (GF Tortilla)",
    mealType: "lunch",
    baseCalories: 540,
    dietStyles: ["balanced", "high-protein"],
    flags: flags(true, true, true),
  },
  {
    id: "l8-keto-burger-bun",
    name: "Keto Burger Bowl (No Bun)",
    mealType: "lunch",
    baseCalories: 600,
    dietStyles: ["keto", "high-protein"],
    flags: flags(false, true, true),
  },
  {
    id: "l9-fodmap-burrito-bowl",
    name: "Low-FODMAP Burrito Bowl",
    mealType: "lunch",
    baseCalories: 550,
    dietStyles: ["balanced", "low-fodmap"],
    flags: flags(true, true, true),
  },
  {
    id: "l10-lentil-soup",
    name: "Hearty Lentil & Veg Soup",
    mealType: "lunch",
    baseCalories: 450,
    dietStyles: ["balanced", "mediterranean"],
    flags: flags(false, true, true),
  },

  // DINNERS
  {
    id: "d1-salmon-greens",
    name: "Roasted Salmon & Greens",
    mealType: "dinner",
    baseCalories: 620,
    dietStyles: ["balanced", "mediterranean"],
    flags: flags(false, true, true),
  },
  {
    id: "d2-chicken-traybake",
    name: "Sheet Pan Chicken & Veg",
    mealType: "dinner",
    baseCalories: 580,
    dietStyles: ["balanced", "high-protein"],
    flags: flags(true, true, true),
  },
  {
    id: "d3-keto-steak-plate",
    name: "Keto Steak & Broccoli Plate",
    mealType: "dinner",
    baseCalories: 650,
    dietStyles: ["keto", "high-protein"],
    flags: flags(false, true, true),
  },
  {
    id: "d4-fodmap-stirfry",
    name: "Low-FODMAP Chicken Stir-Fry",
    mealType: "dinner",
    baseCalories: 600,
    dietStyles: ["balanced", "low-fodmap"],
    flags: flags(true, true, true),
  },
  {
    id: "d5-turkey-meatballs",
    name: "Turkey Meatballs & Zoodles",
    mealType: "dinner",
    baseCalories: 590,
    dietStyles: ["high-protein", "keto"],
    flags: flags(true, true, true),
  },
  {
    id: "d6-med-baked-cod",
    name: "Mediterranean Baked Cod",
    mealType: "dinner",
    baseCalories: 560,
    dietStyles: ["mediterranean", "balanced"],
    flags: flags(false, true, true),
  },
  {
    id: "d7-quinoa-chili",
    name: "Quinoa & Bean Chili",
    mealType: "dinner",
    baseCalories: 610,
    dietStyles: ["balanced"],
    flags: flags(false, true, true),
  },
  {
    id: "d8-keto-salmon-alfredo",
    name: "Keto Salmon Alfredo (Zoodles)",
    mealType: "dinner",
    baseCalories: 640,
    dietStyles: ["keto"],
    flags: flags(false, true, true),
  },
  {
    id: "d9-fodmap-baked-chicken",
    name: "Low-FODMAP Baked Chicken & Rice",
    mealType: "dinner",
    baseCalories: 610,
    dietStyles: ["balanced", "low-fodmap"],
    flags: flags(true, true, true),
  },
  {
    id: "d10-veggie-bowl",
    name: "Roasted Veg & Tofu Bowl",
    mealType: "dinner",
    baseCalories: 580,
    dietStyles: ["balanced", "mediterranean"],
    flags: flags(true, true, true),
  },

  // SMALL MEALS / SNACKS
  {
    id: "s1-carrot-hummus",
    name: "Carrot Sticks & Hummus",
    mealType: "small-meal",
    baseCalories: 180,
    dietStyles: ["balanced", "mediterranean"],
    flags: flags(true, true, true),
  },
  {
    id: "s2-apple-pb",
    name: "Apple Slices & Peanut Butter",
    mealType: "small-meal",
    baseCalories: 210,
    dietStyles: ["balanced"],
    flags: flags(true, true, true),
  },
  {
    id: "s3-gf-crackers-cheese",
    name: "GF Crackers & Cheese",
    mealType: "small-meal",
    baseCalories: 190,
    dietStyles: ["balanced"],
    flags: flags(false, true, true),
  },
  {
    id: "s4-protein-shake",
    name: "Simple Protein Shake",
    mealType: "small-meal",
    baseCalories: 220,
    dietStyles: ["high-protein"],
    flags: flags(true, true, true),
  },
  {
    id: "s5-keto-nut-mix",
    name: "Keto Nut & Seed Mix",
    mealType: "small-meal",
    baseCalories: 230,
    dietStyles: ["keto"],
    flags: flags(true, true, true),
  },
  {
    id: "s6-fodmap-rice-cakes",
    name: "Low-FODMAP Rice Cakes & Almond Butter",
    mealType: "small-meal",
    baseCalories: 200,
    dietStyles: ["balanced", "low-fodmap"],
    flags: flags(true, true, true),
  },
  {
    id: "s7-yogurt-gf-granola",
    name: "Yogurt & GF Granola",
    mealType: "small-meal",
    baseCalories: 230,
    dietStyles: ["balanced"],
    flags: flags(false, true, true),
  },
  {
    id: "s8-cottage-cucumber",
    name: "Cottage Cheese & Cucumber",
    mealType: "small-meal",
    baseCalories: 190,
    dietStyles: ["high-protein", "balanced"],
    flags: flags(true, true, true),
  },
  {
    id: "s9-med-olive-plate",
    name: "Mediterranean Snack Plate",
    mealType: "small-meal",
    baseCalories: 220,
    dietStyles: ["mediterranean"],
    flags: flags(false, true, true),
  },
  {
    id: "s10-keto-egg-bites",
    name: "Keto Egg Bites",
    mealType: "small-meal",
    baseCalories: 210,
    dietStyles: ["keto", "high-protein"],
    flags: flags(true, true, true),
  },
];
