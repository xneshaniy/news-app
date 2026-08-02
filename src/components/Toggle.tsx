"use client";

import { useCallback } from "react";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  disabled?: string;
}

export default function Toggle({ enabled, onChange, label, disabled }: ToggleProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!disabled) onChange(!enabled);
      }
    },
    [enabled, onChange, disabled]
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label || "Toggle"}
      disabled={!!disabled}
      title={disabled || undefined}
      onClick={() => !disabled && onChange(!enabled)}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
