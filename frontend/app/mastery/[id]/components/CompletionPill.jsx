"use client";
import React from "react";

export default function CompletionPill({ done = false }) {
  return (
    <span className={["pill", done ? "pill-done" : "pill"].filter(Boolean).join(" ")} aria-hidden>
      {done ? "Done" : "Open"}
    </span>
  );
}
