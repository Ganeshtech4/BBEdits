'use client';
import React from 'react';
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import AdminShell from '../../components/Admin/AdminShell';
import AdminAssets from '../../components/Admin/Assets/AdminAssets';

const page = () => {
  return (
    <AdminProtected>
      <Heading
        title="BBEdits - Assets"
        description="Manage downloadable digital products for your users"
        keywords="Assets,Digital Products,Downloads,Admin"
      />
      <AdminShell hideHeader>
        <AdminAssets />
      </AdminShell>
    </AdminProtected>
  );
};

export default page;
