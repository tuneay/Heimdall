import { Card } from "./card";

type Tone = "default" | "up" | "down";

const toneClass: Record<Tone, string> = {
  default: "text-primary",
  up: "text-up",
  down: "text-down",
};

export function Stat({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: Tone;
}) {
  return (
    <Card className="px-5 py-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-tertiary">
        {label}
      </div>
      <div className={`tabular mt-1.5 text-2xl font-semibold tracking-tight ${toneClass[tone]}`}>
        {value}
      </div>
      {sub ? <div className="tabular mt-0.5 text-sm text-secondary">{sub}</div> : null}
    </Card>
  );
}
