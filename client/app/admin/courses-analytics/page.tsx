'use client'
import React from 'react'
import Heading from '../../../app/utils/Heading';
import CourseAnalytics from "../../components/Admin/Analytics/CourseAnalytics";
import AdminShell from '../../components/Admin/AdminShell';
import AdminProtected from '@/app/hooks/adminProtected';

type Props = {}

const page = (props: Props) => {
  return (
    <AdminProtected>
      <Heading
        title="BBEdits - Courses Analytics"
        description="Track course activity trends from the admin analytics panel"
        keywords="Courses,Analytics,Admin,Dashboard"
      />
      <AdminShell
        title="Courses analytics"
        description="Understand content demand with clearer bars, better spacing, and simpler filters."
      >
        <CourseAnalytics />
      </AdminShell>
    </AdminProtected>
  )
}

export default page