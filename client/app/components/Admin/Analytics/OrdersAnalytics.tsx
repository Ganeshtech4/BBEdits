import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Loader from "../../Loader/Loader";
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

type Props = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({ isDashboard }: Props) {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
    groupBy: string;
  }>({
    startDate: "",
    endDate: "",
    groupBy: "day",
  });
  const [useCustomRange, setUseCustomRange] = useState(false);

  const { data, isLoading, refetch } = useGetOrdersAnalyticsQuery(
    useCustomRange && dateRange.startDate && dateRange.endDate
      ? dateRange
      : {}
  );

  const dataSource = data?.orders?.customRange || data?.orders?.last12Months || [];
  const xLabels: string[] = dataSource.map((item: any) => item.name || item.month);
  const yCounts: number[] = dataSource.map((item: any) => item.count);
  const totalRevenue = data?.orders?.totalRevenue || 0;

  const handleApplyFilter = () => {
    if (dateRange.startDate && dateRange.endDate) {
      setUseCustomRange(true);
      refetch();
    }
  };

  const handleReset = () => {
    setUseCustomRange(false);
    setDateRange({ startDate: "", endDate: "", groupBy: "day" });
    refetch();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AdminCard className={isDashboard ? "h-[420px]" : "min-h-[680px]"}>
      <AdminSectionIntro
        eyebrow="Sales pulse"
        title="Orders analytics"
        description={
          isDashboard
            ? "Clean order momentum for the current reporting window."
            : useCustomRange
              ? "Custom range analytics with a simplified filter bar."
              : "A clearer view of order flow over the last 12 months."
        }
        action={
          !isDashboard && totalRevenue > 0 ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                Total revenue
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                ₹{totalRevenue.toFixed(2)}
              </p>
            </div>
          ) : null
        }
      />

      {!isDashboard ? (
        <div className="mb-6 grid gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Start date
            </label>
            <AdminInput
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              End date
            </label>
            <AdminInput
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Group by
            </label>
            <AdminSelect
              value={dateRange.groupBy}
              onChange={(e) =>
                setDateRange({ ...dateRange, groupBy: e.target.value })
              }
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </AdminSelect>
          </div>
          <div className="flex items-end gap-3">
            <AdminButton className="flex-1" onClick={handleApplyFilter}>
              Apply filter
            </AdminButton>
            {useCustomRange ? (
              <AdminButton
                variant="secondary"
                className="flex-1"
                onClick={handleReset}
              >
                Reset
              </AdminButton>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={isDashboard ? "h-[300px]" : "h-[470px]"}>
        <LineChart
          xAxis={[{ scaleType: "point", data: xLabels, tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 } }]}
          yAxis={[{ tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 } }]}
          series={[
            {
              data: yCounts,
              color: "#14b8a6",
              label: "Orders",
              showMark: false,
            },
          ]}
          height={isDashboard ? 300 : 470}
          margin={{ top: 16, right: 16, left: 40, bottom: 40 }}
          sx={chartSx}
          grid={{ horizontal: true }}
        />
      </div>
    </AdminCard>
  );
}
