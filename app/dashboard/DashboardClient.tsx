"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Meal = {
  label: string;
  name: string;
  kcal: number;
  tag: string;
};

type DayPlan = {
  day: string;
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
  const searchParams = useSearchParams();

  const initialCalories = searchParams.get("calories") ?? "2100";
  const initialDiet = searchParams.get("diet") ?? "balanced";
  const initialIbs = searchParams.get("ibsSafe");
  const initialGluten = searchParams.get("glutenFree");
  const initialImmune = searchParams.get("immuneSafe");
  const initialMealsPerDayParam = searchParams.get("mealsPerDay");
  const initialName = searchParams.get("name");
  const initialWeekOf = searchParams.get("weekOf");

  const [calories, setCalories] = useState(initialCalories);
  const [diet, setDiet] = useState(initialDiet);
  const [ibsSafe, setIbsSafe] = useState(
    initialIbs === null ? true : initialIbs === "true"
  );
  const [glutenFree, setGlutenFree] = useState(initialGluten === "true");
  const [immuneSafe, setImmuneSafe] = useState(initialImmune === "true");
  const [mealsPerDay, setMealsPerDay] = useState(
    initialMealsPerDayParam === "5" ? "5" : "3"
  ); // "3" or "5"

  // Column visibility options (dashboard + print)
  const [showKcal, setShowKcal] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [showTotalPerDay, setShowTotalPerDay] = useState(true);

  // Print details: Name + Week of
  const [displayName, setDisplayName] = useState(initialName ?? "");
  const [weekOf, setWeekOf] = useState(initialWeekOf ?? "");

  // Remember name across visits in this browser
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("bitetrakDisplayName");
    // only override if query didn’t supply a name
    if (stored && !initialName) setDisplayName(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (displayName) {
      window.localStorage.setItem("bitetrakDisplayName", displayName);
    }
  }, [displayName]);

  const [week, setWeek] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flagLabels: string[] = [];
  if (ibsSafe) flagLabels.push("IBS-safe");
  if (glutenFree) flagLabels.push("Gluten-free");
  if (immuneSafe) flagLabels.push("Immune-conscious");
  const flagSummary =
    flagLabels.length > 0 ? flagLabels.join(" • ") : "General plan";

  async function handleGenerate(e?: React.FormEvent) {
    if (e) e.preventDefault();
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
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = (await res.json()) as ApiResponse;
      setWeek(data.week);
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

  const numericMealsPerDay = Number(mealsPerDay) || 3;

  return (
    <section className="dashboard-page max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="no-print mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-1">
          BiteTrak Planner (prototype)
        </h1>
        <p className="text-sm text-slate-600">
          Set your preferences, generate a mock week, then print it for your
          fridge or save as a PDF.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* LEFT: SETTINGS FORM */}
        <form
          className="no-print md:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-soft-lg p-5 space-y-4"
          onSubmit={handleGenerate}
        >
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Planner settings
          </h2>

          {/* Calories */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Daily calorie goal
            </label>
            <input
              type="number"
              min={1000}
              max={4500}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-btBlue focus:border-btBlue"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Leave as 2100 if you&apos;re not sure yet.
            </p>
          </div>

          {/* Diet style */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diet style
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-btBlue focus:border-btBlue"
            >
              <option value="balanced">Balanced</option>
              <option value="high-protein">High-protein</option>
              <option value="keto">Keto / low carb</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="low-fodmap">Low-FODMAP focus</option>
            </select>
          </div>

          {/* Meals per day */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meals per day
            </label>
            <select
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-btBlue focus:border-btBlue"
            >
              <option value="3">3 meals (classic)</option>
              <option value="5">5 smaller meals</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              5 meals = smaller portions spread across the day.
            </p>
          </div>

          {/* Safety flags */}
          <div>
            <p className="block text-xs font-semibold text-slate-700 mb-1">
              Medical / safety needs
            </p>
            <div className="space-y-1.5 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ibsSafe}
                  onChange={(e) => setIbsSafe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-btBlue focus:ring-btBlue"
                />
                <span>IBS / low-FODMAP–aware</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={glutenFree}
                  onChange={(e) => setGlutenFree(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-btBlue focus:ring-btBlue"
                />
                <span>Gluten-free planning</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={immuneSafe}
                  onChange={(e) => setImmuneSafe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-btBlue focus:ring-btBlue"
                />
                <span>Immune-compromised / neutropenic-safe focus</span>
              </label>
            </div>
          </div>

          {/* Print details: Name + Week of */}
          <div>
            <p className="block text-xs font-semibold text-slate-700 mb-1">
              Print details
            </p>
            <div className="space-y-2 text-sm text-slate-700">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Name (shown on printout)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Mike"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-btBlue focus:border-btBlue"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Week of
                </label>
                <input
                  type="text"
                  value={weekOf}
                  onChange={(e) => setWeekOf(e.target.value)}
                  placeholder="e.g., Feb 24 – Mar 2"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-btBlue focus:border-btBlue"
                />
              </div>
            </div>
          </div>

          {/* Column / field visibility */}
          <div>
            <p className="block text-xs font-semibold text-slate-700 mb-1">
              Columns to show (dashboard + print)
            </p>
            <div className="space-y-1.5 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showKcal}
                  onChange={(e) => setShowKcal(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-btBlue focus:ring-btBlue"
                />
                <span>Show kcal for each meal</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showTags}
                  onChange={(e) => setShowTags(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-btBlue focus:ring-btBlue"
                />
                <span>Show diet / safety tags</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showTotalPerDay}
                  onChange={(e) => setShowTotalPerDay(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-btBlue focus:ring-btBlue"
                />
                <span>Show total kcal per day</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-btBlue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-btBlue/30 hover:bg-btBlueDark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate week"}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Print / Save as PDF
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-600 mt-2">Error: {error}</p>
          )}
        </form>

        {/* RIGHT: WEEK VIEW */}
        <div className="md:col-span-2">
          {!week && (
            <div className="border border-dashed border-slate-300 rounded-3xl p-6 text-sm text-slate-500 bg-slate-50">
              Choose your settings on the left and click{" "}
              <span className="font-semibold">Generate week</span> to see a
              mock plan here.
            </div>
          )}

          {week && (
            <div className="print-frame bg-white rounded-3xl border border-slate-200 shadow-soft-lg p-4 sm:p-5">
              {/* Planner header (on screen + print) */}
              <div className="print-header flex items-end justify-between gap-4 border-b border-slate-200 pb-2 mb-3">
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
                <div className="print-notes text-[10px] text-slate-400 text-right">
                  Name: {displayName || "____________________"}
                  <br />
                  Week of: {weekOf || "____________________"}
                </div>
              </div>

              {/* Screen view: cards grid */}
              <div className="screen-week grid md:grid-cols-3 gap-4">
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
                      {day.meals.map((m) => (
                        <div
                          key={m.label}
                          className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
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
                            {showTags && (
                              <span className="text-[11px] text-emerald-600">
                                {m.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Print-only table view: specialized for 3 vs 5 meals */}
              <div className="print-only hidden mt-3">
                {numericMealsPerDay === 3 ? (
                  // 3-meal layout: one row per day with B/L/D columns
                  <table className="w-full print-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Breakfast</th>
                        <th>Lunch</th>
                        <th>Dinner</th>
                        {showTotalPerDay && <th>Total kcal</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {week.map((day) => {
                        const b = getMealByLabel(day, "Breakfast");
                        const l = getMealByLabel(day, "Lunch");
                        const d = getMealByLabel(day, "Dinner");
                        return (
                          <tr key={day.day}>
                            <td>{day.day}</td>
                            <td>
                              {b && (
                                <>
                                  <div className="font-semibold">{b.name}</div>
                                  {showKcal && <div>{b.kcal} kcal</div>}
                                  {showTags && <div>{b.tag}</div>}
                                </>
                              )}
                            </td>
                            <td>
                              {l && (
                                <>
                                  <div className="font-semibold">{l.name}</div>
                                  {showKcal && <div>{l.kcal} kcal</div>}
                                  {showTags && <div>{l.tag}</div>}
                                </>
                              )}
                            </td>
                            <td>
                              {d && (
                                <>
                                  <div className="font-semibold">{d.name}</div>
                                  {showKcal && <div>{d.kcal} kcal</div>}
                                  {showTags && <div>{d.tag}</div>}
                                </>
                              )}
                            </td>
                            {showTotalPerDay && <td>{day.totalCalories}</td>}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  // 5-meal layout: one row per day, Meal 1–5 columns
                  <table className="w-full print-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Meal 1</th>
                        <th>Meal 2</th>
                        <th>Meal 3</th>
                        <th>Meal 4</th>
                        <th>Meal 5</th>
                        {showTotalPerDay && <th>Total kcal</th>}
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
                            <td>{day.day}</td>
                            {[m1, m2, m3, m4, m5].map((m, idx) => (
                              <td key={idx}>
                                {m && (
                                  <>
                                    <div className="font-semibold">
                                      {m.name}
                                    </div>
                                    {showKcal && (
                                      <div>{m.kcal} kcal</div>
                                    )}
                                    {showTags && <div>{m.tag}</div>}
                                  </>
                                )}
                              </td>
                            ))}
                            {showTotalPerDay && <td>{day.totalCalories}</td>}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
