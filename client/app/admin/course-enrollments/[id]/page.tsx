"use client";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React, { use } from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import CourseEnrollments from "../../../components/Admin/Course/CourseEnrollments";

type Props = {
  params: Promise<{ id: string }>;
};

const page = ({ params }: Props) => {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams as { id: string };
  
  return (
    <div suppressHydrationWarning>
      <AdminProtected>
        <Heading
          title="BBEdits - Admin"
          description="BBEdits is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <CourseEnrollments courseId={id} />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
