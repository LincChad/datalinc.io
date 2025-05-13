import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Datalinc",
  description: "Sign in to your Datalinc account to upgrade your business to the next level",
  openGraph: {
    title: "Login | Datalinc",
    description: "Sign in to your Datalinc account to upgrade your business to the next level",
    url: "https://datalinc.com.au/login",
    images: ["/images/datalincLogoOG.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Datalinc",
    description: "Sign in to your Datalinc account to upgrade your business to the next level",
    images: ["/images/datalincLogoOG.png"],
  },
}
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 