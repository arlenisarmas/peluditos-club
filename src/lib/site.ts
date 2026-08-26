export function getSiteUrl() {
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}
