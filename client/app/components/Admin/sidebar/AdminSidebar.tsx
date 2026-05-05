"use client";

import {
  BarChartOutlinedIcon,
  ExitToAppIcon,
  GroupsIcon,
  HomeOutlinedIcon,
  LibraryBooksIcon,
  LocalOfferIcon,
  ManageHistoryIcon,
  MapOutlinedIcon,
  OndemandVideoIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  TrendingUpIcon,
  VideoCallIcon,
  WysiwygIcon,
  FolderOpenIcon,
} from "./Icon";
import avatarDefault from "../../../../public/assests/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const menuGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", to: "/admin", icon: HomeOutlinedIcon }],
  },
  {
    label: "Core",
    items: [
      { title: "Users", to: "/admin/users", icon: GroupsIcon },
      { title: "Invoices", to: "/admin/invoices", icon: ReceiptOutlinedIcon },
      { title: "Manage Team", to: "/admin/team", icon: PeopleOutlinedIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Create Course", to: "/admin/create-course", icon: VideoCallIcon },
      { title: "Live Courses", to: "/admin/courses", icon: OndemandVideoIcon },
      { title: "Create Bundle", to: "/admin/create-bundle", icon: LibraryBooksIcon },
      { title: "All Bundles", to: "/admin/bundles", icon: LibraryBooksIcon },
      { title: "Categories", to: "/admin/categories", icon: WysiwygIcon },
      { title: "Coupons", to: "/admin/coupons", icon: LocalOfferIcon },
      { title: "Assets", to: "/admin/assets", icon: FolderOpenIcon },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Revenue", to: "/admin/revenue-analytics", icon: TrendingUpIcon },
      { title: "Course Trends", to: "/admin/courses-analytics", icon: BarChartOutlinedIcon },
      { title: "Order Trends", to: "/admin/orders-analytics", icon: MapOutlinedIcon },
      { title: "User Trends", to: "/admin/users-analytics", icon: ManageHistoryIcon },
    ],
  },
  {
    label: "Session",
    items: [{ title: "Logout", to: "/", icon: ExitToAppIcon }],
  },
];

export default function Sidebar() {
  const { user } = useSelector((state: any) => state.auth);
  const pathname = usePathname();
  const currentPath = pathname || "";

  return (
    <div className="sticky top-0 h-screen border-r border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4 lg:px-4">
        <div className="hidden rounded-[24px] border border-slate-200/70 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:block">
          <div className="flex items-center gap-3">
            <Image
              alt="profile-user"
              width={54}
              height={54}
              src={user?.avatar ? user.avatar.url : avatarDefault}
              className="h-[54px] w-[54px] rounded-2xl border border-cyan-300/60 object-cover dark:border-cyan-500/30"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-5 space-y-5">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400 lg:block">
                {group.label}
              </p>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.to === "/admin"
                      ? currentPath === item.to
                      : currentPath === item.to || currentPath.startsWith(`${item.to}/`);

                  return (
                    <Link
                      href={item.to}
                      key={item.to}
                      className={`group flex items-center justify-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 lg:justify-start ${
                        isActive
                          ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-500/20"
                          : "text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      <Icon className="!text-[20px]" />
                      <span className="hidden lg:block">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
