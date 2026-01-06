import { styles } from "@/app/styles/style";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";

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

  const analyticsData: any = [];
  let totalRevenue = 0;

  if (data) {
    const dataSource = data.orders.customRange || data.orders.last12Months;
    dataSource.forEach((item: any) => {
      analyticsData.push({ name: item.name || item.month, Count: item.count });
    });
    totalRevenue = data.orders.totalRevenue || 0;
  }

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
        <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
          <div
            className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"}
          >
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Orders Analytics
            </h1>
            {!isDashboard && (
              <>
                <p className={`${styles.label} px-5`}>
                  {useCustomRange ? "Custom date range analytics" : "Last 12 months analytics data"}
                </p>

                {/* Revenue Display */}
                {useCustomRange && totalRevenue > 0 && (
                  <div className="px-5 mt-3">
                    <div className="inline-block bg-[#3faf82] text-white px-6 py-3 rounded-lg shadow-md">
                      <p className="text-sm opacity-90">Total Revenue</p>
                      <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                )}

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
              </>
            )}
          </div>
          <div
            className={`w-full ${
              !isDashboard ? "h-[60%]" : "h-full"
            } flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={isDashboard ? "100%" : "80%"}
            >
              <LineChart
                width={500}
                height={300}
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
