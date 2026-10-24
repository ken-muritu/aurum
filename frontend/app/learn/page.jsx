"use client";
import React, { useState, useEffect } from "react";
import { Plus, Sparkles } from "lucide-react";
import ContinueCard from "./components/ContinueCard";
import MasteryRow from "./components/MasteryRow";
import ContextDrawer from "./components/ContextDrawer";
import Input from "../../components/Input";
import Tabs from "../../components/Tabs";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";

export default function LearnPage() {
  const [continueData, setContinueData] = useState(null);
  const [masteries, setMasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [discoverPublic, setDiscoverPublic] = useState([]);

  const emptyMasteries = !loading && !continueData && masteries.length === 0;

  return (
    <div className="container">
      <div className="learn">
        <div className="learn-header between row">
          <h1>Learn</h1>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => setDrawerOpen(true)}>
            <Plus size={16} /> Start a new mastery
          </button>
        </div>

        <div className="stack-lg">
          {loading ? (
            <div className="stack">
              <div className="continue-card continue-card-loading" />
              <div className="mastery-list">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton" />
                ))}
              </div>
            </div>
          ) : error ? (
            <ErrorState
              title={error}
              action={
                <button className="btn btn-ghost btn-sm" type="button" onClick={() => window.location.reload()}>
                  Retry
                </button>
              }
            />
          ) : emptyMasteries ? (
            <EmptyState
              icon={<Sparkles size={32} />}
              message="Your forge is cold. Strike your first mastery."
              action={
                <button className="btn btn-accent" type="button" onClick={() => setDrawerOpen(true)}>
                  What do you want to master?
                </button>
              }
            />
          ) : (
            <>
              {continueData ? (
                <ContinueCard
                  mastery={continueData}
                  moduleTitle={continueData.moduleTitle}
                  lessonTitle={continueData.lessonTitle}
                  progress={continueData.progress}
                  onResume={() => {
                    if (continueData.masteryId) {
                      window.location.href = `/mastery/${continueData.masteryId}`;
                    }
                  }}
                />
              ) : null}
              <section className="stack">
                <h3>Active Masteries</h3>
                {masteries.length ? (
                  <div className="mastery-list">
                    {masteries.map((m) => (
                      <MasteryRow
                        key={m.id}
                        title={m.title}
                        progress={m.progress}
                        lastAccessed={m.lastAccessed}
                        onClick={() => { window.location.href = `/mastery/${m.id}`; }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-muted">Nothing in progress.</div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <ContextDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Tabs
          tabs={[
            { id: "generate", label: "Generate" },
            { id: "discover", label: "Discover" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
        <div className="drawer-content">
          {activeTab === "generate" ? (
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.elements.query.value;
                if (!query.trim()) return;
                window.location.href = `/mastery/new?q=${encodeURIComponent(query)}`;
              }}
            >
              <Input label="What do you want to master?" name="query" placeholder="e.g. React, Rust, Linear Algebra" />
              <div className="row between">
                <button className="btn btn-ghost" type="button" onClick={() => setDrawerOpen(false)}>
                  Build manually
                </button>
                <button className="btn btn-accent" type="submit">Generate</button>
              </div>
            </form>
          ) : (
            <DiscoverPanel
              items={discoverPublic}
              onSearch={(value) => {
                fetch(`/api/discover?q=${encodeURIComponent(value)}`).then((r)=>r.json()).then((data)=>setDiscoverPublic(data.items||[])).catch(()=>setDiscoverPublic([]));
              }}
              onUse={(item) => { window.location.href = `/mastery/${item.id}`; }}
            />
          )}
        </div>
      </ContextDrawer>
    </div>
  );
}
