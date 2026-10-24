"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { Spinner } from "./ui";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);
  if (loading) return <div className="container"><Spinner /></div>;
  if (!user) return <div className="container"><Spinner label="Redirecting to login…" /></div>;
  return children;
}
