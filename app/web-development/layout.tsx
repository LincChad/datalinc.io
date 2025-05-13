import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development Services | Datalinc",
  description: "Datalinc crafts beautiful, responsive, and high-performance websites for clients in Australia and beyond.",
  openGraph: {
    title: "Web Development Services | Datalinc",
    description: "Datalinc crafts beautiful, responsive, and high-performance websites for clients in Australia and beyond.",
    url: "https://datalinc.com.au/web-development",
    images: [
      {
        url: "/images/datalincLogoOG.png",
        width: 1200,
        height: 630,
        alt: "Web Development Example",
      },
    ],
    siteName: "Datalinc",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Services | Datalinc",
    description: "Datalinc crafts beautiful, responsive, and high-performance websites for clients in Australia and beyond.",
    images: ["/images/datalincLogoOG.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 