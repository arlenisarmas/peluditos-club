import type { Metadata } from "next";
import { Poppins, Pacifico } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { getSiteUrl } from "@/lib/site";

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

const title = "Peluditos Club — Todo para consentir a tu peludito";
const description =
  "Tienda online de productos para mascotas: accesorios, ropa, juguetes y comederos. Envío gratis en compras superiores a $699.";

export const metadata: Metadata = {
  // Sigue a NEXTAUTH_URL (ver .env), así que alcanza con actualizar esa
  // variable al desplegar para que las URLs absolutas de Open Graph/Twitter
  // apunten al dominio real.
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_AR",
    images: ["/images/banners/promo-todo-consentir.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/banners/promo-todo-consentir.jpg"],
  },
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
