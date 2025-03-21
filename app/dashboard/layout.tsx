"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <DashboardHeader
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isSidebarOpen ? "280px" : "0px",
            opacity: isSidebarOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className={`fixed inset-y-16 left-0 z-30 bg-card/50 backdrop-blur-sm border-r overflow-hidden ${
            isSidebarOpen ? "border-r" : "border-r-0"
          }`}
        >
          <div className="h-full py-6 pl-6 pr-4">
            <DashboardNav />
          </div>
        </motion.aside>

        {/* Main content */}
        <motion.main
          initial={false}
          animate={{
            marginLeft: isSidebarOpen ? "280px" : "0px",
          }}
          transition={{ duration: 0.2 }}
          className="flex-1 min-h-[calc(100vh-4rem)]"
        >
          <div className="container py-6 space-y-8 px-4">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  )
}
