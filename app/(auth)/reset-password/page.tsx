"use client"

import Link from "next/link"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-md space-y-8 p-8 rounded-lg border bg-card/50 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Reset Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>
        
        <ResetPasswordForm />
        
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium underline underline-offset-4 hover:text-primary">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 