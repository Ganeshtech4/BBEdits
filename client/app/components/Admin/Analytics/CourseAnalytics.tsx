import React, { useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  LabelList,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { styles } from "@/app/styles/style";

type Props = {};

const CourseAnalytics = (props: Props) => {
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

  const analyticsData: any = [];

  if (data) {
    const dataSource = data.courses.customRange || data.courses.last12Months;
    dataSource.forEach((item: any) => {
      analyticsData.push({ name: item.month, uv: item.count });
    });
  }

  const minValue = 0;

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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              {useCustomRange ? "Custom date range analytics" : "Last 12 months analytics data"}
            </p>

            {/* Date Range Filter */}
            <div className="px-5 mt-5 flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm text-black dark:text-white block mb-1">
                  Group By
                </label>
                <select
                  value={dateRange.groupBy}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, groupBy: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
              <button
                onClick={handleApplyFilter}
                className="px-6 py-2 bg-[#3faf82] text-white rounded hover:bg-[#2d8f68]"
              >
                Apply Filter
              </button>
              {useCustomRange && (
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="w-full h-[75%] flex items-center justify-center">
            <ResponsiveContainer width="90%" height="70%">
              <BarChart width={150} height={300} data={analyticsData}>
                <XAxis dataKey="name">
                  <Label offset={0} position="insideBottom" />
                </XAxis>
                <YAxis domain={[minValue, "auto"]} />
                <Bar dataKey="uv" fill="#3faf82">
                  <LabelList dataKey="uv" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
