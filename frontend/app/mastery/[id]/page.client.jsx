"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Sparkles, BookOpen } from "lucide-react";
import Button from "../../../components/Button";
import Tabs from "../../../components/Tabs";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import ProgressRail from "./components/ProgressRail";
import ModuleRow from "./components/ModuleRow";
import CurrentFocus from "./components/CurrentFocus";
import CompletionPill from "./components/CompletionPill";

export default function MasteryClient({ params }) {
  const masteryId = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/masteries/${masteryId}/`)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText || "Failed to load mastery");
        return r.json();
      })
      .then((json) => {
        if (!cancelled) { setData(json); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelled) { setError(err.message || "Something went wrong"); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [masteryId]);

  const modules = data?.modules || [];
  const activeLesson = modules[0]?.lessons?.[0] || null;
  const [draft, setDraft] = useState(data);

  useEffect(() => { setDraft(data); }, [data]);

  if (loading) {
    return (
      <div className="container mastery">
        <div className="mastery-header between row">
          <button className="btn btn-ghost btn-sm" type="button">Back</button>
          <div className="skeleton mastery-header-skeleton" />
          <div className="skeleton mastery-header-skeleton-sm" />
        </div>
        <div className="mastery-body">
          <div className="mastery-main"><div className="skeleton" /><div className="skeleton" /></div>
          <aside className="mastery-rail"><div className="skeleton" /></aside>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mastery">
        <ErrorState title={error} action={<Button variant="ghost" onClick={() => window.location.reload()} type="button">Retry</Button>} />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="container mastery">
        <EmptyState icon={<Sparkles />} message="We couldn't find that mastery." action={<Button variant="primary" onClick={() => { window.location.href = "/learn"; }} type="button">Go to Learn</Button>} />
      </div>
    );
  }
  return (
    <div className={"container mastery" + (focusMode ? " mastery--focus" : "")}>
      <div className="mastery-header between row">
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => { window.location.href = "/learn"; }}><ChevronLeft size={16} /> Learn</button>
        <div className="mastery-title">{data.title}</div>
        <Button variant="ghost" size="sm">Use this Mastery</Button>
      </div>
      <div className="mastery-body">
        <div className="mastery-main">
          <CurrentFocus lesson={activeLesson} onRead={() => setFocusMode(true)} />
          <Tabs tabs={[{ id: "modules", label: "Modules" }, { id: "resources", label: "Resources" }]} active="modules" onChange={() => {}} />
          <div className="mastery-modules">
            {modules.map((m) => (
              <ModuleRow
                key={m.id}
                title={m.title}
                lessons={m.lessons.map((l) => ({ ...l, expanded: !!expanded[l.id] }))}
                expanded={!!expanded[m.id]}
                onToggle={(v) => setExpanded((s) => ({ ...s, [m.id]: typeof v === "boolean" ? v : !s[m.id] }))}
                onCompleteLesson={(lessonId) => {
                  const updated = optimisticUpdate(data, m.id, lessonId, { completed: true });
                  setData(updated);
                }}
                onUpdateLesson={(lessonId, patch) => {
                  const mod = draft?.modules?.find((x) => x.id === m.id);
                  const lessons = mod?.lessons?.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)) || [];
                  const updated = { ...draft, modules: draft.modules.map((x) => (x.id === m.id ? { ...x, lessons } : x)) };
                  setDraft(updated);
                  setData(updated);
                }}
                onCompleteModule={() => {
                  const updated = { ...data, modules: data.modules.map((x) => (x.id === m.id ? { ...x, lessons: x.lessons.map((l) => ({ ...l, completed: true })) } : x)) };
                  setData(updated);
                }}
              />
            ))}
            {modules.length === 0 ? <EmptyState icon={null} message="No modules yet." action={<Button variant="primary" type="button">Add your first module</Button>} /> : null}
          </div>
        </div>
        <aside className="mastery-rail">
          <ProgressRail modules={modules.map((m) => ({ id: m.id, title: m.title, completed: m.lessons.filter((l) => l.completed).length, total: m.lessons.length }))} />
        </aside>
      </div>
    </div>
  );
}

function optimisticUpdate(data, moduleId, lessonId, patch) {
  const modules = data.modules.map((m) => {
    if (m.id !== moduleId) return m;
    const lessons = m.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l));
    return { ...m, lessons };
  });
  return { ...data, modules };
}
