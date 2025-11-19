import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

// Tell Next this page is dynamic so it doesn't try to fully pre-render it
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm text-slate-600">Loading planner…</p>
        </section>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
