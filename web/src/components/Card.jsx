export function Card({ children, className = "" }) {
  return (
    <div className={`scroll-reveal rounded-cards bg-graphite-card p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}
