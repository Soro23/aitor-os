import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Las imágenes de proyecto (portada + hasta 10 capturas en bulk) viajan
      // dentro del payload de la Server Action; el límite por defecto (1mb)
      // se queda corto para fotos reales.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
