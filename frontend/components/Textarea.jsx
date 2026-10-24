"use client";
import React from "react";

export default function Textarea({ label, error, loading = false, value = "", onChange, id, name, placeholder, className = "", ...props }) {
  const inputId = id || name || "aurum-textarea";
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={["input-wrap", className].filter(Boolean).join(" ")}>
      {label ? <label htmlFor={inputId} className="input-label">{label}</label> : null}
      <div className="input-field">
        <textarea id={inputId} name={name} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error) || undefined} aria-describedby={errorId} disabled={loading} {...props} />
      </div>
      {error ? <p id={errorId} className="input-error" role="alert">{error}</p> : null}
    </div>
  );
}
