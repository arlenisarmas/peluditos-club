import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/**")],
  },
  experimental: {
    serverActions: {
      // Next.js limita el body de una Server Action a 1MB por defecto — menos
      // que el límite de 5MB que ya valida uploadProductImage/replaceProductImage
      // (src/lib/actions/products.ts). Sin esto, una imagen de entre 1 y 5MB
      // fallaba en el framework antes de llegar a nuestra validación.
      bodySizeLimit: "6mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
