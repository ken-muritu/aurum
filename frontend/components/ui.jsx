export function ErrorMsg({ children, className }) {
  if (!children) return null;
  return (
    <div className={"input-error" + (className ? " " + className : "")} role="alert">
      {children}
    </div>
  );
}
