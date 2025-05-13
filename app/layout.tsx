import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Datalinc | Data-driven solutions for modern businesses",
  description: "Data-driven solutions for modern businesses. We build custom software solutions for businesses, from desktop to mobile, with a focus on security and scalability.",
  openGraph: {
    title: "Datalinc | Data-driven solutions for modern businesses",
    description: "Data-driven solutions for modern businesses. We build custom software solutions for businesses, from desktop to mobile, with a focus on security and scalability.",
    url: "https://datalinc.com.au",
    images: [
      {
        url: "/images/datalincLogoOG.png",
        width: 1200,
        height: 630,
        alt: "Datalinc Software Development",
      },
    ],
    siteName: "Datalinc",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Datalinc | Data-driven solutions for modern businesses",
    description: "Data-driven solutions for modern businesses",
    images: ["/images/datalincLogoOG.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
