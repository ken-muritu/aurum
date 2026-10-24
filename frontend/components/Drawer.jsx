"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({ open, onClose, children, size = "md", className = "" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open ? <div className="drawer-backdrop" onClick={onClose} aria-hidden /> : null}
      <aside className={["drawer-panel", open ? "is-open" : "", size === "sm" ? "drawer-sm" : "", className].filter(Boolean).join(" ")} aria-hidden={!open}>
        <button type="button" className="drawer-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}
