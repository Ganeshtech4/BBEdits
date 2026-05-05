"use client";
import React, { FC, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { Search, Plus, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useEnrollUserInCourseMutation,
  useCreateUserMutation,
} from "@/redux/features/user/userApi";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { toast } from "react-hot-toast";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
} from "../ui/admin-ui";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [open, setOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: coursesData } = useGetUsersAllCoursesQuery({});
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});
  const [enrollUser, { isSuccess: enrollSuccess, error: enrollError }] =
    useEnrollUserInCourseMutation({});
  const [createUser, { isSuccess: createSuccess, error: createError }] =
    useCreateUserMutation({});

  useEffect(() => {
    if (updateError && "data" in updateError)
      toast.error((updateError as any).data.message);
    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("Delete user successfully!");
      setOpen(false);
    }
    if (deleteError && "data" in deleteError)
      toast.error((deleteError as any).data.message);
    if (enrollSuccess) {
      refetch();
      toast.success("User enrolled in course successfully!");
      setEnrollOpen(false);
      setSelectedCourse("");
    }
    if (enrollError && "data" in enrollError)
      toast.error((enrollError as any).data.message);
    if (createSuccess) {
      refetch();
      toast.success("User created successfully!");
      setCreateUserOpen(false);
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setUserRole("user");
    }
    if (createError && "data" in createError)
      toast.error((createError as any).data.message);
  }, [updateError, isSuccess, deleteSuccess, deleteError, enrollSuccess, enrollError, createSuccess, createError]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.3 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.3 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: " ",
      headerName: "Enroll",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setEnrollOpen(true);
                setUserId(params.row.id);
              }}
            >
              <MdOutlineLibraryAdd
                className="dark:text-white text-black"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
    {
      field: "  ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setUserId(params.row.id);
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
    {
      field: "   ",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <a href={`mailto:${params.row.email}`}>
              <AiOutlineMail className="dark:text-white text-black" size={20} />
            </a>
          </>
        );
      },
    },
  ];

  const rows: any[] = [];
  if (isTeam) {
    const admins =
      data?.users?.filter((item: any) => item.role === "admin") ?? [];
    admins.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        courses: item.courses.length,
        created_at: format(item.createdAt),
      });
    });
  } else {
    data?.users?.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        courses: item.courses.length,
        created_at: format(item.createdAt),
      });
    });
  }

  const filteredRows = rows.filter(
    (row) =>
      row.name?.toLowerCase().includes(search.toLowerCase()) ||
      row.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    await updateUserRole({ email, role });
  };

  const handleDelete = async () => {
    await deleteUser(userId);
  };

  const handleEnroll = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }
    await enrollUser({ userId, courseId: selectedCourse });
  };

  const handleCreateUser = async () => {
    if (!userName || !userEmail || !userPassword) {
      toast.error("Please fill all fields");
      return;
    }
    await createUser({
      name: userName,
      email: userEmail,
      password: userPassword,
      role: userRole,
    });
  };

  const isDark = theme === "dark";

  const gridSx = {
    height: "70vh",
    border: "none",
    "& .MuiDataGrid-root": { border: "none", outline: "none" },
    "& .MuiDataGrid-sortIcon": { color: isDark ? "#94a3b8" : "#64748b" },
    "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
      color: isDark ? "#94a3b8" : "#64748b",
    },
    "& .MuiDataGrid-row": {
      color: isDark ? "#e2e8f0" : "#1e293b",
      borderBottom: isDark
        ? "1px solid #1e293b !important"
        : "1px solid #e2e8f0 !important",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: isDark ? "#0f172a" : "#f8fafc",
    },
    "& .MuiTablePagination-root": { color: isDark ? "#94a3b8" : "#64748b" },
    "& .MuiDataGrid-cell": { borderBottom: "none !important" },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: isDark ? "#0f172a" : "#f8fafc",
      borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
      color: isDark ? "#94a3b8" : "#64748b",
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: isDark ? "#020617" : "#ffffff",
    },
    "& .MuiDataGrid-footerContainer": {
      color: isDark ? "#94a3b8" : "#64748b",
      borderTop: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
      backgroundColor: isDark ? "#0f172a" : "#f8fafc",
    },
    "& .MuiCheckbox-root": {
      color: isDark ? "#38bdf8 !important" : "#0ea5e9 !important",
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
      color: "#fff !important",
    },
  };

  const modalBoxClass =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 outline-none";

  return (
    <div className="p-6 pt-5">
      {isLoading ? (
        <Loader />
      ) : (
        <AdminCard className="p-0 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-600 dark:text-cyan-300">
                {isTeam ? "Team" : "Users"}
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {isTeam ? "Team Members" : "All Users"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filteredRows.length}{" "}
                {isTeam ? "admin members" : "registered users"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <AdminInput
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              {isTeam ? (
                <AdminButton onClick={() => setActive(true)}>
                  <Plus className="h-4 w-4 mr-1.5 inline" />
                  Add Member
                </AdminButton>
              ) : (
                <AdminButton onClick={() => setCreateUserOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-1.5 inline" />
                  Add User
                </AdminButton>
              )}
            </div>
          </div>

          {/* DataGrid */}
          <Box sx={gridSx}>
            <DataGrid checkboxSelection rows={filteredRows} columns={columns} />
          </Box>
        </AdminCard>
      )}

      {/* Update Role / Add Member Modal */}
      {active && (
        <Modal open={active} onClose={() => setActive(false)}>
          <Box className={modalBoxClass}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
              Add New Member
            </h2>
            <div className="flex flex-col gap-4">
              <AdminInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email…"
              />
              <AdminSelect onChange={(e: any) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </AdminSelect>
              <AdminButton className="mt-2" onClick={handleSubmit}>
                Submit
              </AdminButton>
            </div>
          </Box>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {open && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box className={modalBoxClass}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Delete User
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <AdminButton variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </AdminButton>
              <AdminButton
                className="!bg-rose-600 !text-white hover:!bg-rose-700 dark:!bg-rose-600 dark:!text-white dark:hover:!bg-rose-700"
                onClick={handleDelete}
              >
                Delete
              </AdminButton>
            </div>
          </Box>
        </Modal>
      )}

      {/* Enroll Modal */}
      {enrollOpen && (
        <Modal
          open={enrollOpen}
          onClose={() => {
            setEnrollOpen(false);
            setSelectedCourse("");
          }}
        >
          <Box className={modalBoxClass}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
              Enroll User in Course
            </h2>
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Select Course
              </label>
              <AdminSelect
                value={selectedCourse}
                onChange={(e: any) => setSelectedCourse(e.target.value)}
              >
                <option value="">— Select a course —</option>
                {coursesData?.courses?.map((course: any) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </AdminSelect>
              <div className="flex items-center justify-end gap-3 mt-2">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setEnrollOpen(false);
                    setSelectedCourse("");
                  }}
                >
                  Cancel
                </AdminButton>
                <AdminButton onClick={handleEnroll}>Enroll</AdminButton>
              </div>
            </div>
          </Box>
        </Modal>
      )}

      {/* Create User Modal */}
      {createUserOpen && (
        <Modal
          open={createUserOpen}
          onClose={() => {
            setCreateUserOpen(false);
            setUserName("");
            setUserEmail("");
            setUserPassword("");
            setUserRole("user");
          }}
        >
          <Box className={modalBoxClass}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
              Create New User
            </h2>
            <div className="flex flex-col gap-4">
              <AdminInput
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Full name…"
              />
              <AdminInput
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email address…"
              />
              <AdminInput
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Password…"
              />
              <AdminSelect
                value={userRole}
                onChange={(e: any) => setUserRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </AdminSelect>
              <div className="flex items-center justify-end gap-3 mt-2">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setCreateUserOpen(false);
                    setUserName("");
                    setUserEmail("");
                    setUserPassword("");
                    setUserRole("user");
                  }}
                >
                  Cancel
                </AdminButton>
                <AdminButton onClick={handleCreateUser}>Create</AdminButton>
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default AllUsers;
