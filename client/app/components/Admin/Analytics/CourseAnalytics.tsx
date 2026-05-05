import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
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

const CourseAnalytics = () => {
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

  const { data, isLoading, refetch } = useGetCoursesAnalyticsQuery(
    useCustomRange && dateRange.startDate && dateRange.endDate
      ? dateRange
      : {}
  );

  const dataSource = data?.courses?.customRange || data?.courses?.last12Months || [];
  const xLabels: string[] = dataSource.map((item: any) => item.name || item.month);
  const yCounts: number[] = dataSource.map((item: any) => item.count);

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
    <AdminCard className="min-h-[680px]">
      <AdminSectionIntro
        eyebrow="Course demand"
        title="Courses analytics"
        description={
          useCustomRange
            ? "Course activity grouped by your selected custom range."
            : "A simplified view of course activity across the last 12 months."
        }
      />

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

      <div className="h-[470px]">
        <BarChart
          xAxis={[{ scaleType: "band", data: xLabels, tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 } }]}
          yAxis={[{ tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 } }]}
          series={[
            {
              data: yCounts,
              color: "#22c55e",
              label: "Courses",
            },
          ]}
          height={470}
          margin={{ top: 16, right: 16, left: 40, bottom: 40 }}
          sx={chartSx}
          grid={{ horizontal: true }}
          borderRadius={10}
        />
      </div>
    </AdminCard>
  );
};

export default CourseAnalytics;
