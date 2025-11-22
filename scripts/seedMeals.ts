import { PrismaClient, MealType, DietStyle } from "@prisma/client";
import { MEALS } from "../data/meals.ts";

const prisma = new PrismaClient();

function mapMealType(mealType: string): MealType {
  switch (mealType) {
    case "breakfast":
      return MealType.BREAKFAST;
    case "lunch":
      return MealType.LUNCH;
    case "dinner":
      return MealType.DINNER;
    case "small-meal":
    case "small_meal":
    case "snack":
      return MealType.SMALL_MEAL;
    default:
      throw new Error(`Unknown mealType: ${mealType}`);
  }
}

function mapDietStyle(style: string): DietStyle {
  switch (style) {
    case "balanced":
      return DietStyle.BALANCED;
    case "keto":
      return DietStyle.KETO;
    case "high-protein":
    case "high_protein":
      return DietStyle.HIGH_PROTEIN;
    case "low-fodmap":
    case "low_fodmap":
      return DietStyle.LOW_FODMAP;
    case "mediterranean":
      return DietStyle.MEDITERRANEAN;
    default:
      throw new Error(`Unknown dietStyle: ${style}`);
  }
}

async function main() {
  console.log("Seeding meals...");

  const total = MEALS.length;
  console.log(`Total meals to seed: ${total}`);

  let index = 0;

  for (const m of MEALS) {
    index++;
    const anyMeal = m as any;

    const id = anyMeal.id ?? `#${index}`;
    const name = anyMeal.name ?? "Unnamed";

    console.log(`→ [${index}/${total}] Upserting meal id=${id}, name="${name}"`);

    try {
      const mealTypeEnum = mapMealType(anyMeal.mealType);

      const isIbsSafe =
        anyMeal.ibsSafe ?? anyMeal.flags?.ibsSafe ?? false;
      const isGlutenFree =
        anyMeal.glutenFree ?? anyMeal.flags?.glutenFree ?? false;
      const isImmuneSafe =
        anyMeal.immuneSafe ?? anyMeal.flags?.immuneSafe ?? false;

      await prisma.meal.upsert({
        where: { id: anyMeal.id },
        update: {
          name: anyMeal.name,
          mealType: mealTypeEnum,
          baseCalories: anyMeal.baseCalories,
          isIbsSafe,
          isGlutenFree,
          isImmuneSafe,
        },
        create: {
          id: anyMeal.id,
          name: anyMeal.name,
          mealType: mealTypeEnum,
          baseCalories: anyMeal.baseCalories,
          isIbsSafe,
          isGlutenFree,
          isImmuneSafe,
          dietStyles: {
            create: (anyMeal.dietStyles || []).map((style: string) => ({
              dietStyle: mapDietStyle(style),
            })),
          },
        },
      });

      console.log(`   ✔ Done id=${id}`);
    } catch (err) {
      console.error(`   ✖ Error seeding meal id=${id}, name="${name}"`);
      console.error(err);
      // If one meal fails, stop the whole script so you see the error clearly.
      throw err;
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma...");
    await prisma.$disconnect();
    console.log("Done.");
  });
