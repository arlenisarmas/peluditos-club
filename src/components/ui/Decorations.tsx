// Elementos decorativos (patitas, corazones, blobs, sparkles) recreados como
// SVG en vez de recortar la hoja de referencia con todos los garabatos
// juntos: quedan nítidos a cualquier tamaño y se pueden teñir con los
// colores de marca.

export function PawIcon({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill={color} aria-hidden="true">
      <ellipse cx="21" cy="22" rx="8" ry="10" />
      <ellipse cx="43" cy="22" rx="8" ry="10" />
      <ellipse cx="10" cy="38" rx="6.5" ry="8.5" />
      <ellipse cx="54" cy="38" rx="6.5" ry="8.5" />
      <path d="M32 30c-9 0-17 7.5-17 15.5C15 53 21 58 28 55c2.6-1.1 4.6-1.1 8-.1 7.2 2.2 13-2.8 13-10.4C49 37.5 41 30 32 30z" />
    </svg>
  );
}

export function HeartIcon({
  className = "",
  color = "currentColor",
  filled = true,
}: {
  className?: string;
  color?: string;
  filled?: boolean;
}) {
  const d =
    "M32 56S6 40.5 6 22.5C6 12.7 13.4 6 22 6c4.6 0 8.8 2.2 10 6.4C33.2 8.2 37.4 6 42 6c8.6 0 16 6.7 16 16.5C58 40.5 32 56 32 56z";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d={d}
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={filled ? 0 : 4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkleIcon({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill={color} aria-hidden="true">
      <path d="M16 0c1 7.5 2.5 9 10 10-7.5 1-9 2.5-10 10-1-7.5-2.5-9-10-10 7.5-1 9-2.5 10-10z" />
    </svg>
  );
}

export function BoneIcon({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} fill={color} aria-hidden="true">
      <path d="M8 6a6 6 0 0 1 9.8-4.6L46 24a6 6 0 1 1-5 9.4L13 10.6A6 6 0 0 1 8 6z" />
      <circle cx="7" cy="8" r="6" />
      <circle cx="12" cy="3" r="6" />
      <circle cx="52" cy="24" r="6" />
      <circle cx="57" cy="29" r="6" />
    </svg>
  );
}

export function BlobShape({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} fill={color} aria-hidden="true">
      <path d="M45 20C75-2 140-8 170 25c28 30 20 75-12 98-33 24-84 30-121 8C1 128-16 90 8 58 18 45 30 31 45 20z" />
    </svg>
  );
}

export function PawPrintTrail({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 160 60" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 40c20 15 40-15 55 0s30 10 45-5"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <g transform="translate(128, 20) scale(0.35)" fill={color}>
        <ellipse cx="21" cy="22" rx="8" ry="10" />
        <ellipse cx="43" cy="22" rx="8" ry="10" />
        <ellipse cx="10" cy="38" rx="6.5" ry="8.5" />
        <ellipse cx="54" cy="38" rx="6.5" ry="8.5" />
        <path d="M32 30c-9 0-17 7.5-17 15.5C15 53 21 58 28 55c2.6-1.1 4.6-1.1 8-.1 7.2 2.2 13-2.8 13-10.4C49 37.5 41 30 32 30z" />
      </g>
    </svg>
  );
}
