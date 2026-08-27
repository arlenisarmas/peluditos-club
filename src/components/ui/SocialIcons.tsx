// Glifos de Instagram y TikTok recreados a mano como SVG (mismo criterio que
// components/ui/Decorations.tsx): sin depender de una librería de íconos ni
// de un asset rasterizado, se ven nítidos a cualquier tamaño y heredan color
// por CSS (currentColor) en vez de tener un estilo fijo.

export function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 2h-3.1v13.4a2.7 2.7 0 1 1-1.9-2.6V9.6a5.8 5.8 0 1 0 5 5.75V9.1a7.7 7.7 0 0 0 4.5 1.4V7.4a4.6 4.6 0 0 1-4.5-4.6V2z" />
    </svg>
  );
}
