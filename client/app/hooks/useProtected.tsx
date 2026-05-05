'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import React from "react";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);
  const { isLoading } = useLoadUserQuery({});
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.replace("/");
    }
  }, [mounted, isLoading, user]);

  if (!mounted || isLoading) return null;
  if (!user) return null;
  return <>{children}</>;
}