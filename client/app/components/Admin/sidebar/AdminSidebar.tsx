"use client";
import { FC, useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
  LocalOfferIcon,
} from "./Icon";
import avatarDefault from "../../../../public/assests/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
  isCollapsed: boolean;
}

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  return (
    <Link href={to} passHref>
      <div
        className={`flex items-center p-2 my-1 rounded-md cursor-pointer transition-colors duration-200 ${selected === title
            ? "text-[#6870fa]"
            : "text-black dark:text-[#ffffffc1] hover:text-[#868dfb]"
          }`}
        onClick={() => setSelected(title)}
      >
        <div className="flex items-center justify-center min-w-[40px]">{icon}</div>
        {!isCollapsed && (
          <Typography className="!text-[16px] !font-Poppins ml-2">{title}</Typography>
        )}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setlogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    setlogout(true);
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"
            }`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
          opacity: 1,
        },
        "& .pro-menu-item": {
          color: `${theme !== "dark" && "#000"}`,
        },
      }}
      className="!bg-white dark:bg-[#111C43] h-screen sticky top-0 left-0 z-[9999]"
      style={{
        width: isCollapsed ? "80px" : "250px",
        transition: "width 0.3s",
      }}
    >
      <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex justify-between items-center p-4">
          {!isCollapsed && (
            <Link href="/" className="block">
              <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                BBEdits
              </h3>
            </Link>
          )}
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ArrowForwardIosIcon className="text-black dark:text-[#ffffffc1]" /> : <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />}
          </IconButton>
        </div>

        {!isCollapsed && (
          <Box mb="25px">
            <Box display="flex" justifyContent="center" alignItems="center">
              <Image
                alt="profile-user"
                width={100}
                height={100}
                src={user.avatar ? user.avatar.url : avatarDefault}
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  border: "3px solid #5b6fe6",
                }}
              />
            </Box>
            <Box textAlign="center">
              <Typography
                variant="h4"
                className="!text-[20px] text-black dark:text-[#ffffffc1]"
                sx={{ m: "10px 0 0 0" }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{ m: "10px 0 0 0" }}
                className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
              >
                - {user?.role}
              </Typography>
            </Box>
          </Box>
        )}

        <Box paddingLeft={isCollapsed ? undefined : "10%"}>
          <Item
            title="Dashboard"
            to="/admin"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Typography
            variant="h5"
            sx={{ m: "15px 0 5px 20px" }}
            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
          >
            {!isCollapsed && "Data"}
          </Typography>
          <Item
            title="Users"
            to="/admin/users"
            icon={<GroupsIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Item
            title="Invoices"
            to="/admin/invoices"
            icon={<ReceiptOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Typography
            variant="h5"
            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!isCollapsed && "Content"}
          </Typography>
          <Item
            title="Create Course"
            to="/admin/create-course"
            icon={<VideoCallIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Live Courses"
            to="/admin/courses"
            icon={<OndemandVideoIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Typography
            variant="h5"
            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!isCollapsed && "Customization"}
          </Typography>
          <Item
            title="Categories"
            to="/admin/categories"
            icon={<WysiwygIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Coupons"
            to="/admin/coupons"
            icon={<LocalOfferIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Typography
            variant="h5"
            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!isCollapsed && "Controllers"}
          </Typography>
          <Item
            title="Manage Team"
            to="/admin/team"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Typography
            variant="h6"
            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!isCollapsed && "Analytics"}
          </Typography>
          <Item
            title="Courses Analytics"
            to="/admin/courses-analytics"
            icon={<BarChartOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />
          <Item
            title="Orders Analytics"
            to="/admin/orders-analytics"
            icon={<MapOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Item
            title="Users Analytics"
            to="/admin/users-analytics"
            icon={<ManageHistoryIcon />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={isCollapsed}
          />

          <Typography
            variant="h6"
            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            sx={{ m: "15px 0 5px 20px" }}
          >
            {!isCollapsed && "Extras"}
          </Typography>
          <div onClick={logoutHandler}>
            <Item
              title="Logout"
              to="/"
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
          </div>
        </Box>
      </div>
    </Box>
  );
};

export default Sidebar;
