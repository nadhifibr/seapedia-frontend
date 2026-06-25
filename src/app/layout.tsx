import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seapedia Marketplace",
  description: "Seapedia is an e-commerce platform that provides various marine-related products, ranging from fishing gear, diving equipment, marine accessories, and ocean lifestyle products. Seapedia connects ocean enthusiasts with reliable products to support their marine activities and adventures.",
  keywords: ["seapedia", "ecommerce", "marine products", "fishing gear", "diving equipment", "ocean lifestyle", "marketplace"],
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
