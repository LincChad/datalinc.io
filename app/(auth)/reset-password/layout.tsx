import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | Datalinc",
  description: "Reset your Datalinc account password to get access to all of our services",
  openGraph: {
    title: "Reset Password | Datalinc",
    description: "Reset your Datalinc account password to get access to all of our services",
    url: "https://datalinc.com.au/reset-password",
    images: ["/images/datalincLogoOG.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password | Datalinc",
    description: "Reset your Datalinc account password to get access to all of our services",
    images: ["/images/datalincLogoOG.png"],
  },
}
export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 