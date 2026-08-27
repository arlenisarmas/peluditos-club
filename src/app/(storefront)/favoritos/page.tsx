import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Favoritos | Che Peludos" };

export default function FavoritosPage() {
  return (
    <ComingSoon
      emoji="💛"
      title="Tus favoritos, muy pronto"
      description="Esta sección se activa cuando conectemos cuentas de usuario (Fase 3 del proyecto). Por ahora podés usar el corazón en cada producto para marcarlo mientras navegás."
    />
  );
}
