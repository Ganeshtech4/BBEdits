'use client'
import React from 'react'
import Heading from '../../../app/utils/Heading';
import OrdersAnalytics from "../../components/Admin/Analytics/OrdersAnalytics";
import AdminShell from '../../components/Admin/AdminShell';
import AdminProtected from '@/app/hooks/adminProtected';

type Props = {}

const page = (props: Props) => {
  return (
    <AdminProtected>
      <Heading
        title="BBEdits - Orders Analytics"
        description="Track orders and revenue trends from the admin analytics panel"
        keywords="Orders,Analytics,Admin,Dashboard"
      />
      <AdminShell
        title="Orders analytics"
        description="Review order volume trends and filter time ranges from a simplified chart surface."
      >
        <OrdersAnalytics />
      </AdminShell>
    </AdminProtected>
  )
}

export default page