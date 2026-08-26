import type { Metadata } from "next";
import { Poppins, Pacifico } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  // TODO: reemplazar por el dominio real cuando se despliegue (afecta las
  // URLs absolutas de Open Graph/Twitter que arma Next a partir de esto).
  metadataBase: new URL("http://localhost:3000"),
  title: "Peluditos Club — Todo para consentir a tu peludito",
  description:
    "Tienda online de productos para mascotas: accesorios, ropa, juguetes y comederos. Envío gratis en compras superiores a $699.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-brand-black">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
