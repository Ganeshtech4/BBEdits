"use client";
import React, { useEffect, useState, useRef } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal, TextField } from "@mui/material";
import { AiOutlineDelete, AiOutlineUserAdd, AiOutlineDownload, AiOutlineUpload } from "react-icons/ai";
import { styles } from "@/app/styles/style";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { 
  useGetCourseEnrollmentsQuery, 
  useRemoveUserFromCourseMutation 
} from "@/redux/features/courses/coursesApi";
import { useEnrollUserInCourseMutation } from "@/redux/features/user/userApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import axios from "axios";

type Props = {
  courseId: string;
};

const CourseEnrollments = ({ courseId }: Props) => {
  const [open, setOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading, data, refetch } = useGetCourseEnrollmentsQuery(courseId, {
    refetchOnMountOrArgChange: true,
  });
  const { data: allUsersData } = useGetAllUsersQuery({});
  const [removeUser, { isSuccess: removeSuccess, error: removeError }] = 
    useRemoveUserFromCourseMutation();
  const [enrollUser, { isSuccess: enrollSuccess, error: enrollError }] = 
    useEnrollUserInCourseMutation();

  useEffect(() => {
    if (removeSuccess) {
      setOpen(false);
      refetch();
      toast.success("User removed from course successfully");
    }
    if (removeError) {
      if ("data" in removeError) {
        const errorMessage = removeError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [removeSuccess, removeError, refetch]);

  useEffect(() => {
    if (enrollSuccess) {
      setEnrollOpen(false);
      refetch();
      toast.success("User enrolled successfully");
    }
    if (enrollError) {
      if ("data" in enrollError) {
        const errorMessage = enrollError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [enrollSuccess, enrollError, refetch]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.7 },
    { field: "purchaseDate", headerName: "Purchase Date", flex: 0.5 },
    { field: "purchaseTime", headerName: "Purchase Time", flex: 0.4 },
    { field: "orderId", headerName: "Order ID", flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Button
            onClick={() => {
              setOpen(true);
              setUserId(params.row.userId);
            }}
          >
            <AiOutlineDelete
              className="dark:text-white text-black"
              size={20}
            />
          </Button>
        );
      },
    },
  ];

  const rows: any = [];

  // Safely get enrollments data
  const enrollments = data?.enrollments || [];

  // Filter enrollments based on search text
  const filteredEnrollments = enrollments.filter((enrollment: any) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      enrollment.user?.name?.toLowerCase().includes(searchLower) ||
      enrollment.user?.email?.toLowerCase().includes(searchLower) ||
      (enrollment.orderId && enrollment.orderId.toString().toLowerCase().includes(searchLower))
    );
  });

  filteredEnrollments.forEach((enrollment: any, index: number) => {
    const purchaseDate = new Date(enrollment.enrolledAt);
    // Use consistent date formatting to avoid hydration mismatch
    const year = purchaseDate.getFullYear();
    const month = String(purchaseDate.getMonth() + 1).padStart(2, '0');
    const day = String(purchaseDate.getDate()).padStart(2, '0');
    const hours = String(purchaseDate.getHours()).padStart(2, '0');
    const minutes = String(purchaseDate.getMinutes()).padStart(2, '0');
    const seconds = String(purchaseDate.getSeconds()).padStart(2, '0');
    
    rows.push({
      id: index + 1,
      userId: enrollment.user._id,
      name: enrollment.user.name,
      email: enrollment.user.email,
      purchaseDate: `${year}-${month}-${day}`,
      purchaseTime: `${hours}:${minutes}:${seconds}`,
      orderId: enrollment.orderId || "Admin Enrolled",
    });
  });

  const handleRemove = async () => {
    await removeUser({ userId, courseId });
  };

  const handleEnroll = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }
    
    if (!courseId) {
      toast.error("Course ID is missing");
      return;
    }
    
    await enrollUser({ userId: selectedUser, courseId });
    setSelectedUser("");
  };

  // Get users who are not already enrolled
  const availableUsers = allUsersData?.users?.filter((user: any) => 
    !data?.enrollments?.some((enrollment: any) => enrollment.user._id === user._id)
  );

  // Export enrolled users as CSV
  const handleExport = () => {
    if (!enrollments.length) {
      toast.error("No enrollments to export");
      return;
    }

    const csvHeaders = "Name,Email,Purchase Date,Order ID\n";
    const csvData = enrollments
      .map((enrollment: any) => {
        const date = new Date(enrollment.enrolledAt).toLocaleDateString();
        return `"${enrollment.user.name}","${enrollment.user.email}","${date}","${enrollment.orderId || "Admin Enrolled"}"`;
      })
      .join("\n");

    const blob = new Blob([csvHeaders + csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `course-enrollments-${courseId}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Enrollments exported successfully");
  };

  // Handle import file selection
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Process CSV/Excel file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "csv" && fileExtension !== "xlsx" && fileExtension !== "xls") {
      toast.error("Please upload a CSV or Excel file");
      return;
    }

    setSelectedFile(file);
    setImportOpen(true);
  };

  // Import and enroll users from CSV
  const handleBulkImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("courseId", courseId);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/bulk-enroll-users`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(
          `Successfully enrolled ${response.data.enrolled} users. ${
            response.data.created > 0 ? `Created ${response.data.created} new users.` : ""
          }`
        );
        refetch();
        setImportOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to import users");
    } finally {
      setImporting(false);
    }
  };

  const handleImportClose = () => {
    setImportOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className={`${styles.title} !text-[25px] dark:text-white text-black`}>
                {data?.courseName || "Course"} - Enrollments
              </h1>
              <p className="dark:text-[#ffffffab] text-[#000000ab] text-[18px] mt-2">
                Total Enrolled: {enrollments.length || 0} {searchText && filteredEnrollments.length !== enrollments.length && `(showing ${filteredEnrollments.length})`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-Poppins transition-colors duration-200"
              >
                <AiOutlineDownload className="mr-2" size={20} />
                Export
              </button>
              <button
                onClick={handleImportClick}
                className="flex items-center px-4 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-Poppins transition-colors duration-200"
              >
                <AiOutlineUpload className="mr-2" size={20} />
                Import
              </button>
              <button
                onClick={() => setEnrollOpen(true)}
                className="flex items-center px-4 py-3 rounded bg-[#37a39a] hover:bg-[#2d8d85] text-white font-Poppins transition-colors duration-200"
              >
                <AiOutlineUserAdd className="mr-2" size={20} />
                Add User
              </button>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          {/* Search Bar */}
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name, email, or order ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  "& fieldset": {
                    borderColor: "#00000030",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00000050",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#37a39a",
                  },
                  ".dark &": {
                    "& fieldset": {
                      borderColor: "#ffffff30",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ffffff50",
                    },
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#000",
                  ".dark &": {
                    color: "#fff",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#00000060",
                  opacity: 1,
                  ".dark &": {
                    color: "#ffffff60",
                  },
                },
              }}
            />
          </Box>

          <Box
            m="40px 0 0 0"
            height="65vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: "inherit",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "inherit",
              },
              "& .MuiDataGrid-row": {
                color: "inherit",
                borderBottom: "1px solid #ffffff30!important",
                "&.MuiDataGrid-row": {
                  borderBottom: "1px solid rgba(0,0,0,0.1)!important",
                },
                ".dark &": {
                  color: "#fff",
                  borderBottom: "1px solid #ffffff30!important",
                },
              },
              "& .MuiTablePagination-root": {
                color: "#000",
                ".dark &": {
                  color: "#fff",
                },
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
                color: "#000",
                ".dark &": {
                  color: "#fff",
                },
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#3e4396",
                borderBottom: "none",
                color: "#fff",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "#f5f5f5",
                ".dark &": {
                  backgroundColor: "#1F2A40",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: "#3e4396",
                color: "#fff",
              },
              "& .MuiCheckbox-root": {
                color: "#b7ebde !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#fff !important",
              },
              "& .MuiSvgIcon-root": {
                color: "#000",
                ".dark &": {
                  color: "#fff",
                },
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>

          {/* Remove User Modal */}
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to remove this user from the course?
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
                    onClick={handleRemove}
                  >
                    Remove
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {/* Enroll User Modal */}
          {enrollOpen && (
            <Modal
              open={enrollOpen}
              onClose={() => setEnrollOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title} !text-[20px] mb-4`}>
                  Add User to Course
                </h1>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className={`${styles.input} mb-4 bg-transparent dark:bg-transparent`}
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-black dark:text-white">Select a user</option>
                  {availableUsers?.map((user: any) => (
                    <option key={user._id} value={user._id} className="bg-white dark:bg-slate-900 text-black dark:text-white">
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                    onClick={() => setEnrollOpen(false)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#37a39a]`}
                    onClick={handleEnroll}
                  >
                    Enroll
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {/* Bulk Import Modal */}
          {importOpen && (
            <Modal
              open={importOpen}
              onClose={() => !importing && setImportOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[550px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-6 outline-none">
                <h1 className={`${styles.title} !text-[22px] mb-4 dark:text-white text-black`}>
                  Bulk Import Users
                </h1>
                <div className="mb-4">
                  <p className="text-sm dark:text-gray-300 text-gray-600 mb-3">
                    Upload a CSV or Excel file with email addresses to enroll users in bulk.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 mb-3">
                    <p className="text-sm dark:text-blue-200 text-blue-800 font-semibold mb-2">
                      📋 File Format Instructions:
                    </p>
                    <ul className="text-xs dark:text-blue-300 text-blue-700 list-disc list-inside space-y-1">
                      <li>Required column: <strong>email</strong></li>
                      <li>Optional columns: <strong>name</strong></li>
                      <li>Example: email,name</li>
                      <li>New users will be created automatically</li>
                      <li>Random 8-character passwords will be sent via email</li>
                      <li>Existing users will be enrolled directly</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                    <p className="text-xs dark:text-yellow-200 text-yellow-800">
                      ⚠️ <strong>Note:</strong> Users already enrolled in this course will be skipped.
                    </p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-sm dark:text-green-200 text-green-800">
                      Selected file: <strong>{selectedFile.name}</strong>
                    </p>
                  </div>
                )}
                <div className="flex w-full items-center justify-between mt-6">
                  <button
                    onClick={handleImportClose}
                    disabled={importing}
                    className="px-6 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white font-Poppins transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkImport}
                    disabled={importing}
                    className="px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-Poppins transition-colors duration-200 disabled:opacity-50"
                  >
                    {importing ? "Processing..." : "Import & Enroll"}
                  </button>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default CourseEnrollments;
