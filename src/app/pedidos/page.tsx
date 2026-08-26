import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata: Metadata = { title: "Mis pedidos | Peluditos Club" };

export default function PedidosPage() {
  return (
    <ComingSoon
      emoji="📦"
      title="Tus pedidos, muy pronto"
      description="El seguimiento de pedidos se activa cuando conectemos la base de datos y Mercado Pago (Fases 2 y 4 del proyecto)."
    />
  );
}
