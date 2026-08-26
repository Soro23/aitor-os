import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Cada imagen de proyecto (portada, o una captura por llamada en la
      // subida en bulk) viaja sola dentro del payload de la Server Action;
      // el límite por defecto (1mb) se queda corto para una foto real.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
