"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./sidebar/AdminSidebar";
import DashboardHeader from "./DashboardHeader";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "next-themes";

type Props = {
  title?: string;
  description?: string;
  hideHeader?: boolean;
  children: React.ReactNode;
};

export default function AdminShell({
  title = "Admin workspace",
  description = "Manage courses, orders, users, and performance from a cleaner control center.",
  hideHeader = false,
  children,
}: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Use consistent "light" default until mounted to prevent hydration mismatch.
  // next-themes returns undefined during SSR; client reads localStorage.
  const mode = mounted && resolvedTheme === "dark" ? "dark" : "light";

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#020617" : "#f8fafc",
            paper: mode === "dark" ? "#0f172a" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f1f5f9" : "#0f172a",
            secondary: mode === "dark" ? "#94a3b8" : "#475569",
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: { backgroundImage: "none" },
            },
          },
        },
      }),
    [mode]
  );

  if (!mounted) return null;

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <div suppressHydrationWarning className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.10),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.16),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_50%,_#020617_100%)]">
        <div className="mx-auto flex min-h-screen max-w-[1680px]">
          <aside className="w-[88px] shrink-0 lg:w-[280px]">
            <AdminSidebar />
          </aside>

          <div className="min-w-0 flex-1 px-3 pb-8 pt-3 sm:px-5 lg:px-8 lg:pt-6">
            {!hideHeader && <DashboardHeader title={title} description={description} />}
            <main className={hideHeader ? "" : "mt-6"}>{children}</main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
