export default function ErrorState({ icon: Icon, title, action }) {
  return (
    <div className="error-state" role="alert">
      {Icon ? <span className="error-icon" aria-hidden><Icon size={18} /></span> : null}
      <p className="error-title">{title}</p>
      <div className="error-action">{action}</div>
    </div>
  );
}
