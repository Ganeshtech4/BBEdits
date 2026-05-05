"use client";

import {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import { Bell, CheckCheck, PanelTop, Sparkles } from "lucide-react";
import React, { FC, useEffect, useMemo, useState } from "react";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { AdminButton, AdminCard } from "./ui/admin-ui";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  title?: string;
  description?: string;
};

const DashboardHeader: FC<Props> = ({
  title = "Admin workspace",
  description = "Track performance, respond faster, and keep the admin experience focused.",
}) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] =
    useUpdateNotificationStatusMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [audio] = useState<any>(
    typeof window !== "undefined"
      ? (() => {
          try {
            const audioCtx = new (
              window.AudioContext ||
              (window as any).webkitAudioContext
            )();
            return {
              play: () => {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.value = 880;
                oscillator.type = "sine";
                gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(
                  0.01,
                  audioCtx.currentTime + 0.45
                );
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.45);
              },
            };
          } catch {
            return null;
          }
        })()
      : null
  );

  const notifications = useMemo(
    () =>
      data?.notifications?.filter((item: any) => item.status === "unread") ||
      [],
    [data]
  );

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    const handleNotification = () => {
      refetch();
      if (audio) {
        try {
          audio.play();
        } catch {
          // Notification sound is optional.
        }
      }
    };

    socketId.on("newNotification", handleNotification);
    return () => {
      socketId.off("newNotification", handleNotification);
    };
  }, [audio, refetch]);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="relative space-y-4">
      <AdminCard className="overflow-hidden p-0">
        <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),_transparent_34%)]" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Admin control room
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>

          <div className="relative flex items-center gap-3 self-start lg:self-auto">
            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950">
                <PanelTop className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Session
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Live admin view
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-cyan-500 px-1 text-[11px] font-semibold text-white shadow-lg shadow-cyan-500/40">
                {notifications.length}
              </span>
            </button>
          </div>
        </div>
      </AdminCard>

      {isOpen ? (
        <div className="absolute right-0 top-full z-30 mt-2 w-full max-w-[380px]">
          <AdminCard className="max-h-[70vh] overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
                  Notifications
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {notifications.length} unread updates
                </p>
              </div>
              {notifications.length ? (
                <AdminButton
                  variant="secondary"
                  onClick={async () => {
                    for (const item of notifications) {
                      await handleNotificationStatusChange(item._id);
                    }
                  }}
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Clear all
                </AdminButton>
              ) : null}
            </div>

            <div className="space-y-3">
              {notifications.length ? (
                notifications.map((item: any) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/70"
                    key={item._id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {item.message}
                        </p>
                      </div>
                      <button
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300"
                        onClick={() => handleNotificationStatusChange(item._id)}
                      >
                        Read
                      </button>
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                      {format(item.createdAt)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  You are all caught up.
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardHeader;
