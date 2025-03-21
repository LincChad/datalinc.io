import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    // Validate email and password
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }
    
    // Check if environment variable is set
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL environment variable is not set" },
        { status: 500 }
      )
    }
    
    // Create a Supabase client with cookies
    const supabase = await createClient()
    
    // Get the origin for proper redirect with fallback to environment variable
    const originHeader = request.headers.get('origin') 
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    
    // Ensure we have a properly formatted URL
    let redirectBase = originHeader || appUrl || ''
    if (!redirectBase.startsWith('http')) {
      redirectBase = `https://${redirectBase}`
    }
    
    // For testing - log the redirect URL we're using
    console.log(`Using redirect URL: ${redirectBase}/auth/confirm`)
    
    // Sign up the user with email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectBase}/auth/confirm`,
      },
    });
    
    if (error) {
      console.error("Supabase signup error:", error)
      return NextResponse.json(
        { error: `Error: ${error.message}. Code: ${error.status || 'unknown'}` },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        message: "Check your email for a confirmation link", 
        user: data.user 
      }, 
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error("Unhandled error in signup route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred during sign up" },
      { status: 500 }
    )
  }
} 