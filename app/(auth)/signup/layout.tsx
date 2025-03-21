import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | DataLinc",
  description: "Create a new DataLinc account",
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 