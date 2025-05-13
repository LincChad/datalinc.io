import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Datalinc",
  description: "Create a new Datalinc account to get access to all of our services",
  openGraph: {
    title: "Sign Up | Datalinc",
    description: "Create a new Datalinc account to get access to all of our services",
    url: "https://datalinc.com.au/signup",
    images: ["/images/datalincLogoOG.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Datalinc",
    description: "Create a new Datalinc account to get access to all of our services",
    images: ["/images/datalincLogoOG.png"],
  },
}
export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 