"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth";
import { Compass, Check, PenLine, Search, ArrowRight } from "lucide-react";
import HeroIllustration from "../components/HeroIllustration";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) router.replace("/learn");
  }, [loading, user, router]);

  return (
    <div className="page-outer">
      <section className="hero">
        <HeroIllustration className="hero-svg" />
        <div className="hero-inner">
          <span className="pill pill-gold">
            Your Knowledge Operating System
          </span>
          <h1>
            Turn scattered YouTube tutorials<br />
            into <span className="grad">real mastery</span>.
          </h1>
          <p>
            You bookmark great videos and never finish them. Aurum turns a pile of good
            content into a structured path — modules, lessons, progress, and notes —
            so you actually cross the finish line.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-accent" href="/signup">Get started — it&apos;s free</Link>
            
          </div>
        </div>
      </section>

      <section className="container container-wide stack-lg">
        <div className="features">
          <div className="feature card">
            <div className="feature-icon"><Compass size={22} strokeWidth={1.75} /></div>
            <h3>Structure the chaos</h3>
            <p className="muted">Group videos into modules and lessons. One clear path from “I want to learn X” to “I can do X.”</p>
          </div>
          <div className="feature card">
            <div className="feature-icon"><Check size={22} strokeWidth={1.75} /></div>
            <h3>Track what sticks</h3>
            <p className="muted">Mark lessons complete, watch your progress bar fill, and always know the next thing to do.</p>
          </div>
          <div className="feature card">
            <div className="feature-icon"><PenLine size={22} strokeWidth={1.75} /></div>
            <h3>Notes in context</h3>
            <p className="muted">Capture insights per lesson — timestamped to the moment they mattered.</p>
          </div>
          <div className="feature card">
            <div className="feature-icon"><Search size={22} strokeWidth={1.75} /></div>
            <h3>Discover &amp; remix</h3>
            <p className="muted">Browse public Masteries built by others and fork them into your own learning plan.</p>
          </div>
        </div>

        <div className="page-center">
          <Link className="btn btn-accent" href="/signup">Build your first Mastery <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
