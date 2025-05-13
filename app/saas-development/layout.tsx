import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS Development Services | Datalinc",
  description: "Datalinc builds scalable, secure, and user-friendly SaaS products for startups and enterprises.",
  openGraph: {
    title: "SaaS Development Services | Datalinc",
    description: "Datalinc builds scalable, secure, and user-friendly SaaS products for startups and enterprises.",
    url: "https://datalinc.com.au/saas-development",
    images: [
      {
        url: "/images/datalincLogoOG.png",
        width: 1200,
        height: 630,
        alt: "Datalinc OG Logo",
      },
    ],
    siteName: "Datalinc",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Development Services | Datalinc",
    description: "Datalinc builds scalable, secure, and user-friendly SaaS products for startups and enterprises.",
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