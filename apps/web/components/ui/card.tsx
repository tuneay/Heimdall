import type { ReactNode } from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border bg-surface ${className}`}
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.03), 0 8px 30px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
}
