"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { User } from "@supabase/supabase-js"

interface DashboardHeaderProps {
  toggleSidebar: () => void
  isSidebarOpen: boolean
}

export function DashboardHeader({
  toggleSidebar,
  isSidebarOpen,
}: DashboardHeaderProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
      toast.success("Signed out successfully")
    } catch (error) {
      toast.error("Error signing out", {
        description: `Error: ${error}`,
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      }
    }
    getUser()
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isSidebarOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.div>
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="pl-8 text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Datalinc Dashboard - {user?.email}
            </h1>
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </div>
    </header>
  )
}
