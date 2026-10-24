export default function Progress({ value = 0, done = false, label, className = "" }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={["progress", done ? "progress-done" : "", className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="progress-track-filled"
    >
      <div className="progress-track" className="progress-track-filled" />
    </div>
  );
}
