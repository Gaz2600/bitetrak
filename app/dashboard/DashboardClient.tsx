"use client";

import { useState, useEffect } from "react";

type Ingredient = {
  name: string;
  unit?: string;
  quantity?: number;
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
  recipe?: MealRecipe;
  ibsSafe?: boolean;
  glutenFree?: boolean;
  immuneSafe?: boolean;
  description?: string;
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
  shoppingList?: ShoppingItem[];
};

type AllergyKey = "dairy" | "eggs" | "nuts" | "shellfish" | "soy";

function prettyDietLabel(diet: string) {
  switch (diet) {
    case "high-protein":
      return "High-protein";
    case "keto":
      return "Keto / low carb";
    case "mediterranean":
      return "Mediterranean";
    case "low-fodmap":
      return "Low-FODMAP focus";
    default:
      return "Balanced";
  }
}

export default function DashboardClient() {
  // Wizard step: 1 = basics, 2 = constraints, 3 = print/layout
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Whether the planner UI is collapsed after generating
  const [plannerCollapsed, setPlannerCollapsed] = useState(false);

  // Core settings
  const [calories, setCalories] = useState("2100");
  const [diet, setDiet] = useState("balanced");
  const [ibsSafe, setIbsSafe] = useState(true);
  const [glutenFree, setGlutenFree] = useState(false);
  const [immuneSafe, setImmuneSafe] = useState(false);
  const [mealsPerDay, setMealsPerDay] = useState<"3" | "5">("3");

  // Food allergies
  const [allergies, setAllergies] = useState<AllergyKey[]>([]);

  // Extra gut / medical constraints
  const [lowHistamine, setLowHistamine] = useState(false);
  const [lowOxalate, setLowOxalate] = useState(false);
  const [gerdFriendly, setGerdFriendly] = useState(false);

  // Column visibility options (dashboard + print)
  const [showKcal, setShowKcal] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [showTotalPerDay, setShowTotalPerDay] = useState(true);

  // Print details: Name + Week of
  const [displayName, setDisplayName] = useState("");
  const [weekOf, setWeekOf] = useState("");

  // Print content toggles
  const [includePlanPrint, setIncludePlanPrint] = useState(true);
  const [includeShoppingPrint, setIncludeShoppingPrint] = useState(true);
  const [includeRecipesPrint, setIncludeRecipesPrint] = useState(true);

  const [week, setWeek] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[] | null>(null);

  // Load from localStorage + URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem("bitetrakDashboard");
      if (raw) {
        const saved = JSON.parse(raw);

        if (saved.calories) setCalories(String(saved.calories));
        if (saved.diet) setDiet(saved.diet);
        if (typeof saved.ibsSafe === "boolean") setIbsSafe(saved.ibsSafe);
        if (typeof saved.glutenFree === "boolean")
          setGlutenFree(saved.glutenFree);
        if (typeof saved.immuneSafe === "boolean")
          setImmuneSafe(saved.immuneSafe);
        if (saved.mealsPerDay === "3" || saved.mealsPerDay === "5") {
          setMealsPerDay(saved.mealsPerDay);
        }

        if (Array.isArray(saved.allergies)) {
          setAllergies(saved.allergies as AllergyKey[]);
        }
        if (typeof saved.lowHistamine === "boolean")
          setLowHistamine(saved.lowHistamine);
        if (typeof saved.lowOxalate === "boolean")
          setLowOxalate(saved.lowOxalate);
        if (typeof saved.gerdFriendly === "boolean")
          setGerdFriendly(saved.gerdFriendly);

        if (typeof saved.showKcal === "boolean") setShowKcal(saved.showKcal);
        if (typeof saved.showTags === "boolean") setShowTags(saved.showTags);
        if (typeof saved.showTotalPerDay === "boolean")
          setShowTotalPerDay(saved.showTotalPerDay);

        if (saved.displayName) setDisplayName(saved.displayName);
        if (saved.weekOf) setWeekOf(saved.weekOf);

        if (typeof saved.includePlanPrint === "boolean")
          setIncludePlanPrint(saved.includePlanPrint);
        if (typeof saved.includeShoppingPrint === "boolean")
          setIncludeShoppingPrint(saved.includeShoppingPrint);
        if (typeof saved.includeRecipesPrint === "boolean")
          setIncludeRecipesPrint(saved.includeRecipesPrint);

        if (Array.isArray(saved.week)) {
          setWeek(saved.week as DayPlan[]);
        }
        if (Array.isArray(saved.shoppingList)) {
          setShoppingList(saved.shoppingList as ShoppingItem[]);
        }
        if (typeof saved.plannerCollapsed === "boolean") {
          setPlannerCollapsed(saved.plannerCollapsed);
        }
      } else {
        // Fallback for older key (name only)
        const legacyName = window.localStorage.getItem("bitetrakDisplayName");
        if (legacyName) {
          setDisplayName(legacyName);
        }
      }

      // URL params override stored settings
      const params = new URLSearchParams(window.location.search);

      const caloriesParam = params.get("calories");
      const dietParam = params.get("diet");
      const ibsParam = params.get("ibsSafe");
      const glutenParam = params.get("glutenFree");
      const immuneParam = params.get("immuneSafe");
      const mealsParam = params.get("mealsPerDay");
      const nameParam = params.get("name");
      const weekOfParam = params.get("weekOf");

      if (caloriesParam) setCalories(caloriesParam);
      if (dietParam) setDiet(dietParam);

      if (ibsParam !== null) setIbsSafe(ibsParam === "true");
      if (glutenParam !== null) setGlutenFree(glutenParam === "true");
      if (immuneParam !== null) setImmuneSafe(immuneParam === "true");

      if (mealsParam === "5") setMealsPerDay("5");
      if (nameParam) setDisplayName(nameParam);
      if (weekOfParam) setWeekOf(weekOfParam);
    } catch (err) {
      console.error("Failed to load saved dashboard settings", err);
    }
  }, []);

  // Persist settings + last week to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const payload = {
      calories,
      diet,
      ibsSafe,
      glutenFree,
      immuneSafe,
      mealsPerDay,
      allergies,
      lowHistamine,
      lowOxalate,
      gerdFriendly,
      showKcal,
      showTags,
      showTotalPerDay,
      displayName,
      weekOf,
      includePlanPrint,
      includeShoppingPrint,
      includeRecipesPrint,
      week,
      shoppingList,
      plannerCollapsed,
    };

    try {
      window.localStorage.setItem(
        "bitetrakDashboard",
        JSON.stringify(payload)
      );
    } catch (err) {
      console.error("Failed to save dashboard settings", err);
    }
  }, [
    calories,
    diet,
    ibsSafe,
    glutenFree,
    immuneSafe,
    mealsPerDay,
    allergies,
    lowHistamine,
    lowOxalate,
    gerdFriendly,
    showKcal,
    showTags,
    showTotalPerDay,
    displayName,
    weekOf,
    includePlanPrint,
    includeShoppingPrint,
    includeRecipesPrint,
    week,
    shoppingList,
    plannerCollapsed,
  ]);

  const flagLabels: string[] = [];
  if (ibsSafe) flagLabels.push("IBS-safe");
  if (glutenFree) flagLabels.push("Gluten-free");
  if (immuneSafe) flagLabels.push("Immune-conscious");
  if (lowHistamine) flagLabels.push("Low-histamine");
  if (lowOxalate) flagLabels.push("Low-oxalate");
  if (gerdFriendly) flagLabels.push("GERD-friendly");
  const flagSummary =
    flagLabels.length > 0 ? flagLabels.join(" • ") : "General plan";

  const numericMealsPerDay = Number(mealsPerDay) || 3;

  function toggleAllergy(key: AllergyKey) {
    setAllergies((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calories: Number(calories) || undefined,
          diet,
          ibsSafe,
          glutenFree,
          immuneSafe,
          mealsPerDay: Number(mealsPerDay) || 3,
          allergies,
          lowHistamine,
          lowOxalate,
          gerdFriendly,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg =
          (errBody && (errBody as any).error) ||
          `Request failed with status ${res.status}`;
        throw new Error(msg);
      }

      const data = (await res.json()) as ApiResponse;
      setWeek(data.week);
      setShoppingList(data.shoppingList ?? null);
      // After a successful generation, collapse the planner
      setPlannerCollapsed(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  // Helpers for layouts
  function getMealByLabel(day: DayPlan, label: string): Meal | undefined {
    return day.meals.find((m) => m.label === label);
  }

  function getMealByIndex(day: DayPlan, index: number): Meal | undefined {
    return day.meals[index];
  }

  const stepsMeta: { id: 1 | 2 | 3; title: string; subtitle: string }[] = [
    {
      id: 1,
      title: "Basics",
      subtitle: "Calories, diet style, meals per day",
    },
    {
      id: 2,
      title: "Restrictions",
      subtitle: "Gut / medical constraints & allergies",
    },
    {
      id: 3,
      title: "Print & layout",
      subtitle: "Print labels, columns, and pages",
    },
  ];

  return (
    <section className="dashboard-page px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      {/* TOP BAR (screen only) */}
      <div className="max-w-6xl mx-auto mb-6 space-y-3 print:hidden">
        {/* If planner is collapsed and we have a week, show compact summary; otherwise full wizard */}
        {plannerCollapsed && week ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-slate-900">
                  BiteTrak Planner
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                  Plan ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {prettyDietLabel(diet)} •{" "}
                {calories ? `${calories} kcal/day` : "Auto calories"} •{" "}
                {numericMealsPerDay === 5
                  ? "5 smaller meals/day"
                  : "3 meals/day"}
              </p>
              <p className="text-[11px] text-slate-400">
                {flagSummary} • Name:{" "}
                {displayName || "____________________"} • Week of:{" "}
                {weekOf || "____________________"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setPlannerCollapsed(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Edit planner
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed"
              >
                {loading ? "Regenerating…" : "Regenerate week"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Print
              </button>
              <button
                type="button"
                onClick={() => {
                  setWeek(null);
                  setShoppingList(null);
                  setPlannerCollapsed(false);
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Clear plan
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-lg p-4 sm:p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-slate-900">
                  BiteTrak Planner
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Step through basics, restrictions, and print options to build
                  a 7-day plan.
                </p>
              </div>
              <span className="self-start inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                v0.1 prototype
              </span>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-between border border-slate-100 rounded-2xl p-2 bg-slate-50/70">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-semibold">
                  {step}
                </span>
                <div>
                  <p className="font-medium text-slate-900">
                    Step {step} of 3 · {stepsMeta[step - 1].title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {stepsMeta[step - 1].subtitle}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
                {stepsMeta.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(s.id)}
                    className={`px-2 py-1 rounded-xl border text-[11px] ${
                      s.id === step
                        ? "border-emerald-500 bg-white text-emerald-700"
                        : "border-transparent text-slate-400 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    {s.id}. {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="space-y-4">
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-medium text-slate-700">
                        Daily calories
                      </label>
                      <input
                        type="number"
                        min={1200}
                        max={5000}
                        step={50}
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="e.g. 2100"
                      />
                      <p className="text-[11px] text-slate-400">
                        We&apos;ll try to stay near this per day.
                      </p>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-slate-700">
                        Diet style
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <select
                          value={diet}
                          onChange={(e) => setDiet(e.target.value)}
                          className="w-full sm:max-w-xs rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="balanced">Balanced / general</option>
                          <option value="high-protein">
                            High-protein emphasis
                          </option>
                          <option value="keto">Keto / low carb</option>
                          <option value="mediterranean">
                            Mediterranean style
                          </option>
                          <option value="low-fodmap">Low-FODMAP focus</option>
                        </select>
                        <p className="text-[11px] text-slate-400">
                          We respect this first, then gently relax if needed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      Meals per day
                    </label>
                    <div className="inline-flex rounded-2xl bg-slate-50 p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setMealsPerDay("3")}
                        className={`px-3 py-1.5 text-[11px] font-medium rounded-xl ${
                          mealsPerDay === "3"
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-500"
                        }`}
                      >
                        3 meals
                      </button>
                      <button
                        type="button"
                        onClick={() => setMealsPerDay("5")}
                        className={`px-3 py-1.5 text-[11px] font-medium rounded-xl ${
                          mealsPerDay === "5"
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                            : "text-slate-500"
                        }`}
                      >
                        5 smaller meals
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      We&apos;ll distribute calories across {mealsPerDay}{" "}
                      {mealsPerDay === "5" ? "smaller" : "larger"} meals.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: RESTRICTIONS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {/* Gut / autoimmune constraints */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Gut / medical constraints
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setIbsSafe((v) => !v)}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            ibsSafe
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          IBS / low-FODMAP
                        </button>
                        <button
                          type="button"
                          onClick={() => setGlutenFree((v) => !v)}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            glutenFree
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Gluten-free only
                        </button>
                        <button
                          type="button"
                          onClick={() => setImmuneSafe((v) => !v)}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            immuneSafe
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Immune-conscious
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setLowHistamine((v) => !v)}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            lowHistamine
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Low-histamine
                        </button>
                        <button
                          type="button"
                          onClick={() => setLowOxalate((v) => !v)}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            lowOxalate
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Low-oxalate
                        </button>
                        <button
                          type="button"
                          onClick={() => setGerdFriendly((v) => !v)}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            gerdFriendly
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          GERD / reflux-friendly
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        We&apos;ll never “relax” these. If nothing fits, we tell
                        you instead of forcing unsafe meals.
                      </p>
                    </div>

                    {/* Food allergies */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Food allergies
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAllergy("dairy")}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            allergies.includes("dairy")
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Dairy
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAllergy("eggs")}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            allergies.includes("eggs")
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Eggs
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAllergy("nuts")}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            allergies.includes("nuts")
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Nuts
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAllergy("shellfish")}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            allergies.includes("shellfish")
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Shellfish
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAllergy("soy")}
                          className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium ${
                            allergies.includes("soy")
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          Soy
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        We scan ingredients and meal names to avoid obvious
                        triggers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PRINT & LAYOUT */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Print details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Print label
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Name for printout"
                      />
                      <p className="text-[11px] text-slate-400">
                        Optional label for headers & pages.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Week of
                      </label>
                      <input
                        type="text"
                        value={weekOf}
                        onChange={(e) => setWeekOf(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Week of (e.g. 2025-01-15)"
                      />
                      <p className="text-[11px] text-slate-400">
                        Helps anchor which week this plan is for.
                      </p>
                    </div>
                  </div>

                  {/* Layout + print options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Layout options
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            checked={showKcal}
                            onChange={(e) => setShowKcal(e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Show kcal per meal
                        </label>
                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            checked={showTags}
                            onChange={(e) => setShowTags(e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Show tags per meal
                        </label>
                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            checked={showTotalPerDay}
                            onChange={(e) =>
                              setShowTotalPerDay(e.target.checked)
                            }
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Show total kcal / day
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        When printing, include…
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            checked={includePlanPrint}
                            onChange={(e) =>
                              setIncludePlanPrint(e.target.checked)
                            }
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Weekly grid
                        </label>
                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            checked={includeShoppingPrint}
                            onChange={(e) =>
                              setIncludeShoppingPrint(e.target.checked)
                            }
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Grocery list page
                        </label>
                        <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            checked={includeRecipesPrint}
                            onChange={(e) =>
                              setIncludeRecipesPrint(e.target.checked)
                            }
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          Recipes page
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation + actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))
                      }
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      ← Back
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      onClick={() =>
                        setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))
                      }
                      className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                      Next →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {step === 3 && (
                    <>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleGenerate}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                      >
                        {loading ? "Generating…" : "Generate week"}
                      </button>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        Print
                      </button>
                    </>
                  )}
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-800 flex items-start gap-2 max-w-xs">
                      <div>
                        <p className="font-semibold">
                          Oops, something went wrong.
                        </p>
                        <p className="mt-0.5">{error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={loading}
                        className="shrink-0 rounded-full border border-red-300 bg-white px-2 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA (screen + print layouts) */}
      <div className="max-w-6xl mx-auto space-y-4">
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-4 text-xs text-slate-600 flex items-center gap-2 shadow-soft-lg">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"
              aria-hidden="true"
            />
            <p>Generating your week based on your settings…</p>
          </div>
        )}

        {!week && !loading && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            <p className="font-medium text-slate-500 mb-1">No plan yet</p>
            <p>
              Step through the planner above and click{" "}
              <span className="font-semibold">Generate week</span> to see your
              plan here.
            </p>
          </div>
        )}

        {week && (
          <>
            {/* SCREEN-ONLY PLAN CARD */}
            <div className="print:hidden bg-white rounded-3xl border border-slate-200 shadow-soft-lg p-4 sm:p-5">
              {/* Header */}
              <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-2 mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    BiteTrak • Weekly Plan
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Approx. {calories || "2100"} kcal/day •{" "}
                    {prettyDietLabel(diet)} • {flagSummary} •{" "}
                    {numericMealsPerDay === 5
                      ? "5 smaller meals/day"
                      : "3 meals/day"}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  Name: {displayName || "____________________"}
                  <br />
                  Week of: {weekOf || "____________________"}
                </div>
              </div>

              {/* Screen view: cards grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {week.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        {day.day}
                      </p>
                      {showTotalPerDay && (
                        <p className="text-xs text-slate-500">
                          {day.totalCalories} kcal
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 text-xs flex-1">
                      {day.meals.map((m, idx) => {
                        const normalizedTag = (m.tag || "").toLowerCase();

                        const isIbsSafe =
                          typeof m.ibsSafe === "boolean"
                            ? m.ibsSafe
                            : normalizedTag.includes("ibs");

                        const isGlutenFree =
                          typeof m.glutenFree === "boolean"
                            ? m.glutenFree
                            : normalizedTag.includes("gf") ||
                              normalizedTag.includes("gluten-free") ||
                              normalizedTag.includes("gluten free");

                        const isImmuneSafe =
                          typeof m.immuneSafe === "boolean"
                            ? m.immuneSafe
                            : normalizedTag.includes("immune");

                        const hasBadges =
                          isIbsSafe || isGlutenFree || isImmuneSafe;

                        const description =
                          m.description ||
                          (m.tag
                            ? `${m.name} • ${m.tag}`
                            : "Recipe details and instructions coming soon.");

                        return (
                          <div
                            key={`${day.day}-${idx}`}
                            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer"
                            title={description}
                          >
                            <p className="text-[11px] font-medium text-slate-500">
                              {m.label}
                            </p>
                            <p className="text-xs font-semibold text-slate-900">
                              {m.name}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              {showKcal && (
                                <span className="text-[11px] text-slate-600">
                                  {m.kcal} kcal
                                </span>
                              )}
                              {showTags && m.tag && (
                                <span className="text-[11px] text-emerald-600">
                                  {m.tag}
                                </span>
                              )}
                            </div>

                            {showTags && hasBadges && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {isIbsSafe && (
                                  <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                    IBS-safe
                                  </span>
                                )}
                                {isGlutenFree && (
                                  <span className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                                    GF
                                  </span>
                                )}
                                {isImmuneSafe && (
                                  <span className="inline-flex items-center rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                    Immune-safe
                                  </span>
                                )}
                              </div>
                            )}

                            {m.recipe &&
                              m.recipe.steps &&
                              m.recipe.steps.length > 0 && (
                                <details className="mt-2 text-[11px]">
                                  <summary className="cursor-pointer text-slate-500">
                                    View recipe
                                  </summary>
                                  <ol className="mt-1 list-decimal list-inside space-y-1 text-slate-600">
                                    {m.recipe.steps.map((step, stepIdx) => (
                                      <li key={stepIdx}>{step}</li>
                                    ))}
                                  </ol>
                                </details>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Screen grocery list */}
              {shoppingList && shoppingList.length > 0 && (
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <h3 className="text-xs font-semibold text-slate-900 mb-2">
                    Weekly shopping list
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                    {shoppingList.map((item, idx) => (
                      <div key={idx} className="flex justify-between gap-2">
                        <span>{item.name}</span>
                        <span>
                          {item.quantity
                            ? item.quantity.toFixed(2).replace(/\.00$/, "")
                            : ""}
                          {item.unit ? ` ${item.unit}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* PRINT-ONLY: Weekly grid/table (fridge sheet) */}
            {includePlanPrint && (
              <div
                className={`hidden print:block print-frame ${
                  numericMealsPerDay === 3 ? "meals-3" : "meals-5"
                }`}
              >
                {/* Fridge-style header */}
                <div className="print-header">
                  <div className="print-header-main">
                    <h2>BiteTrak Weekly Plan</h2>
                    <p className="print-header-sub">
                      {displayName
                        ? `${displayName}'s ${prettyDietLabel(diet)} week`
                        : `${prettyDietLabel(diet)} week`}
                    </p>
                    <p className="print-notes">
                      Adjust portions and meals as needed. This is a planning
                      tool, not medical advice.
                    </p>
                  </div>
                  <div className="print-header-meta">
                    <div>
                      <strong>Week of:</strong>{" "}
                      {weekOf || "____________________"}
                    </div>
                    <div>
                      <strong>Calories:</strong>{" "}
                      {calories ? `${calories} / day` : "—"}
                    </div>
                    <div>
                      <strong>Meals/day:</strong> {numericMealsPerDay}
                    </div>
                    <div>
                      <strong>Focus:</strong> {flagSummary}
                    </div>
                  </div>
                </div>

                {/* Legend for badges / focus */}
                <div className="print-legend">
                  {ibsSafe && (
                    <span className="legend-ibs">IBS-safe focus</span>
                  )}
                  {glutenFree && (
                    <span className="legend-gf">Gluten-aware / GF</span>
                  )}
                  {immuneSafe && (
                    <span className="legend-immune">Immune-conscious</span>
                  )}
                  {lowHistamine && <span>Low-histamine</span>}
                  {lowOxalate && <span>Low-oxalate</span>}
                  {gerdFriendly && <span>GERD-friendly</span>}
                </div>

                {numericMealsPerDay === 3 ? (
                  <table className="meal-table print-table text-[11px]">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Breakfast</th>
                        <th>Lunch</th>
                        <th>Dinner</th>
                        {showTotalPerDay && (
                          <th className="text-right">Total kcal</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {week.map((day) => {
                        const b = getMealByLabel(day, "Breakfast");
                        const l = getMealByLabel(day, "Lunch");
                        const d = getMealByLabel(day, "Dinner");
                        return (
                          <tr key={day.day}>
                            <td>
                              <span className="meal-name">{day.day}</span>
                            </td>
                            <td>
                              {b && (
                                <>
                                  <span className="meal-name">{b.name}</span>
                                  {showKcal && (
                                    <span className="meal-calories">
                                      {b.kcal} kcal
                                    </span>
                                  )}
                                  {showTags && b.tag && (
                                    <span className="meal-badges">
                                      {b.tag}
                                    </span>
                                  )}
                                </>
                              )}
                            </td>
                            <td>
                              {l && (
                                <>
                                  <span className="meal-name">{l.name}</span>
                                  {showKcal && (
                                    <span className="meal-calories">
                                      {l.kcal} kcal
                                    </span>
                                  )}
                                  {showTags && l.tag && (
                                    <span className="meal-badges">
                                      {l.tag}
                                    </span>
                                  )}
                                </>
                              )}
                            </td>
                            <td>
                              {d && (
                                <>
                                  <span className="meal-name">{d.name}</span>
                                  {showKcal && (
                                    <span className="meal-calories">
                                      {d.kcal} kcal
                                    </span>
                                  )}
                                  {showTags && d.tag && (
                                    <span className="meal-badges">
                                      {d.tag}
                                    </span>
                                  )}
                                </>
                              )}
                            </td>
                            {showTotalPerDay && (
                              <td className="text-right">
                                <span className="meal-calories">
                                  {day.totalCalories}
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table className="meal-table print-table text-[11px]">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Meal 1</th>
                        <th>Meal 2</th>
                        <th>Meal 3</th>
                        <th>Meal 4</th>
                        <th>Meal 5</th>
                        {showTotalPerDay && (
                          <th className="text-right">Total kcal</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {week.map((day) => {
                        const m1 = getMealByIndex(day, 0);
                        const m2 = getMealByIndex(day, 1);
                        const m3 = getMealByIndex(day, 2);
                        const m4 = getMealByIndex(day, 3);
                        const m5 = getMealByIndex(day, 4);
                        return (
                          <tr key={day.day}>
                            <td>
                              <span className="meal-name">{day.day}</span>
                            </td>
                            {[m1, m2, m3, m4, m5].map((m, idx) => (
                              <td key={idx}>
                                {m && (
                                  <>
                                    <span className="meal-name">
                                      {m.name}
                                    </span>
                                    {showKcal && (
                                      <span className="meal-calories">
                                        {m.kcal} kcal
                                      </span>
                                    )}
                                    {showTags && m.tag && (
                                      <span className="meal-badges">
                                        {m.tag}
                                      </span>
                                    )}
                                  </>
                                )}
                              </td>
                            ))}
                            {showTotalPerDay && (
                              <td className="text-right">
                                <span className="meal-calories">
                                  {day.totalCalories}
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* PRINT-ONLY: Grocery list on its own page */}
            {includeShoppingPrint &&
              shoppingList &&
              shoppingList.length > 0 && (
                <div className="hidden print:block print:break-before-page print-frame">
                  <div className="print-header">
                    <div className="print-header-main">
                      <h2>BiteTrak Weekly Grocery List</h2>
                      <p className="print-header-sub">
                        For {displayName || "__________"} • Week of{" "}
                        {weekOf || "__________"}
                      </p>
                      <p className="print-notes">
                        Check off items as you shop. Quantities are approximate
                        and can be adjusted.
                      </p>
                    </div>
                    <div className="print-header-meta">
                      <div>
                        <strong>Plan type:</strong> {prettyDietLabel(diet)}
                      </div>
                      <div>
                        <strong>Meals/day:</strong> {numericMealsPerDay}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-800">
                    {shoppingList.map((item, idx) => (
                      <div key={idx} className="flex justify-between gap-2">
                        <span>{item.name}</span>
                        <span>
                          {item.quantity
                            ? item.quantity.toFixed(2).replace(/\.00$/, "")
                            : ""}
                          {item.unit ? ` ${item.unit}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* PRINT-ONLY: Recipes page */}
            {includeRecipesPrint && (
              <div className="hidden print:block print:break-before-page print-frame">
                <div className="print-header">
                  <div className="print-header-main">
                    <h2>BiteTrak Recipes for the Week</h2>
                    <p className="print-header-sub">
                      Ingredients and simple steps for each meal.
                    </p>
                    <p className="print-notes">
                      Use these as a guide and adjust seasonings, textures, and
                      portions to your needs.
                    </p>
                  </div>
                  <div className="print-header-meta">
                    <div>
                      <strong>Name:</strong>{" "}
                      {displayName || "____________________"}
                    </div>
                    <div>
                      <strong>Week of:</strong>{" "}
                      {weekOf || "____________________"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-[11px] text-slate-800">
                  {week.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <h3 className="text-xs font-semibold text-slate-900 border-b border-slate-300 pb-1">
                        {day.day}
                      </h3>
                      {day.meals.map((m, idx) => (
                        <div key={`${day.day}-recipe-${idx}`}>
                          <div className="font-semibold">
                            {m.label}: {m.name}
                          </div>
                          {m.recipe && m.recipe.ingredients && (
                            <div className="mt-1">
                              <div className="font-medium">Ingredients</div>
                              <ul className="list-disc list-inside">
                                {m.recipe.ingredients.map((ing, ingIdx) => (
                                  <li key={ingIdx}>
                                    {ing.name}
                                    {ing.quantity
                                      ? ` – ${ing.quantity
                                          .toFixed(2)
                                          .replace(/\.00$/, "")}`
                                      : ""}
                                    {ing.unit ? ` ${ing.unit}` : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {m.recipe && m.recipe.steps && (
                            <div className="mt-1">
                              <div className="font-medium">Steps</div>
                              <ol className="list-decimal list-inside space-y-1">
                                {m.recipe.steps.map((step, stepIdx) => (
                                  <li key={stepIdx}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
