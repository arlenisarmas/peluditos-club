export function Badge({
  children,
  tone = "coral",
}: {
  children: React.ReactNode;
  tone?: "coral" | "yellow";
}) {
  const toneClass =
    tone === "coral" ? "bg-brand-coral text-white" : "bg-brand-yellow text-brand-black";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${toneClass}`}
    >
      {children}
    </span>
  );
}
