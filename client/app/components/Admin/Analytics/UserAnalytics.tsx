import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import Loader from "../../Loader/Loader";
import { AdminCard, AdminSectionIntro } from "../ui/admin-ui";

type Props = {
  isDashboard?: boolean;
};

const LABEL_COLOR = "#cbd5e1";

const chartSx = {
  "& .MuiChartsAxis-tickLabel": { fill: `${LABEL_COLOR} !important`, fontSize: "11px !important" },
  "& .MuiChartsAxis-line": { stroke: "rgba(148,163,184,0.2)" },
  "& .MuiChartsAxis-tick": { stroke: "rgba(148,163,184,0.2)" },
  "& .MuiChartsGrid-line": { stroke: "rgba(148,163,184,0.1)" },
  "& .MuiAreaElement-root": { fillOpacity: 0.22 },
  "& .MuiChartsLegend-label": { fill: `${LABEL_COLOR} !important` },
  "& .MuiChartsLegend-mark": { rx: 4 },
};

const UserAnalytics = ({ isDashboard }: Props) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery({});

  const months = data?.users?.last12Months?.map((item: any) => item.month) ?? [];
  const counts = data?.users?.last12Months?.map((item: any) => item.count) ?? [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AdminCard className={isDashboard ? "h-[420px]" : "min-h-[620px]"}>
      <AdminSectionIntro
        eyebrow="User growth"
        title="Users analytics"
        description={
          isDashboard
            ? "Monthly user acquisition at a glance."
            : "A cleaner 12-month view of user growth and account momentum."
        }
      />

      <LineChart
        xAxis={[{ scaleType: "point", data: months, tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 } }]}
        yAxis={[{ tickLabelStyle: { fill: LABEL_COLOR, fontSize: 11 } }]}
        series={[
          {
            data: counts,
            area: true,
            color: "#0ea5e9",
            label: "Users",
            showMark: false,
          },
        ]}
        height={isDashboard ? 300 : 460}
        margin={{ top: 16, right: 16, left: 40, bottom: 40 }}
        sx={chartSx}
        grid={{ horizontal: true }}
      />
    </AdminCard>
  );
};

export default UserAnalytics;
