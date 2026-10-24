"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";

export default function NavBar() {
  const { user, logout, loading } = useAuth();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthPage = path === "/login" || path === "/signup" || path === "/forgot" || path === "/reset";

  if (isAuthPage || user) return null;

  return (
    <header className={"topbar" + (scrolled ? " scrolled" : "")}>
      <Link href="/" className="brand">Aurum</Link>
      <nav>
        <Link href="/login">Log in</Link>
        <Link className="btn btn-sm" href="/signup">Get started</Link>
      </nav>
    </header>
  );
}
