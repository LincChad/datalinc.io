import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | DataLinc",
  description: "Sign in to your DataLinc account",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 