// data/meals.ts

export type DietStyle =
  | "balanced"
  | "high-protein"
  | "keto"
  | "mediterranean"
  | "low-fodmap";

export type MealType = "breakfast" | "lunch" | "dinner" | "small-meal";

export interface MealTemplate {
  id: string;
  name: string;
  mealType: MealType;
  baseCalories: number;
  dietStyles: DietStyle[];
  ibsSafe: boolean;
  glutenFree: boolean;
  immuneSafe: boolean;
}

// Initial “database” of meals.
// You can expand this list over time.
export const mealTemplates: MealTemplate[] = [
  // --- Breakfasts (balanced / IBS-safe / often GF) ---
  {
    id: "oats-berries-chia",
    name: "Oatmeal with blueberries and chia",
    mealType: "breakfast",
    baseCalories: 420,
    dietStyles: ["balanced", "mediterranean"],
    ibsSafe: true,
    glutenFree: true, // assuming GF oats
    immuneSafe: true,
  },
  {
    id: "eggs-spinach-toast-gf",
    name: "Scrambled eggs with spinach and GF toast",
    mealType: "breakfast",
    baseCalories: 450,
    dietStyles: ["balanced", "high-protein"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "yogurt-berries-almonds",
    name: "Lactose-free yogurt with berries and almonds",
    mealType: "breakfast",
    baseCalories: 380,
    dietStyles: ["balanced", "mediterranean"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },

  // --- Lunches ---
  {
    id: "chicken-rice-bowl",
    name: "Grilled chicken, rice and roasted veggies",
    mealType: "lunch",
    baseCalories: 600,
    dietStyles: ["balanced", "high-protein"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "quinoa-salad-feta",
    name: "Quinoa salad with cucumber, tomato and feta",
    mealType: "lunch",
    baseCalories: 550,
    dietStyles: ["balanced", "mediterranean"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "turkey-lettuce-wraps",
    name: "Turkey lettuce wraps with carrots and rice",
    mealType: "lunch",
    baseCalories: 520,
    dietStyles: ["balanced", "high-protein"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },

  // --- Dinners ---
  {
    id: "salmon-potato-greens",
    name: "Baked salmon, potatoes and green beans",
    mealType: "dinner",
    baseCalories: 650,
    dietStyles: ["balanced", "mediterranean"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "tofu-rice-stirfry",
    name: "Tofu and veggie stir-fry over rice",
    mealType: "dinner",
    baseCalories: 600,
    dietStyles: ["balanced", "low-fodmap"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "chicken-pasta-tomato",
    name: "Chicken and gluten-free pasta with tomato sauce",
    mealType: "dinner",
    baseCalories: 680,
    dietStyles: ["balanced", "high-protein"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },

  // --- Small meals / snacks for 5-meal days ---
  {
    id: "rice-cakes-peanut-butter",
    name: "Rice cakes with peanut butter",
    mealType: "small-meal",
    baseCalories: 250,
    dietStyles: ["balanced"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "hummus-carrots-cucumber",
    name: "Hummus with carrot and cucumber sticks",
    mealType: "small-meal",
    baseCalories: 220,
    dietStyles: ["balanced", "mediterranean"],
    ibsSafe: true, // depending on tolerance; you can tweak later
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "banana-almond-butter",
    name: "Banana with almond butter",
    mealType: "small-meal",
    baseCalories: 270,
    dietStyles: ["balanced"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },

  // --- A few keto / higher protein options ---
  {
    id: "keto-omelette",
    name: "Cheese and veggie omelette",
    mealType: "breakfast",
    baseCalories: 480,
    dietStyles: ["keto", "high-protein"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "keto-chicken-salad",
    name: "Chicken salad with olive oil dressing",
    mealType: "lunch",
    baseCalories: 550,
    dietStyles: ["keto", "high-protein"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
  {
    id: "keto-salmon-broccoli",
    name: "Salmon with broccoli and olive oil",
    mealType: "dinner",
    baseCalories: 620,
    dietStyles: ["keto", "high-protein"],
    ibsSafe: true,
    glutenFree: true,
    immuneSafe: true,
  },
];
