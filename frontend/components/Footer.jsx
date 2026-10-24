"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>Product</h4>
          <Link href="/learn">Learn</Link>
          <Link href="/mastery/q">Masteries</Link>
        </div>
        <div>
          <h4>Resources</h4>
          <Link href="/">Docs</Link>
          <Link href="/">Guide</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </div>
      </div>
      <div className="footer-brand">Aurum</div>
    </footer>
  );
}
