import { Benefit } from "@/lib/types";

export const benefits: Benefit[] = [
  {
    title: "Envío gratis",
    description: "En compras superiores a $699",
    icon: "/images/icons/icon-shipping.png",
    iconBgClass: "bg-brand-blue",
  },
  {
    title: "Pago 100% seguro",
    description: "Compra protegida siempre",
    icon: "/images/icons/icon-secure.png",
    iconBgClass: "bg-brand-yellow",
  },
  {
    title: "Amamos mascotas",
    description: "Productos pensados con amor",
    icon: "/images/icons/icon-love.png",
    iconBgClass: "bg-brand-coral",
  },
];

export function getBenefits() {
  return benefits;
}
