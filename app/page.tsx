"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [calories, setCalories] = useState("");
  const [diet, setDiet] = useState("balanced");
  const [ibsSafe, setIbsSafe] = useState(true);
  const [glutenFree, setGlutenFree] = useState(false);
  const [immuneSafe, setImmuneSafe] = useState(false);

  function handleOnboardingSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (calories) params.set("calories", calories);
    if (diet) params.set("diet", diet);
    params.set("ibsSafe", String(ibsSafe));
    params.set("glutenFree", String(glutenFree));
    params.set("immuneSafe", String(immuneSafe));

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-slate-50" id="top">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              AI-powered food planning for real dietary needs
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-5">
              Eat Better.
              <br />
              Plan Smarter.
              <br />
              Live Healthier.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mb-7">
              BiteTrak builds personalized food plans around your calorie goals,
              dietary preferences, and medical restrictions like IBS,
              low-FODMAP, gluten-free, or immune-compromised diets.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <a
                id="get-started"
                href="#onboarding"
                className="inline-flex items-center justify-center rounded-full bg-btBlue px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-btBlue/30 hover:bg-btBlueDark transition-colors"
              >
                Get started
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                View pricing
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                IBS &amp; low-FODMAP aware
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Immune-safe options
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Restaurant-friendly planning
              </div>
            </div>
          </div>

          {/* Visual mock card */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-soft-lg p-4 sm:p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    This Week
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Planner overview
                  </h2>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Balanced • 2,100 kcal
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-xs mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (d, i) => (
                    <span
                      key={d}
                      className={`text-center ${
                        i === 0
                          ? "font-semibold text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {d}
                    </span>
                  )
                )}
              </div>

              <div className="grid gap-3 mb-4">
                {[
                  {
                    label: "Breakfast",
                    name: "IBS-Safe Overnight Oats",
                    kcal: "380 kcal",
                    tag: "Low-FODMAP",
                  },
                  {
                    label: "Lunch",
                    name: "Turkey Quinoa Bowl",
                    kcal: "520 kcal",
                    tag: "Immune-safe",
                  },
                  {
                    label: "Dinner",
                    name: "Grilled Salmon & Greens",
                    kcal: "610 kcal",
                    tag: "GF • High-Protein",
                  },
                ].map((m, idx) => (
                  <div
                    key={m.label}
                    className={`flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2 ${
                      idx === 0 ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {m.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {m.name}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-medium text-slate-800">{m.kcal}</p>
                      <p className="text-emerald-600">{m.tag}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                {/* Nutrient ring mock */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-[6px] border-slate-200" />
                    <div className="absolute inset-0 rounded-full border-[6px] border-btBlue border-t-transparent border-l-transparent border-r-btMint rotate-45" />
                    <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-800">
                        20%
                        <br />
                        Protein
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 mb-1">
                      Today’s macros
                    </p>
                    <p className="text-slate-500">
                      Balanced mix of protein, complex carbs, and healthy fats.
                    </p>
                  </div>
                </div>

                {/* Grocery list mock */}
                <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3">
                  <p className="text-xs font-semibold text-slate-800 mb-2">
                    This week’s grocery list
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {[
                      "Bananas",
                      "Greek yogurt (lactose-free)",
                      "Quinoa",
                      "Chicken breast",
                      "Broccoli",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-between"
                      >
                        <span>{item}</span>
                        <span className="text-emerald-600 font-medium">✓</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            {/* mini overlay card removed */}
          </div>
        </div>
      </section>

      {/* ONBOARDING FORM THAT SENDS YOU TO DASHBOARD */}
      <section
        id="onboarding"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14"
      >
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <form
            className="bg-white rounded-3xl border border-slate-200 shadow-soft-lg p-5 space-y-4"
            onSubmit={handleOnboardingSubmit}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
              Tell BiteTrak how you eat
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              We’ll take these settings into the planner so you can generate a
              full week view.
            </p>

            {/* Calories */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily calorie goal
              </label>
              <input
                type="number"
                min={1000}
                max={4500}
                placeholder="2100"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-btBlue focus:border-btBlue"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                You can leave this blank and we&apos;ll assume ~2,100 kcal.
              </p>
            </div>

            {/* Diet */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diet style
              </label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-btBlue focus:border-btBlue"
              >
                <option value="balanced">Balanced (default)</option>
                <option value="high-protein">High-protein</option>
                <option value="keto">Keto / very low carb</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="low-fodmap">Low-FODMAP focus</option>
              </select>
            </div>

            {/* Restrictions */}
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

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-btBlue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-btBlue/30 hover:bg-btBlueDark transition-colors"
            >
              Continue to planner
            </button>
          </form>

          {/* Simple static explainer on the right */}
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-slate-50 rounded-3xl p-4 sm:p-6 shadow-soft-lg">
              <p className="text-xs uppercase tracking-wide text-emerald-400 mb-1">
                What happens next
              </p>
              <h3 className="text-lg font-semibold mb-2">
                See your week at a glance
              </h3>
              <p className="text-sm text-slate-200 mb-4">
                On the dashboard, you&apos;ll generate a mock 7-day plan that
                respects your calorie goal and safety flags. Later this is where
                AI and real nutrition data will plug in.
              </p>
              <p className="text-xs text-slate-400">
                For now, it&apos;s a prototype—but already something you can
                print and put on the fridge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <hr className="border-slate-200" />
      </div>

      {/* WHY SECTION */}
      <section id="why" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Why people choose BiteTrak
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Medical-aligned plans",
              desc: "IBS-safe, gluten-free, immune-neutral, low-FODMAP, GERD-friendly, and more.",
              icon: "🩺",
            },
            {
              title: "Realistic meals",
              desc: "Simple foods you actually want to cook or order—not diet fantasy meals.",
              icon: "🍲",
            },
            {
              title: "Weekly grocery list",
              desc: "Automatically builds your week’s ingredients in a clean list you can print.",
              icon: "🛒",
            },
            {
              title: "Print-ready layouts",
              desc: "Weekly grid, grocery list, and recipes in clean, fridge-friendly views.",
              icon: "🖨️",
            },
            {
              title: "Personalized calories",
              desc: "Distributes calories intelligently across 3 or 5 meals per day.",
              icon: "🔥",
            },
            {
              title: "Future: AI engine",
              desc: "Plans based on real nutrition data and your medical restrictions.",
              icon: "🤖",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-lg"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="text-sm font-semibold text-slate-900">
                {item.title}
              </p>
              <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
      >
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          What you can do with BiteTrak today
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-lg">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Plan your entire week
            </p>
            <p className="text-sm text-slate-600 mb-3">
              Set your diet style, calorie target, and safety flags—then see a full 7-day grid.
            </p>
            <p className="text-xs text-slate-500">
              Start from the homepage, then fine-tune everything on the dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-lg">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Generate a grocery list
            </p>
            <p className="text-sm text-slate-600 mb-3">
              BiteTrak can roll up your week into a single, clean grocery list.
            </p>
            <p className="text-xs text-slate-500">
              Perfect for a single weekly shop or ordering delivery.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-lg">
            <p className="text-sm font-semibold text-slate-900 mb-1">
              Print & share
            </p>
            <p className="text-sm text-slate-600 mb-3">
              Print your weekly grid, grocery list, and recipes on separate pages.
            </p>
            <p className="text-xs text-slate-500">
              Designed to look good on a fridge, clipboard, or clinic binder.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        id="pricing"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
      >
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Pricing
        </h2>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft-lg max-w-lg">
          <p className="text-5xl font-bold text-slate-900">$0</p>
          <p className="text-slate-600 mt-1 mb-4">Free during early access</p>

          <ul className="text-sm text-slate-700 space-y-2 mb-6">
            <li>✔ Weekly meal planning</li>
            <li>✔ Grocery list generator</li>
            <li>✔ Recipe view</li>
            <li>✔ IBS / GF / immune-safe filters</li>
            <li>✔ Print-ready export</li>
          </ul>

          <a
            href="#onboarding"
            className="inline-flex items-center justify-center rounded-full bg-btBlue px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-btBlue/30 hover:bg-btBlueDark transition-colors"
          >
            Start free now
          </a>
        </div>
      </section>
    </>
  );
}
