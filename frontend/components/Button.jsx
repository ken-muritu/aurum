"use client";
import React from "react";

const variantClasses = {
  primary: "btn btn-accent",
  secondary: "btn btn-ghost",
  tertiary: "btn btn-ghost",
  danger: "btn btn-danger",
  ghost: "btn btn-ghost",
  link: "btn-link",
};

const sizeClasses = {
  default: "",
  sm: "btn-sm",
};

export default function Button({
  variant = "primary",
  size = "default",
  loading = false,
  disabled = false,
  icon,
  iconOnly = false,
  onClick,
  children,
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="btn-spinner" aria-hidden /> : null}
      {!loading && icon ? <span aria-hidden>{icon}</span> : null}
      {!iconOnly ? <span>{children}</span> : null}
      {iconOnly && !icon ? <span className="sr-only">{children}</span> : null}
      <style jsx>{`
        @keyframes aurum-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
