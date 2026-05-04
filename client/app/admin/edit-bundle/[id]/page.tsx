'use client'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React, { use } from 'react'
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar"
import CreateBundle from "../../../components/Admin/Bundles/CreateBundle"
import { useGetAdminAllBundlesQuery } from "@/redux/features/bundles/bundlesApi"
import Loader from "@/app/components/Loader/Loader"

type Props = {}

const EditBundlePage = ({ params }: any) => {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams as { id: string }
  const { data, isLoading } = useGetAdminAllBundlesQuery({})

  const bundle = data?.bundles?.find((b: any) => b._id === id)

  return (
    <div>
      <AdminProtected>
        <Heading
          title="BBEdits - Admin"
          description="BBEdits is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex h-screen" suppressHydrationWarning>
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            {isLoading ? (
              <Loader />
            ) : (
              <CreateBundle editData={bundle} />
            )}
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default EditBundlePage
