// data/meals.ts

import type { MealTemplate } from "../types/meals";

// Simple helper (you can replace with UUIDs later)
const makeId = (slug: string) => slug;

export const meals: MealTemplate[] = [
  //
  // BREAKFASTS
  //
  {
    id: makeId("ibs-overnight-oats"),
    name: "IBS-Safe Overnight Oats",
    mealType: "breakfast",
    baseCalories: 380,
    dietStyles: [
      "balanced",
      "low-fodmap",
      "IBS-friendly",
      "heart-healthy",
      "high-fiber",
      "family-friendly",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true, // use certified GF oats
      immuneSafe: true,
    },
    description:
      "Rolled oats with lactose-free milk, chia seeds, blueberries, and maple syrup.",
  },
  {
    id: makeId("egg-white-veggie-scramble"),
    name: "Egg White Veggie Scramble",
    mealType: "breakfast",
    baseCalories: 320,
    dietStyles: [
      "high-protein",
      "balanced",
      "low-carb",
      "quick-prep",
      "athletic-performance",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Egg whites with spinach, bell peppers, and lactose-free cheese.",
  },
  {
    id: makeId("keto-smoked-salmon-bowl"),
    name: "Keto Smoked Salmon Breakfast Bowl",
    mealType: "breakfast",
    baseCalories: 450,
    dietStyles: [
      "keto",
      "high-protein",
      "low-carb",
      "mediterranean",
      "heart-healthy",
    ],
    flags: {
      ibsSafe: false, // smoked fish can be tricky
      glutenFree: true,
      immuneSafe: false, // not ideal for immunocompromised
    },
    description:
      "Smoked salmon with avocado, cucumber, olive oil, and mixed greens.",
  },
  {
    id: makeId("mediterranean-yogurt-parfait"),
    name: "Mediterranean Yogurt Parfait",
    mealType: "breakfast",
    baseCalories: 360,
    dietStyles: [
      "mediterranean",
      "balanced",
      "high-protein",
      "MIND-diet",
      "heart-healthy",
    ],
    flags: {
      ibsSafe: false,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Greek yogurt with strawberries, walnuts, and a drizzle of honey.",
  },
  {
    id: makeId("tofu-scramble-veggie"),
    name: "Tofu Scramble with Veggies",
    mealType: "breakfast",
    baseCalories: 340,
    dietStyles: [
      "vegan",
      "plant-based",
      "high-protein",
      "balanced",
      "IBS-friendly",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Crumbled tofu with spinach, tomatoes, and turmeric, served with gluten-free toast.",
  },

  //
  // LUNCHES
  //
  {
    id: makeId("turkey-quinoa-bowl"),
    name: "Turkey Quinoa Bowl",
    mealType: "lunch",
    baseCalories: 520,
    dietStyles: [
      "balanced",
      "high-protein",
      "IBS-friendly",
      "gluten-free",
      "athletic-performance",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Ground turkey with quinoa, carrots, zucchini, and olive oil.",
  },
  {
    id: makeId("lowfodmap-chicken-rice"),
    name: "Low-FODMAP Chicken & Rice Plate",
    mealType: "lunch",
    baseCalories: 500,
    dietStyles: [
      "low-fodmap",
      "IBS-friendly",
      "balanced",
      "heart-healthy",
      "family-friendly",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Grilled chicken breast with white rice, steamed green beans, and garlic-free herb oil.",
  },
  {
    id: makeId("keto-chicken-caesar-bowl"),
    name: "Keto Chicken Caesar Bowl (No Croutons)",
    mealType: "lunch",
    baseCalories: 480,
    dietStyles: ["keto", "low-carb", "high-protein", "cutting"],
    flags: {
      ibsSafe: false, // creamy dressing can trigger IBS
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Chicken over romaine lettuce with parmesan and Caesar-style dressing.",
  },
  {
    id: makeId("mediterranean-lentil-salad"),
    name: "Mediterranean Lentil Salad",
    mealType: "lunch",
    baseCalories: 460,
    dietStyles: [
      "mediterranean",
      "plant-based",
      "vegan",
      "high-fiber",
      "heart-healthy",
    ],
    flags: {
      ibsSafe: false, // lentils = gas for some
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Lentils with cucumber, tomato, olives, and lemon-olive oil dressing.",
  },
  {
    id: makeId("immune-safe-chicken-soup"),
    name: "Immune-Safe Chicken & Rice Soup",
    mealType: "lunch",
    baseCalories: 430,
    dietStyles: [
      "balanced",
      "IBS-friendly",
      "immune-safe",
      "soup-diet",
      "low-residue",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Clear broth soup with shredded chicken, rice, carrots, and zucchini.",
  },

  //
  // DINNERS
  //
  {
    id: makeId("roasted-salmon-greens"),
    name: "Roasted Salmon with Greens",
    mealType: "dinner",
    baseCalories: 550,
    dietStyles: [
      "mediterranean",
      "balanced",
      "heart-healthy",
      "high-protein",
      "MIND-diet",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Oven-roasted salmon with roasted potatoes and sautéed green beans.",
  },
  {
    id: makeId("ibs-safe-turkey-pasta"),
    name: "IBS-Safe Turkey Pasta",
    mealType: "dinner",
    baseCalories: 600,
    dietStyles: [
      "balanced",
      "IBS-friendly",
      "family-friendly",
      "comfort-food",
      "gluten-free",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Gluten-free pasta with lean turkey meat sauce (onion/garlic-free) and spinach.",
  },
  {
    id: makeId("keto-steak-veggies"),
    name: "Keto Steak & Roasted Veggies",
    mealType: "dinner",
    baseCalories: 650,
    dietStyles: [
      "keto",
      "carnivore",
      "high-protein",
      "low-carb",
      "bodybuilding",
    ],
    flags: {
      ibsSafe: false,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Grilled steak with roasted Brussels sprouts and a side salad.",
  },
  {
    id: makeId("mediterranean-chicken-bowl"),
    name: "Mediterranean Chicken Bowl",
    mealType: "dinner",
    baseCalories: 540,
    dietStyles: [
      "mediterranean",
      "balanced",
      "heart-healthy",
      "high-protein",
      "family-friendly",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: false, // if using regular pita or bulgur
      immuneSafe: true,
    },
    description:
      "Chicken with brown rice or bulgur, cucumber, tomato, olives, and yogurt sauce.",
  },
  {
    id: makeId("vegan-stirfry-tofu-rice"),
    name: "Vegan Tofu Stir-Fry with Rice",
    mealType: "dinner",
    baseCalories: 520,
    dietStyles: [
      "vegan",
      "plant-based",
      "balanced",
      "high-fiber",
      "sustainability-focused",
    ],
    flags: {
      ibsSafe: false,
      glutenFree: true, // if using tamari
      immuneSafe: true,
    },
    description:
      "Tofu stir-fried with bell peppers, carrots, and bok choy over rice.",
  },

  //
  // SMALL-MEAL / SNACKS
  //
  {
    id: makeId("ibs-safe-rice-cakes"),
    name: "IBS-Safe Rice Cakes with Peanut Butter",
    mealType: "small-meal",
    baseCalories: 220,
    dietStyles: [
      "balanced",
      "IBS-friendly",
      "quick-prep",
      "high-volume-low-calorie",
    ],
    flags: {
      ibsSafe: true,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Plain rice cakes topped with smooth peanut butter and sliced banana (small portion).",
  },
  {
    id: makeId("greek-yogurt-berries"),
    name: "Greek Yogurt with Berries",
    mealType: "small-meal",
    baseCalories: 180,
    dietStyles: [
      "high-protein",
      "balanced",
      "MIND-diet",
      "heart-healthy",
      "cutting",
    ],
    flags: {
      ibsSafe: false,
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Plain Greek yogurt with a handful of mixed berries.",
  },
  {
    id: makeId("hummus-carrot-cucumber"),
    name: "Hummus with Carrot & Cucumber Sticks",
    mealType: "small-meal",
    baseCalories: 200,
    dietStyles: [
      "mediterranean",
      "vegan",
      "plant-based",
      "clean-eating",
    ],
    flags: {
      ibsSafe: false, // chickpeas = high-FODMAP
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Hummus served with carrot and cucumber sticks.",
  },
  {
    id: makeId("protein-shake-basic"),
    name: "Basic Whey Protein Shake",
    mealType: "small-meal",
    baseCalories: 220,
    dietStyles: [
      "high-protein",
      "athletic-performance",
      "bodybuilding",
      "cutting",
    ],
    flags: {
      ibsSafe: false, // whey can trigger IBS
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Whey protein mixed with water or lactose-free milk.",
  },
  {
    id: makeId("immune-safe-apple-almonds"),
    name: "Immune-Safe Apple & Almonds",
    mealType: "small-meal",
    baseCalories: 190,
    dietStyles: [
      "balanced",
      "heart-healthy",
      "clean-eating",
      "quick-prep",
      "family-friendly",
    ],
    flags: {
      ibsSafe: false, // apples are high-FODMAP
      glutenFree: true,
      immuneSafe: true,
    },
    description:
      "Sliced apple with a small handful of almonds.",
  },
];
