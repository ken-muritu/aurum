"use client";
import React from "react";
import Button from "../../../../components/Button";
import { Play, BookOpen } from "lucide-react";

export default function CurrentFocus({ lesson, onOpen, onWatch, onRead }) {
  return (
    <div className="current-focus stack">
      <div className="current-focus-header between row">
        <div>
          <p className="muted">Current Focus</p>
          <h3>{lesson?.title || "Pick a lesson to begin"}</h3>
        </div>
        <div className="row">
          {onRead ? (
            <Button variant="secondary" size="sm" onClick={onRead} type="button"><BookOpen size={16} /> Read</Button>
          ) : null}
          <Button variant="primary" size="sm" onClick={onWatch ?? onOpen} type="button"><Play size={16} /> Watch</Button>
        </div>
      </div>
      <div className="current-focus-meta muted small">{lesson?.resourceType || ""} · {lesson?.duration || ""}</div>
    </div>
  );
}
