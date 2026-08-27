import { requirePagePermission } from "@/lib/authz";

export default async function AdminPedidosPage() {
  await requirePagePermission("orders:read");
  return (
    <div>
      <h1 className="text-xl font-bold">Pedidos</h1>
      <div className="mt-4 rounded-2xl border border-dashed border-black/20 bg-white p-8 text-center">
        <p className="text-brand-gray">
          Todavía no hay pedidos: se activan en la Fase 4, cuando conectemos el carrito persistente y
          Mercado Pago. Ahí vas a poder ver número, cliente, productos, total, estado y fecha de cada
          pedido desde acá.
        </p>
      </div>
    </div>
  );
}
