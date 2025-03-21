"use server"

import { createClient } from "@/utils/supabase/server"
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Define types for Supabase data
interface Client {
  id: string
  name: string
  domain: string
}

export interface FormSubmission {
  id: string
  form_type: string
  sender_name: string
  sender_email: string
  message: string
  submitted_at: string
  status: "completed" | "pending" | "rejected" | "new"
  client_id: string
  clients: Client | null
}

export interface SubmissionStats {
  total: number
  thisMonth: number
  completed: number
  pending: number
  rejected: number
  new: number
}

export interface SubmissionsResponse {
  submissions: FormSubmission[]
  stats: SubmissionStats
}

// Create a service role client for admin access
async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
  }
  
  return createAdminClient(supabaseUrl, supabaseServiceKey)
}

// Check if a user is an admin
async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false
  
  try {
    const serviceClient = await createServiceClient()
    const { data, error } = await serviceClient
      .from('admin_users')
      .select('role')
      .eq('id', userId)
      .single()
    
    return !error && !!data
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Server action to get all form submissions
export async function getSubmissions(): Promise<SubmissionsResponse> {
  try {
    // First check if the user is authenticated
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.log('Authentication error:', authError)
      throw new Error('Authentication failed or user not logged in')
    }
    
    console.log(`User authenticated: ${authData.user.email} (${authData.user.id})`)
    
    // Check if user is an admin using service client
    const isAdmin = await isUserAdmin(authData.user.id)
    
    if (!isAdmin) {
      console.log('User is not an admin, access denied')
      throw new Error('Only admin users can access submissions')
    }
    
    // Get current date for monthly calculations
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    
    // Use service client to fetch submissions regardless of RLS
    const serviceClient = await createServiceClient()
    const { data: submissionsData, error } = await serviceClient
      .from('form_submissions')
      .select(`
        id,
        form_type,
        sender_name,
        sender_email,
        message,
        submitted_at,
        status,
        client_id,
        clients (
          id,
          name,
          domain
        )
      `)
      .order('submitted_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching submissions:', error)
      throw error
    }
    
    if (!submissionsData || submissionsData.length === 0) {
      console.log('No submissions found')
      return {
        submissions: [],
        stats: {
          total: 0,
          thisMonth: 0,
          completed: 0,
          pending: 0,
          rejected: 0,
          new: 0
        }
      }
    }
    
    console.log(`Found ${submissionsData.length} submissions`)
    
    // Type handling - this uses a more explicit approach to avoid TypeScript issues
    const submissions = submissionsData.map(submission => {
      // Handle the clients field properly
      let clientData: Client | null = null;
      
      if (submission.clients) {
        if (Array.isArray(submission.clients) && submission.clients.length > 0) {
          // Handle array case
          const firstClient = submission.clients[0];
          clientData = {
            id: String(firstClient.id || ''),
            name: String(firstClient.name || ''),
            domain: String(firstClient.domain || '')
          };
        } else if (typeof submission.clients === 'object') {
          // Handle object case
          const clientObj = submission.clients as { id?: string; name?: string; domain?: string };
          clientData = {
            id: String(clientObj.id || ''),
            name: String(clientObj.name || ''),
            domain: String(clientObj.domain || '')
          };
        }
      }
      
      return {
        id: submission.id,
        form_type: submission.form_type,
        sender_name: submission.sender_name,
        sender_email: submission.sender_email,
        message: submission.message,
        submitted_at: submission.submitted_at,
        status: submission.status as "completed" | "pending" | "rejected" | "new",
        client_id: submission.client_id,
        clients: clientData
      }
    }) as unknown as FormSubmission[]
    
    // Calculate stats
    const total = submissions.length
    const thisMonth = submissions.filter(
      sub => new Date(sub.submitted_at) >= new Date(firstDayOfMonth)
    ).length
    
    const completed = submissions.filter(sub => sub.status === 'completed').length
    const pending = submissions.filter(sub => sub.status === 'pending').length
    const rejected = submissions.filter(sub => sub.status === 'rejected').length
    const newSubmissions = submissions.filter(sub => sub.status === 'new').length
    
    const stats = {
      total,
      thisMonth,
      completed,
      pending,
      rejected,
      new: newSubmissions
    }
    
    return { submissions, stats }
  } catch (error) {
    console.error('Error in getSubmissions server action:', error)
    throw new Error('Failed to fetch submissions')
  }
}

// Server action to update submission status
export async function updateSubmissionStatus(id: string, status: "completed" | "pending" | "rejected" | "new") {
  try {
    // Check if the user is authenticated
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.log('Authentication error:', authError)
      return { success: false, error: 'Authentication failed or user not logged in' }
    }
    
    // Check if user is an admin
    const isAdmin = await isUserAdmin(authData.user.id)
    if (!isAdmin) {
      return { success: false, error: 'Only admin users can update submissions' }
    }
    
    // Update submission using service client
    const serviceClient = await createServiceClient()
    const { data, error: updateError } = await serviceClient
      .from('form_submissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating submission:', updateError)
      return { success: false, error: `Failed to update submission: ${updateError.message}` }
    }
    
    // Revalidate submissions pages
    revalidatePath('/dashboard/submissions')
    revalidatePath(`/dashboard/submissions/${id}`)
    
    return { 
      success: true, 
      message: `Submission updated to ${status} successfully`, 
      submission: data 
    }
  } catch (error) {
    console.error('Error in updateSubmissionStatus server action:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
} 