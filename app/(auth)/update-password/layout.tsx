import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Update Password | DataLinc",
  description: "Update your DataLinc account password",
  openGraph: {
    title: "Update Password | DataLinc",
    description: "Update your DataLinc account password",
    url: "https://datalinc.com.au/update-password",
    images: ["/images/datalincLogoOG.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Update Password | DataLinc",
    description: "Update your DataLinc account password",
    images: ["/images/datalincLogoOG.png"],
  },
}

export default function UpdatePasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 