"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Users,
  FileText,
  CreditCard,
  Repeat,
  Settings,
  BarChart3,
} from "lucide-react"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Form Submissions",
    href: "/dashboard/submissions",
    icon: FileText,
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: CreditCard,
  },
  {
    title: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: Repeat,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
              isActive ? "bg-accent" : "transparent",
              isActive ? "text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </motion.div>
          </Link>
        )
      })}
    </nav>
  )
}
