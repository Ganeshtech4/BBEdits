'use client'
import React from 'react'
import Heading from '../../../app/utils/Heading';
import RevenueAnalytics from "../../components/Admin/Analytics/RevenueAnalytics";
import AdminShell from '../../components/Admin/AdminShell';
import AdminProtected from '@/app/hooks/adminProtected';

type Props = {}

const page = (props: Props) => {
  return (
    <AdminProtected>
      <Heading
        title="BBEdits - Revenue Analytics"
        description="Track revenue earned per day, week, month, year, or custom date range"
        keywords="Revenue,Analytics,Admin,Earnings,Dashboard"
      />
      <AdminShell
        title="Revenue analytics"
        description="Understand your earnings across any time window — today, this month, last year, or a custom range."
      >
        <RevenueAnalytics />
      </AdminShell>
    </AdminProtected>
  )
}

export default page
