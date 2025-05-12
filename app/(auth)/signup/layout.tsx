import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Datalinc",
  description: "Create a new Datalinc account to get access to all of our services",
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 