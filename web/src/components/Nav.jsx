import { useEffect, useState } from "react";

const LINKS = [
  { href: "#overview", label: "總覽" },
  { href: "#itinerary", label: "逐日行程" },
  { href: "#spots", label: "精選景點" },
  { href: "#transit", label: "交通票券" },
  { href: "#info", label: "實用資訊" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-onyx-canvas/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-(--width-page-max) items-center justify-between px-5 py-4">
        <span className="font-display text-base font-semibold tracking-wide text-ivory-text">
          2027 冬季親子行
        </span>

        <div className="hidden gap-1 sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-nav px-4 py-2 text-sm text-ivory-text/90 transition-colors hover:bg-obsidian-button"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-mist-border/40 text-ivory-text sm:hidden"
          aria-label="開啟選單"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 bg-onyx-canvas/95 px-5 pb-4 backdrop-blur-md sm:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-nav px-4 py-3 text-sm text-ivory-text hover:bg-obsidian-button"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
