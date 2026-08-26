interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Limitador en memoria: alcanza para esta app (un solo proceso). Si en el
// futuro se despliega en múltiples instancias serverless, cada una tendría
// su propio conteo — para eso hace falta un store compartido (Redis/Upstash).
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}
