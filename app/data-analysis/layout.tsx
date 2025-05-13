import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Analysis Services | Datalinc",
    description: "Datalinc provides data analysis services to help businesses make informed decisions and drive growth.",
    openGraph: {
      title: "Data Analysis Services | Datalinc",
      description: "Datalinc provides data analysis services to help businesses make informed decisions and drive growth.",
      url: "https://datalinc.com.au/data-analysis",
      images: [
        {
          url: "/images/datalincLogoOG.png",
          width: 1200,
          height: 630,
          alt: "Data Analysis Example",
        },
      ],
      siteName: "Datalinc",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: "Data Analysis Services | Datalinc",
      description: "Datalinc provides data analysis services to help businesses make informed decisions and drive growth.",
      images: ["/images/datalincLogoOG.png"],
    },
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <>
          {children}
        </>
    );
  }
  