import type { Metadata } from "next";
import { CustomerLoginPreview } from "./CustomerLoginPreview";

export const metadata: Metadata = { title: "Mi cuenta | Che Peludos" };

export default function CuentaPage() {
  return <CustomerLoginPreview />;
}
