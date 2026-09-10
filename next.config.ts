import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl) : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: supabaseOrigin
      ? [
          {
            protocol: supabaseOrigin.protocol.replace(":", "") as "http" | "https",
            hostname: supabaseOrigin.hostname,
            port: supabaseOrigin.port,
            // Cubre todos los buckets públicos (project-images, ui-style-images).
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // El Supabase self-hosted vive en la misma red privada que la app (ver
    // nota de entorno en CLAUDE.md) — sin esto next/image rechaza optimizar
    // imágenes servidas desde una IP privada.
    dangerouslyAllowLocalIP: true,
  },
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
