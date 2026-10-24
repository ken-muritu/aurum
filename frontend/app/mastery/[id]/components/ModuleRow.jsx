"use client";
import React, { useState } from "react";
import Button from "../../../../components/Button";
import CompletionPill from "./CompletionPill";
import Progress from "../../../../components/Progress";

export default function ModuleRow({
  title,
  lessons = [],
  expanded: controlledExpanded,
  onToggle,
  onCompleteLesson,
  onUpdateLesson,
  onCompleteModule,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const expanded = typeof controlledExpanded === "boolean" ? controlledExpanded : internalOpen;
  const toggle = typeof onToggle === "function" ? onToggle : (v) => setInternalOpen(typeof v === "boolean" ? v : !internalOpen);
  const completed = lessons.filter((l) => l.completed).length;
  const allDone = lessons.length > 0 && completed === lessons.length;
  const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;

  return (
    <div className={"module-row" + (allDone ? " module-row--done" : "")}>
      <div className="module-header between row">
        <div>
          <span className="module-row-title">{title}</span>
          <span className="muted small">{completed}/{lessons.length}</span>
        </div>
        <div className="row">
          {!allDone && onCompleteModule ? (
            <Button variant="ghost" size="sm" onClick={onCompleteModule} type="button">Complete module</Button>
          ) : null}
          <CompletionPill done={allDone} />
        </div>
      </div>
      <div className="module-progress"><Progress percent={pct} /></div>
      <button className={"module-toggle " + (expanded ? "is-open" : "")} onClick={() => toggle(!expanded)} aria-expanded={expanded} type="button">
        {expanded ? "Hide lessons" : "Show lessons"}
      </button>
      {expanded ? (
        <div className="lesson-list">
          {lessons.map((l) => (
            <div key={l.id} className={"lesson-row" + (l.completed ? " lesson-row--done" : "")}>
              <button className="lesson-row-main" type="button" onClick={() => onUpdateLesson?.(l.id, { expanded: !l.expanded })}>
                <span className="lesson-row-title">{l.title}</span>
                <span className="muted small">{l.duration || ""}</span>
                <span className="muted small">{l.resourceType || ""}</span>
                <span className="lesson-row-chevron" aria-hidden>›</span>
              </button>
              {l.expanded ? (
                <div className="lesson-detail">
                  <div className="lesson-detail-section">
                    <h4>Resources</h4>
                    <p className="muted small">{l.resources?.length ? l.resources.join(", ") : "No resources listed."}</p>
                  </div>
                  <div className="lesson-detail-section">
                    <h4>Notes</h4>
                    <p className="muted small">{l.notes?.length ? l.notes.join("; ") : "No notes yet."}</p>
                  </div>
                  <div className="lesson-detail-section">
                    <h4>Practice</h4>
                    <p className="muted small">{l.practice?.length ? l.practice.join("; ") : "No practice tasks yet."}</p>
                  </div>
                  <div className="lesson-detail-actions">
                    {!l.completed ? (
                      <Button variant="primary" size="sm" onClick={() => onCompleteLesson?.(l.id)} type="button">Complete lesson</Button>
                    ) : (
                      <span className="pill pill-done" aria-hidden>Completed</span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
