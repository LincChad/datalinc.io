import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | Datalinc",
  description: "Reset your Datalinc account password to get access to all of our services",
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 