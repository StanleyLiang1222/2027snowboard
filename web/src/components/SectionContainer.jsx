export function SectionContainer({ id, title, eyebrow, children, tone = "dark", className = "" }) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={`bg-onyx-canvas px-5 py-14 text-ivory-text sm:py-18 ${className}`}
    >
      <div className="mx-auto max-w-(--width-page-max)">
        {(eyebrow || title) && (
          <div className="mb-8 sm:mb-10">
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-[0.02em] text-ivory-text">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
