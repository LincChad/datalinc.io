import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Sign out the user
    await supabase.auth.signOut()
    
    // Return success response and redirect to home page
    const response = NextResponse.json(
      { message: "Successfully signed out" },
      { status: 200 },
    )
    
    // Set redirect header to home page
    response.headers.set("Location", "/")
    response.headers.set("Content-Type", "application/json")
    
    return response
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign out" },
      { status: 500 }
    )
  }
} 