'use client'
import React, { use } from 'react'
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from '../../../../app/utils/Heading';
import DashboardHeader from '../../../../app/components/Admin/DashboardHeader';
import EditCourse from "../../../components/Admin/Course/EditCourse";

type Props = {}

const page = ({params}:any) => {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams as { id: string };

  return (
    <div>
        <Heading
         title="BBEdits - Admin"
         description="BBEdits is a platform for students to learn and get help from teachers"
         keywords="Prograaming,MERN,Redux,Machine Learning"
        />
        <div className="flex" suppressHydrationWarning>
            <div className="1500px:w-[16%] w-1/5">
                <AdminSidebar />
            </div>
            <div className="w-[85%]">
               <DashboardHeader />
               <EditCourse id={id} />
            </div>
        </div>
    </div>
  )
}

export default page