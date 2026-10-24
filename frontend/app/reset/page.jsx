"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { aurum, setToken, setUser } from "../../lib/api";
import AuthLayout from "../../components/AuthLayout";
import { ErrorMsg } from "../../components/ui";

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();
  const uid = params.get("uid") || "";
  const token = params.get("token") || "";
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const validLink = uid && token;

  async function submit(e) {
    e.preventDefault();
    if (pw !== pw2) { setErr("Passwords don't match."); return; }
    setErr(""); setBusy(true);
    try {
      const r = await aurum.passwordReset(uid, token, pw);
      if (r && r.token) { setToken(r.token); setUser(r.user); }
      setDone(true);
      setTimeout(() => router.push("/learn"), 1200);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  if (!validLink) {
    return (
      <div className="auth-card">
        <h2>Invalid reset link</h2>
        <p className="muted">This link is missing its token. Request a new one.</p>
        <Link className="btn" href="/forgot">Request a reset link</Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2>Set a new password</h2>
      {done ? (
        <p className="success">Password updated — logging you in…</p>
      ) : (
        <form onSubmit={submit}>
          <label>New password</label>
          <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} autoFocus autoComplete="new-password" />
          <label>Confirm new password</label>
          <input type="password" value={pw2} onChange={(e)=>setPw2(e.target.value)} autoComplete="new-password" />
          <ErrorMsg>{err}</ErrorMsg>
          <button className="btn btn-block" disabled={busy || pw.length < 4} className="auth-actions">
            {busy ? "Updating…" : "Update password"}
          </button>
          {pw && pw.length < 4 && <p className="mute2">Password must be at least 4 characters.</p>}
        </form>
      )}
    </div>
  );
}

export default function ResetPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="muted">Loading…</div>}>
        <ResetInner />
      </Suspense>
    </AuthLayout>
  );
}
