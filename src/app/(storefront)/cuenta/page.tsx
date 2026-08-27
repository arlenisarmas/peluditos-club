import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Mi cuenta | Che Peludos" };

export default function CuentaPage() {
  return (
    <ComingSoon
      emoji="🐾"
      title="Tu cuenta, muy pronto"
      description="El login y el registro se activan cuando conectemos autenticación (Fase 3 del proyecto)."
    />
  );
}
