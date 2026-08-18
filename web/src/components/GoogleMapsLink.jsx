export function GoogleMapsLink({ query }) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-ash-text underline decoration-slate-border underline-offset-4 transition-colors hover:text-ivory-text"
    >
      Google Maps 導航 →
    </a>
  );
}
