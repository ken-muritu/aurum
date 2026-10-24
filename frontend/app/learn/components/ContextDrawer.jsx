"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function ContextDrawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open ? <div className="drawer-backdrop" onClick={onClose} aria-hidden /> : null}
      <aside className={["context-drawer", open ? "is-open" : ""].filter(Boolean).join(" ")} aria-hidden={!open}>
        <div className="drawer-header between">
          <span className="sr-only">Workbench</span>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}
