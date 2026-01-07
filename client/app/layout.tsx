"use client";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import React, { FC, useEffect } from "react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import socketIO from "socket.io-client";
import Head from "next/head";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Head>
        <title>BBEdits - Professional Video Editing Learning Platform</title>
        <meta name="description" content="Learn professional video editing with BBEdits LMS. Master Adobe Premiere Pro, After Effects, DaVinci Resolve and more." />
        <link rel="icon" href="/images/anil-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/anil-logo.png" />
        <meta property="og:title" content="BBEdits - Professional Video Editing Courses" />
        <meta property="og:description" content="Learn professional video editing with expert instructors" />
        <meta property="og:image" content="https://bbedits.in/images/anil-logo.png" />
        <meta property="og:url" content="https://bbedits.in" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BBEdits - Professional Video Editing Courses" />
        <meta name="twitter:description" content="Learn professional video editing with expert instructors" />
        <meta name="twitter:image" content="https://bbedits.in/images/anil-logo.png" />
      </Head>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>
                <div>{children}</div>
              </Custom>
              <Toaster position="top-center" reverseOrder={false} />
            </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const Custom: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    socketId.on("connection", () => { });
  }, []);

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <>{isLoading ? <Loader /> : <div suppressHydrationWarning>{children}</div>}</>;
};
