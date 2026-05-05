'use client'
import React from 'react'
import Heading from '../../utils/Heading';
import UserAnalytics from '../../../app/components/Admin/Analytics/UserAnalytics';
import AdminShell from '../../components/Admin/AdminShell';
import AdminProtected from '@/app/hooks/adminProtected';

type Props = {}

const page = (props: Props) => {
  return (
    <AdminProtected>
      <Heading
        title="BBEdits - Users Analytics"
        description="Track user growth trends from the admin analytics panel"
        keywords="Users,Analytics,Admin,Dashboard"
      />
      <AdminShell
        title="Users analytics"
        description="Monitor user growth with a cleaner chart treatment and a more legible admin theme."
      >
        <UserAnalytics />
      </AdminShell>
    </AdminProtected>
  )
}

export default page