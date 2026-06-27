import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Seapedia",
    default: "Seapedia | Marketplace Kebutuhan Laut & Pantai",
  },
  description: "Seapedia adalah platform e-commerce terbaik untuk produk kelautan, peralatan memancing, perlengkapan selam, dan gaya hidup pantai. Temukan produk berkualitas dengan harga terbaik.",
  keywords: ["seapedia", "ecommerce", "marine products", "fishing gear", "diving equipment", "ocean lifestyle", "marketplace laut", "peralatan pancing", "alat selam"],
  authors: [{ name: "Seapedia Team" }],
  openGraph: {
    title: "Seapedia | Marketplace Kebutuhan Laut",
    description: "Platform e-commerce terbaik untuk produk kelautan, peralatan memancing, dan perlengkapan selam.",
    url: "https://seapedia.online",
    siteName: "Seapedia",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "Seapedia Thumbnail",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seapedia | Marketplace Kebutuhan Laut",
    description: "Temukan produk kelautan dan alat pancing terbaik di Seapedia.",
    images: ["/image.png"],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50`}>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Analytics />
      </body>
    </html>
  );
}
