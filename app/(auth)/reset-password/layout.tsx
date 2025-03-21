import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | DataLinc",
  description: "Reset your DataLinc account password",
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 