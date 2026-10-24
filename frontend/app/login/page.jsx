"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth";
import AuthLayout from "../../components/AuthLayout";
import { ErrorMsg } from "../../components/ui";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try { await login(u.trim(), p); router.push("/learn"); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <AuthLayout>
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue your Masteries.</p>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={u} onChange={(e)=>setU(e.target.value)} autoFocus autoComplete="username" />
          <label>Password</label>
          <input type="password" value={p} onChange={(e)=>setP(e.target.value)} autoComplete="current-password" />
          <ErrorMsg>{err && <><AlertCircle size={16} /> {err}</>}</ErrorMsg>
          <button className="btn btn-block" disabled={busy || !u || !p} className="auth-actions">
            {busy ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="small" className="auth-small">
          <Link href="/forgot" className="auth-link">Forgot your password?</Link>
        </p>
        <hr className="divider" />
        <p className="muted small">No account? <Link href="/signup" className="auth-link">Create one →</Link></p>
      </div>
    </AuthLayout>
  );
}
