"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

const updatePasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })
  
  async function onSubmit(data: UpdatePasswordValues) {
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      setIsComplete(true)
      toast.success("Password updated successfully!")
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update password")
        console.error(error)
      } else {
        toast.error("Failed to update password")
        console.error("Unknown error:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card/50 backdrop-blur-sm"
        >
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
            >
              Password Updated
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-muted-foreground"
            >
              Your password has been updated successfully. You can now log in with your new password.
            </motion.p>
          </div>
          <Button 
            onClick={() => router.push("/login")} 
            className="w-full rounded-full"
          >
            Go to Login
          </Button>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card/50 backdrop-blur-sm"
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
          >
            Update Password
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-muted-foreground"
          >
            Create a new password for your account
          </motion.p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
            {isLoading ? "Updating password..." : "Update Password"}
          </Button>
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Remembered your old password?{" "}
              <Link href="/login" className="font-medium underline underline-offset-4 hover:text-primary">
                Back to login
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 