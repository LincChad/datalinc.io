import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Datalinc",
  description: "Sign in to your Datalinc account to upgrade your business to the next level",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 