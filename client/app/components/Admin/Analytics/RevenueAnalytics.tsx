"use client";
import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Loader from "../../Loader/Loader";
import { useGetRevenueAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSectionIntro,
  AdminSelect,
} from "../ui/admin-ui";

const LABEL_COLOR = "#cbd5e1";

const chartSx = {
  "& .MuiChartsAxis-tickLabel": { fill: `${LABEL_COLOR} !important`, fontSize: "11px !important" },
  "& .MuiChartsAxis-line": { stroke: "rgba(148,163,184,0.2)" },
  "& .MuiChartsAxis-tick": { stroke: "rgba(148,163,184,0.2)" },
  "& .MuiChartsGrid-line": { stroke: "rgba(148,163,184,0.1)" },
  "& .MuiChartsLegend-label": { fill: `${LABEL_COLOR} !important` },
  "& .MuiChartsLegend-mark": { rx: 4 },
};

type Preset = "today" | "week" | "month" | "year" | "last_year" | "custom" | "";

const PRESETS: { label: string; value: Preset }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Last Year", value: "last_year" },
  { label: "Custom", value: "custom" },
];

type Props = {
  isDashboard?: boolean;
};

export default function RevenueAnalytics({ isDashboard }: Props) {
  const [preset, setPreset] = useState<Preset>("");
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
    groupBy: "month",
  });
  const [pendingCustom, setPendingCustom] = useState({
    startDate: "",
    endDate: "",
    groupBy: "month",
  });

  // Build query args
  const queryArgs = (() => {
    if (preset && preset !== "custom") return { period: preset };
    if (
      preset === "custom" &&
      customRange.startDate &&
      customRange.endDate
    ) {
      return {
        startDate: customRange.startDate,
        endDate: customRange.endDate,
        groupBy: customRange.groupBy,
      };
    }
    return {};
  })();

  const { data, isLoading, isFetching } = useGetRevenueAnalyticsQuery(queryArgs);

  const revenueData: { period: string; revenue: number; orders: number }[] =
    data?.revenue?.data || [];
  const totalRevenue: number = data?.revenue?.totalRevenue || 0;
  const totalOrders: number = data?.revenue?.totalOrders || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const xLabels = revenueData.map((r) => r.period);
  const yRevenue = revenueData.map((r) => r.revenue);

  const handlePreset = (p: Preset) => {
    setPreset(p);
  };

  const handleApplyCustom = () => {
    if (pendingCustom.startDate && pendingCustom.endDate) {
      setCustomRange({ ...pendingCustom });
      setPreset("custom");
    }
  };

  const handleReset = () => {
    setPreset("");
    setCustomRange({ startDate: "", endDate: "", groupBy: "month" });
    setPendingCustom({ startDate: "", endDate: "", groupBy: "month" });
  };

  const activePresetLabel =
    PRESETS.find((p) => p.value === preset)?.label || "Last 12 months";

  const loading = isLoading || isFetching;

  if (isLoading) return <Loader />;

  return (
    <AdminCard className={isDashboard ? "h-[420px]" : "min-h-[680px]"}>
      <AdminSectionIntro
        eyebrow="Revenue pulse"
        title="Revenue analytics"
        description={
          isDashboard
            ? "Earnings at a glance for the current reporting window."
            : "Track earnings by day, month, year, or any custom range."
        }
        action={
          !isDashboard && totalRevenue > 0 ? (
            <div className="flex gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                  Total revenue
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                  ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Orders
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {totalOrders}
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-right dark:border-cyan-500/20 dark:bg-cyan-500/10">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
                  Avg. order
                </p>
                <p className="mt-1 text-lg font-semibold text-cyan-700 dark:text-cyan-200">
                  ₹{avgOrderValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ) : null
        }
      />

      {!isDashboard ? (
        <div className="mb-6 space-y-4">
          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePreset(p.value)}
                className={`rounded-2xl border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                  preset === p.value
                    ? "border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
            {preset ? (
              <button
                onClick={handleReset}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Reset
              </button>
            ) : null}
          </div>

          {/* Custom range picker */}
          {preset === "custom" && (
            <div className="grid gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Start date
                </label>
                <AdminInput
                  type="date"
                  value={pendingCustom.startDate}
                  onChange={(e) =>
                    setPendingCustom({ ...pendingCustom, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  End date
                </label>
                <AdminInput
                  type="date"
                  value={pendingCustom.endDate}
                  onChange={(e) =>
                    setPendingCustom({ ...pendingCustom, endDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Group by
                </label>
                <AdminSelect
                  value={pendingCustom.groupBy}
                  onChange={(e) =>
                    setPendingCustom({ ...pendingCustom, groupBy: e.target.value })
                  }
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </AdminSelect>
              </div>
              <div className="flex items-end">
                <AdminButton className="w-full" onClick={handleApplyCustom}>
                  Apply
                </AdminButton>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Summary row for dashboard */}
      {isDashboard && totalRevenue > 0 ? (
        <div className="mb-4 flex gap-3">
          <div className="flex-1 rounded-2xl bg-emerald-50 px-3 py-2 dark:bg-emerald-500/10">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Revenue</p>
            <p className="mt-0.5 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
              ₹{totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 dark:bg-slate-900/60">
            <p className="text-xs text-slate-500">Orders</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {totalOrders}
            </p>
          </div>
        </div>
      ) : null}

      {/* Chart */}
      <div className={isDashboard ? "h-[260px]" : "h-[420px]"}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          </div>
        ) : revenueData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No revenue data for{" "}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {activePresetLabel.toLowerCase()}
              </span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Try a different time period
            </p>
          </div>
        ) : (
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: xLabels,
                tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 },
                valueFormatter: (v: number) =>
                  v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`,
              },
            ]}
            series={[
              {
                data: yRevenue,
                color: "#f59e0b",
                label: "Revenue (₹)",
              },
            ]}
            height={isDashboard ? 260 : 420}
            margin={{ top: 16, right: 16, left: 54, bottom: 40 }}
            sx={chartSx}
            grid={{ horizontal: true }}
            borderRadius={8}
          />
        )}
      </div>
    </AdminCard>
  );
}
