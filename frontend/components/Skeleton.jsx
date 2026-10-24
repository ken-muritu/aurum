export default function Skeleton({ className = "" }) {
  return <div className={["skeleton", className].filter(Boolean).join(" ")} aria-hidden />;
}
