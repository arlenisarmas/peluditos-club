import { useId } from "react";

const STAR_PATH =
  "M10 1.5l2.598 5.264 5.809.844-4.203 4.098.992 5.786L10 14.75l-5.196 2.732.992-5.786L1.593 7.608l5.809-.844L10 1.5z";

export function RatingStars({
  rating,
  reviewCount,
  size = 14,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  const uid = useId();
  return (
    <div className="flex items-center gap-1">
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          const gradientId = `star-fill-${uid}-${i}`;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 20 19">
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset={`${fill * 100}%`} stopColor="#FFC107" />
                  <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path d={STAR_PATH} fill={`url(#${gradientId})`} />
            </svg>
          );
        })}
      </div>
      <span className="sr-only">{rating.toFixed(1)} de 5 estrellas</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-brand-gray">({reviewCount})</span>
      )}
    </div>
  );
}
