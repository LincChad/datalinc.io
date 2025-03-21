import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Update Password | DataLinc",
  description: "Update your DataLinc account password",
}

export default function UpdatePasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 