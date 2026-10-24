"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import AuthLayout from "../../components/AuthLayout";
import { ErrorMsg } from "../../components/ui";
import { AlertCircle } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [dn, setDn] = useState("");
  const [u, setU] = useState("");
  const [em, setEm] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await signup({ username: u.trim(), password: p, display_name: dn.trim(), email: em.trim() });
      router.push("/learn");
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="muted">Start building your first Mastery in minutes.</p>
        <form onSubmit={submit}>
          <label>Display name</label>
          <input value={dn} onChange={(e)=>setDn(e.target.value)} placeholder="How should we call you?" autoFocus />
          <label>Email</label>
          <input type="email" value={em} onChange={(e)=>setEm(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          <label>Username</label>
          <input value={u} onChange={(e)=>setU(e.target.value)} autoComplete="username" />
          <label>Password</label>
          <input type="password" value={p} onChange={(e)=>setP(e.target.value)} autoComplete="new-password" />
          <ErrorMsg>{err && <><AlertCircle size={16} /> {err}</>}</ErrorMsg>
          <button className="btn btn-block" disabled={busy || !u || !em || p.length < 4} className="auth-actions">
            {busy ? "Creating…" : "Create account"}
          </button>
          {p && p.length < 4 && <p className="mute2">Password must be at least 4 characters.</p>}
        </form>
        <hr className="divider" />
        <p className="muted small">Already have an account? <Link href="/login" className="auth-link">Log in →</Link></p>
      </div>
    </AuthLayout>
  );
}
