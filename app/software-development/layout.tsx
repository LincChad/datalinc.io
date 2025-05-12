import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Development Services | Datalinc",
  description: "Datalinc delivers custom software solutions for businesses, from desktop to mobile, with a focus on security and scalability.",
  openGraph: {
    title: "Software Development Services | Datalinc",
    description: "Datalinc delivers custom software solutions for businesses, from desktop to mobile, with a focus on security and scalability.",
    url: "https://datalinc.com.au/software-development",
    images: [
      {
        url: "/images/datalincLogoOG.png",
        width: 1200,
        height: 630,
        alt: "Datalinc Software Development",
      },
    ],
    siteName: "Datalinc",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Development Services | Datalinc",
    description: "Datalinc delivers custom software solutions for businesses, from desktop to mobile, with a focus on security and scalability.",
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