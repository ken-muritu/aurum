export default function EmptyState({ icon, message, action }) {
  return (
    <div className="empty-state">
      {icon ? <div className="empty-icon">{icon}</div> : null}
      <p className="empty-message">{message}</p>
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}
