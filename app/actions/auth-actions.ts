"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required"
    }
  }
  
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      return {
        success: false,
        error: error.message
      }
    }
    
    // Revalidate all paths to refresh auth state
    revalidatePath("/", "layout")
    
    return {
      success: true
    }
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required"
    }
  }
  
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) {
      return {
        success: false,
        error: error.message
      }
    }
    
    // Revalidate all paths to refresh auth state
    revalidatePath("/", "layout")
    
    return {
      success: true,
      message: "Check your email to confirm your account"
    }
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

export async function logout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    
    // Revalidate all paths to refresh auth state
    revalidatePath("/", "layout")
    
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to log out"
    }
  }
} 