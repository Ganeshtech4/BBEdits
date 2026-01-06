"use client";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { styles } from "@/app/styles/style";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";
import { useGetAllCouponsQuery, useDeleteCouponMutation } from "@/redux/features/coupons/couponsApi";

type Props = {};

const AllCoupons = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [couponId, setCouponId] = useState("");
  const { data, isLoading, refetch } = useGetAllCouponsQuery({});
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = data?.coupons || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "code", headerName: "Coupon Code", flex: 0.5 },
    { field: "discount", headerName: "Discount", flex: 0.3 },
    { field: "expiresAt", headerName: "Expires At", flex: 0.5 },
    { field: "usageLimit", headerName: "Usage Limit", flex: 0.3 },
    { field: "usageCount", headerName: "Used", flex: 0.3 },
    { field: "status", headerName: "Status", flex: 0.3 },
    { field: "createdAt", headerName: "Created At", flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params: any) => {
        return (
          <>
            <Link href={`/admin/edit-coupon/${params.row.id}`}>
              <AiOutlineEdit
                className="dark:text-white text-black mr-4"
                size={20}
              />
            </Link>
            <Button
              onClick={() => {
                setOpen(true);
                setCouponId(params.row.id);
              }}
            >
              <AiOutlineDelete
                className="dark:text-white text-black"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
  ];

  const rows: any = [];

  // Mock data transformation
  coupons?.forEach((item: any) => {
    rows.push({
      id: item._id,
      code: item.code,
      discount: item.discountType === "percentage" 
        ? `${item.discountValue}%` 
        : `₹${item.discountValue}`,
      expiresAt: item.expiresAt 
        ? new Date(item.expiresAt).toLocaleDateString() 
        : "No Expiry",
      usageLimit: item.usageLimit || "Unlimited",
      usageCount: item.usageCount || 0,
      status: new Date(item.expiresAt) > new Date() ? "Active" : "Expired",
      createdAt: format(item.createdAt),
    });
  });

  const handleDelete = async () => {
    try {
      const response: any = await deleteCoupon(couponId);
      if (response.data) {
        toast.success("Coupon deleted successfully");
        refetch();
      } else if (response.error) {
        toast.error(response.error.data?.message || "Failed to delete coupon");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon");
    }
    setOpen(false);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="w-full flex justify-end mb-4">
            <Link
              href="/admin/create-coupon"
              className={`${styles.button} !w-[200px] dark:bg-[#57c7a3] dark:border dark:border-[#ffffff6c]`}
            >
              <IoMdAddCircle className="mr-2" size={20} />
              Create Coupon
            </Link>
          </div>
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: "#fff",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "#fff",
              },
              "& .MuiDataGrid-row": {
                color: "#fff",
                borderBottom: "1px solid #ffffff30!important",
              },
              "& .MuiTablePagination-root": {
                color: "#fff",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
              },
              "& .name-column--cell": {
                color: "#fff",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#3e4396",
                borderBottom: "none",
                color: "#fff",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#1F2A40",
              },
              "& .MuiDataGrid-footerContainer": {
                color: "#fff",
                borderTop: "none",
                backgroundColor: "#3e4396",
              },
              "& .MuiCheckbox-root": {
                color: "#b7ebde !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#fff !important",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this coupon?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCoupons;
