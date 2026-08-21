import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aitor OS",
  description:
    "Sistema operativo personal público — marca personal, base de conocimiento y centro de actividad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Las variables de next/font van en <html>, no en <body>: tokens.css declara
  // --font-mono/--font-sans en :root (=html) referenciando estas variables vía
  // var() — si solo viven en <body> (un descendiente), esa referencia queda sin
  // resolver en :root y --font-mono/--font-sans terminan siendo inválidos para
  // toda la página (cae al fallback serif del navegador).
  return (
    <html lang="es" className={`${inter.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
