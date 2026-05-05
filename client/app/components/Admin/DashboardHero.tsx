import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardWidgets from "../../components/Admin/Widgets/DashboardWidgets";

type Props = {
  isDashboard?: boolean;
  title?: string;
  description?: string;
};

const DashboardHero = ({
  isDashboard,
  title = "Admin workspace",
  description = "Keep your operations, content, and analytics aligned from a cleaner interface.",
}: Props) => {
  return (
    <div className="space-y-6">
      <DashboardHeader title={title} description={description} />
      {isDashboard ? <DashboardWidgets /> : null}
    </div>
  );
};

export default DashboardHero;
