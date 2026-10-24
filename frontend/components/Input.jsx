"use client";
import React from "react";
import { X } from "lucide-react";

export default function Input({
  label,
  error,
  loading = false,
  icon,
  clearable = false,
  onChange,
  value = "",
  id,
  name,
  placeholder,
  type = "text",
  className = "",
  ...props
}) {
  const inputId = id || name || "aurum-input";
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={["input-wrap", className].filter(Boolean).join(" ")}>
      {label ? (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      ) : null}
      <div className="input-field">
        {icon ? <span className="input-icon" aria-hidden>{icon}</span> : null}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
          disabled={loading}
          {...props}
        />
        {clearable && value ? (
          <button
            type="button"
            className="input-clear"
            onClick={() => onChange?.({ target: { value: "" } })}
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
