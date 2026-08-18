const THEME_STYLES = {
  dino: "bg-[var(--color-champagne-gold-dim)]/20 text-[var(--color-champagne-gold)] border-[var(--color-champagne-gold)]/40",
  gold: "bg-[var(--color-champagne-gold-dim)]/20 text-[var(--color-champagne-gold)] border-[var(--color-champagne-gold)]/40",
  family: "bg-obsidian-button text-ivory-text border-mist-border/30",
  pass: "bg-cobalt/15 text-ivory-text border-cobalt/50",
};

export function ThemeBadge({ theme, children }) {
  const style = THEME_STYLES[theme] ?? THEME_STYLES.family;
  return (
    <span
      className={`inline-flex items-center rounded-tags border px-3 py-1 text-xs font-medium tracking-wide ${style}`}
    >
      {children}
    </span>
  );
}

export function PendingBadge({ label = "待補" }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-tags border border-dashed border-slate-border px-3 py-1 text-xs text-ash-text">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-border" />
      {label}
    </span>
  );
}
