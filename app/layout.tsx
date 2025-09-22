import "./globals.css";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";

// Las fuentes Geist se cargan desde el paquete `geist`

/**
 * Metadatos globales de la aplicación.
 * Define el título, descripción y generador para las páginas.
 */
export const metadata: Metadata = {
  title: "Quick Quiz",
  description:
    "Una aplicación interactiva de quiz con preguntas personalizables",
};

/**
 * RootLayout
 *
 * Envoltura de layout para toda la app. Inyecta fuentes, idioma
 * y clases globales en el HTML.
 *
 * @param children Contenido de la ruta actual.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased dark`}
    >
      <body className="quiz-gradient">{children}</body>
    </html>
  );
}
