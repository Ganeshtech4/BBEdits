import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme } = useTheme();
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );
        const course = coursesData?.courses.find(
          (course: any) => course._id === item.courseId
        );
        return {
          ...item,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "₹" + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: any = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.7 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.45 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created", flex: 0.55 }]
      : [
          {
            field: " ",
            headerName: "Email",
            flex: 0.2,
            renderCell: (params: any) => {
              return (
                <a href={`mailto:${params.row.userEmail}`}>
                  <AiOutlineMail
                    className="dark:text-white text-black"
                    size={20}
                  />
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any = [];

  orderData?.forEach((item: any) => {
    rows.push({
      id: item._id,
      userName: item.userName,
      userEmail: item.userEmail,
      title: item.title,
      price: item.price,
      created_at: format(item.createdAt),
    });
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div className={isDashboard ? "mt-0" : "mt-[120px]"}>
      <Box m={isDashboard ? "0" : "40px"}>
        <Box
          m={isDashboard ? "0" : "40px 0 0 0"}
          height={isDashboard ? "420px" : "90vh"}
          overflow={"hidden"}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            },
            "& .MuiDataGrid-sortIcon": {
              color: theme === "dark" ? "#e2e8f0" : "#0f172a",
            },
            "& .MuiDataGrid-row": {
              color: theme === "dark" ? "#e2e8f0" : "#0f172a",
              borderBottom:
                theme === "dark"
                  ? "1px solid rgba(51,65,85,0.65)!important"
                  : "1px solid rgba(226,232,240,0.9)!important",
            },
            "& .MuiTablePagination-root": {
              color: theme === "dark" ? "#e2e8f0" : "#0f172a",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none!important",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor:
                theme === "dark" ? "rgba(15,23,42,0.92)" : "rgba(241,245,249,0.95)",
              borderBottom: "none",
              color: theme === "dark" ? "#f8fafc" : "#0f172a",
              borderRadius: 16,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme === "dark" ? "transparent" : "transparent",
            },
            "& .MuiDataGrid-footerContainer": {
              color: theme === "dark" ? "#e2e8f0" : "#0f172a",
              borderTop: "none",
              backgroundColor:
                theme === "dark" ? "rgba(15,23,42,0.92)" : "rgba(241,245,249,0.95)",
            },
            "& .MuiCheckbox-root": {
              color:
                theme === "dark" ? `#67e8f9 !important` : `#0f172a !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme === "dark" ? "#e2e8f0" : "#334155"} !important`,
            },
          }}
        >
          <DataGrid
            checkboxSelection={isDashboard ? false : true}
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            components={isDashboard ? {} : { Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default AllInvoices;
