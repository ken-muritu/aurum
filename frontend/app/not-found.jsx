import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page-center">
      <h1>404</h1>
      <p className="muted">This page wandered off the learning path.</p>
      <Link className="btn" href="/">← Back home</Link>
    </div>
  );
}
