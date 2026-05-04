"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { styles } from "@/app/styles/style";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";
import { useGetAdminAllBundlesQuery, useDeleteBundleMutation } from "@/redux/features/bundles/bundlesApi";
import { useTheme } from "next-themes";

const AllBundles = () => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetAdminAllBundlesQuery({});
  const [deleteBundle] = useDeleteBundleMutation();
  const [open, setOpen] = useState(false);
  const [bundleId, setBundleId] = useState("");

  const bundles = data?.bundles || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.4 },
    { field: "name", headerName: "Bundle Name", flex: 1 },
    {
      field: "courses",
      headerName: "Courses",
      flex: 0.5,
      renderCell: (params: any) => (
        <span className="text-purple-400 font-medium">{params.value} course{params.value !== 1 ? "s" : ""}</span>
      ),
    },
    {
      field: "price",
      headerName: "Price (₹)",
      flex: 0.4,
      renderCell: (params: any) => <span>₹{params.value}</span>,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      renderCell: (params: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            params.value === "Live"
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    { field: "purchased", headerName: "Purchased", flex: 0.4 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.3,
      renderCell: (params: any) => (
        <Link href={`/admin/edit-bundle/${params.row.id}`}>
          <FiEdit2 className="dark:text-white text-black" size={20} />
        </Link>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.3,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpen(true);
            setBundleId(params.row.id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" size={20} />
        </Button>
      ),
    },
  ];

  const rows = bundles.map((b: any) => ({
    id: b._id,
    name: b.name,
    courses: b.courses?.length || 0,
    price: b.price,
    status: b.isActive ? "Live" : "Draft",
    purchased: b.purchased || 0,
  }));

  const handleDelete = async () => {
    const res: any = await deleteBundle(bundleId);
    if (res.data) {
      toast.success("Bundle deleted");
      setOpen(false);
      refetch();
    } else {
      toast.error(res.error?.data?.message || "Failed to delete bundle");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mt-[120px] mx-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white text-black">Course Bundles</h1>
        <Link
          href="/admin/create-bundle"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <IoMdAddCircle size={18} />
          Create Bundle
        </Link>
      </div>

      <Box
        m="0"
        sx={{
          "& .MuiDataGrid-root": { border: "none", outline: "none" },
          "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
            color: theme === "dark" ? "#fff" : "#000",
          },
          "& .MuiDataGrid-sortIcon": {
            color: theme === "dark" ? "#fff" : "#000",
          },
          "& .MuiDataGrid-row": {
            color: theme === "dark" ? "#fff" : "#000",
            borderBottom: theme === "dark" ? "1px solid #ffffff30!important" : "1px solid #ccc!important",
          },
          "& .MuiTablePagination-root": { color: theme === "dark" ? "#fff" : "#000" },
          "& .MuiDataGrid-cell": { borderBottom: "none!important" },
          "& .name-column--cell": { color: theme === "dark" ? "#fff" : "#000" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
            borderBottom: "none",
            color: theme === "dark" ? "#fff" : "#000",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
          },
          "& .MuiDataGrid-footerContainer": {
            color: theme === "dark" ? "#fff" : "#000",
            borderTop: "none",
            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
          },
          "& .MuiCheckbox-root": { color: theme === "dark" ? "#b7ebde!important" : "#000!important" },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "#fff!important",
          },
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </Box>

      {/* Confirm Delete Modal */}
      {open && (
        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="delete-bundle-modal">
          <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 outline-none">
            <h1 className={`${styles.title} text-center`}>Delete Bundle?</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">
              This action cannot be undone. Users who purchased this bundle will keep their course access.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-2 rounded-lg border border-white/20 text-gray-700 dark:text-white hover:bg-white/10 transition-colors"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default AllBundles;
