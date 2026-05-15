import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Euro Legal GPT – Deutsche Rechtsplattform für Studierende",
  description: "Über 5000 deutsche Rechtsdokumente und KI-Unterstützung für deine Prüfungsvorbereitung.",
icons: {
icon: "/favicon.svg",
},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
