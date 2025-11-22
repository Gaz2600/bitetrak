-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SMALL_MEAL');

-- CreateEnum
CREATE TYPE "DietStyle" AS ENUM ('BALANCED', 'KETO', 'HIGH_PROTEIN', 'LOW_FODMAP', 'MEDITERRANEAN');

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealType" "MealType" NOT NULL,
    "baseCalories" INTEGER NOT NULL,
    "isIbsSafe" BOOLEAN NOT NULL DEFAULT false,
    "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "isImmuneSafe" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealDietStyle" (
    "id" SERIAL NOT NULL,
    "mealId" TEXT NOT NULL,
    "dietStyle" "DietStyle" NOT NULL,

    CONSTRAINT "MealDietStyle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MealDietStyle_mealId_dietStyle_key" ON "MealDietStyle"("mealId", "dietStyle");

-- AddForeignKey
ALTER TABLE "MealDietStyle" ADD CONSTRAINT "MealDietStyle_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
