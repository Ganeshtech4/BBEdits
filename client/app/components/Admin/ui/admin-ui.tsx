import React, { ReactNode } from "react";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] transition-colors dark:border-slate-800/80 dark:bg-slate-900 dark:shadow-[0_24px_80px_-42px_rgba(8,47,73,0.55)] sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminSectionIntro({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-600 dark:text-cyan-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

const toneStyles = {
  indigo:
    "from-indigo-500/16 via-indigo-500/10 to-transparent text-indigo-600 dark:text-indigo-300 ring-indigo-500/20",
  emerald:
    "from-emerald-500/18 via-emerald-500/10 to-transparent text-emerald-600 dark:text-emerald-300 ring-emerald-500/20",
  amber:
    "from-amber-500/18 via-amber-500/10 to-transparent text-amber-600 dark:text-amber-300 ring-amber-500/20",
  rose:
    "from-rose-500/18 via-rose-500/10 to-transparent text-rose-600 dark:text-rose-300 ring-rose-500/20",
};

export function AdminMetricCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "indigo",
  helper,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  tone?: keyof typeof toneStyles;
  helper?: string;
}) {
  const positive = typeof delta === "number" ? delta >= 0 : undefined;
  const iconTone = toneStyles[tone].split(" ")[3];

  return (
    <AdminCard className="relative overflow-hidden p-5">
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-100",
          toneStyles[tone]
        )}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {value}
          </p>
          {helper ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {helper}
            </p>
          ) : null}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <Icon className={cn("h-5 w-5", iconTone)} />
        </div>
      </div>

      {typeof delta === "number" ? (
        <div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3 py-1 text-sm dark:border-slate-800 dark:bg-slate-900/70">
          {positive ? (
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-rose-500" />
          )}
          <span
            className={cn(
              "font-medium",
              positive ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
            )}
          >
            {positive ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          <span className="text-slate-500 dark:text-slate-400">vs last period</span>
        </div>
      ) : null}
    </AdminCard>
  );
}

export function AdminButton({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
        variant === "primary"
          ? "bg-slate-950 text-white hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-cyan-400",
        props.className
      )}
    />
  );
}

export function AdminSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-cyan-400",
        props.className
      )}
    />
  );
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  valueLabel = "Value",
}: {
  active?: boolean;
  payload?: Array<{ value: number; color?: string }>;
  label?: string;
  valueLabel?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-xl dark:border-slate-800 dark:bg-slate-950/95">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: payload[0].color || "#38bdf8" }}
        />
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {valueLabel}: {payload[0].value}
        </p>
      </div>
    </div>
  );
}
