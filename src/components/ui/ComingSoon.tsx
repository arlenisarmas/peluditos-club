import { ButtonLink } from "@/components/ui/Button";

export function ComingSoon({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <span className="text-5xl">{emoji}</span>
      <h1 className="mt-4 text-xl font-bold">{title}</h1>
      <p className="mt-2 text-brand-gray">{description}</p>
      <ButtonLink href="/tienda" className="mt-6">
        Ir a la tienda
      </ButtonLink>
    </div>
  );
}
