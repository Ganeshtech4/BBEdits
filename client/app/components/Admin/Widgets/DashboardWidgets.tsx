import React, { FC } from "react";
import { IndianRupee, ShoppingCart, TrendingUp, Users } from "lucide-react";
import UserAnalytics from "../Analytics/UserAnalytics";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import { AdminCard, AdminMetricCard, AdminSectionIntro } from "../ui/admin-ui";

type Props = {};

const compactNumber = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatGrowth = (current = 0, previous = 0) => {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

const DashboardWidgets: FC<Props> = () => {
  const { data } = useGetUsersAnalyticsQuery({});
  const { data: ordersData } = useGetOrdersAnalyticsQuery({});

  const userMonths = data?.users?.last12Months || [];
  const orderMonths = ordersData?.orders?.last12Months || [];

  const currentUsers = userMonths[userMonths.length - 1]?.count || 0;
  const previousUsers = userMonths[userMonths.length - 2]?.count || 0;
  const currentOrders = orderMonths[orderMonths.length - 1]?.count || 0;
  const previousOrders = orderMonths[orderMonths.length - 2]?.count || 0;
  const totalRevenue = ordersData?.orders?.totalRevenue || 0;
  const userGrowth = formatGrowth(currentUsers, previousUsers);
  const orderGrowth = formatGrowth(currentOrders, previousOrders);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="New users"
          value={compactNumber.format(currentUsers)}
          delta={userGrowth}
          helper="Most recent reporting month"
          icon={Users}
          tone="indigo"
        />
        <AdminMetricCard
          label="Orders closed"
          value={compactNumber.format(currentOrders)}
          delta={orderGrowth}
          helper="Orders in the latest period"
          icon={ShoppingCart}
          tone="emerald"
        />
        <AdminMetricCard
          label="Revenue tracked"
          value={`₹${compactNumber.format(totalRevenue)}`}
          helper="Across the available analytics window"
          icon={IndianRupee}
          tone="amber"
        />
        <AdminMetricCard
          label="Momentum"
          value={orderGrowth >= 0 ? "Rising" : "Cooling"}
          delta={orderGrowth}
          helper="Order trend versus previous period"
          icon={TrendingUp}
          tone="rose"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <UserAnalytics isDashboard={true} />
        <OrdersAnalytics isDashboard={true} />
      </div>

      <AdminCard className="overflow-hidden">
        <AdminSectionIntro
          eyebrow="Transactions"
          title="Recent orders"
          description="A simplified stream of the latest purchase activity for quick admin review."
        />
        <AllInvoices isDashboard={true} />
      </AdminCard>
    </div>
  );
};

export default DashboardWidgets;
