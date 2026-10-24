"use client";
import { useState } from "react";
import Link from "next/link";
import { aurum } from "../../lib/api";
import AuthLayout from "../../components/AuthLayout";
import { ErrorMsg } from "../../components/ui";
import { AlertCircle } from "lucide-react";

export default function ForgotPage() {
  const [ident, setIdent] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await aurum.passwordForgot(ident.trim());
      setSent(true);
      if (r && r.email_sent === false && r.reset_link) setResetLink(r.reset_link);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Reset your password</h2>
        {sent ? (
          <>
            <p className="muted">
              If an account matches <strong>{ident}</strong>, a reset link has been issued.
              Check your email.
            </p>
            {resetLink && (
              <div className="card auth-card">
                <p className="small muted">
                  Email isn&apos;t configured on this server yet, so here&apos;s your reset link directly:
                </p>
                <Link href={resetLink.replace(/^https?:\/\/[^/]+/, "")} className="btn btn-sm btn-accent">
                  Set a new password →
                </Link>
              </div>
            )}
            <hr className="divider" />
            <p className="small"><Link href="/login" className="auth-link">← Back to login</Link></p>
          </>
        ) : (
          <>
            <p className="muted">Enter your email or username and we&apos;ll send you a reset link.</p>
            <form onSubmit={submit}>
              <label>Email or username</label>
              <input value={ident} onChange={(e)=>setIdent(e.target.value)} autoFocus />
              <ErrorMsg>{err && <><AlertCircle size={16} /> {err}</>}</ErrorMsg>
              <button className="btn btn-block" disabled={busy || !ident.trim()} className="auth-actions">
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <hr className="divider" />
            <p className="small"><Link href="/login" className="auth-link">← Back to login</Link></p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
