"use client";
import React from "react";

export default function ProgressRail({ modules = [] }) {
  const total = modules.reduce((acc, m) => acc + (m.total || 0), 0);
  const done = modules.reduce((acc, m) => acc + (m.completed || 0), 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <nav className="progress-rail" aria-label="Module progress">
      <div className="progress-rail-track" aria-hidden>
        <div className={"progress-rail-fill" + (pct === 100 ? " progress-rail-fill--complete" : "")} />
      </div>
      <div className="progress-rail-meta">{pct}%</div>
    </nav>
  );
}
