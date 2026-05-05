"use client";
import React from "react";
import Heading from "../utils/Heading";
import AdminProtected from "../hooks/adminProtected";
import AdminShell from "../components/Admin/AdminShell";
import DashboardWidgets from "../components/Admin/Widgets/DashboardWidgets";

type Props = {};

const page = (props: Props) => {
  return (
    <AdminProtected>
      <Heading
        title="BBEdits - Admin"
        description="BBEdits is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,Redux,Machine Learning"
      />
      <AdminShell
        title="Dashboard overview"
        description="A cleaner command center for bundles, courses, orders, and user growth."
      >
        <DashboardWidgets />
      </AdminShell>
    </AdminProtected>
  );
};

export default page;
