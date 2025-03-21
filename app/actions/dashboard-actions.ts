"use server"

import { createClient } from "@/utils/supabase/server"
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Types for dashboard data
export interface ActivityItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  time: string;
}

export interface DashboardStats {
  totalClients: string;
  formSubmissions: string;
  activeSubscriptions: string;
  revenue: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
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

// Server action to get dashboard data
export async function getDashboardData(): Promise<DashboardData> {
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
      throw new Error('Only admin users can access dashboard data')
    }
    
    // Use service client to fetch data regardless of RLS
    const serviceClient = await createServiceClient()
    
    // Fetch total clients count
    const { count: clientsCount, error: clientsError } = await serviceClient
      .from('clients')
      .select('*', { count: 'exact', head: true })
      
    if (clientsError) {
      console.error('Error fetching clients count:', clientsError)
      throw clientsError
    }
    
    // Fetch total submissions count
    const { count: submissionsCount, error: submissionsError } = await serviceClient
      .from('form_submissions')
      .select('*', { count: 'exact', head: true })
      
    if (submissionsError) {
      console.error('Error fetching submissions count:', submissionsError)
      throw submissionsError
    }
    
    // Fetch active subscriptions count
    const { count: subscriptionsCount, error: subscriptionsError } = await serviceClient
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      
    if (subscriptionsError) {
      console.error('Error fetching subscriptions count:', subscriptionsError)
      // Just log this error but continue - subscriptions might not exist yet
      console.log('Using default value for subscriptions')
    }
    
    // Fetch recent activity (form submissions)
    const { data: recentSubmissions, error: recentSubmissionsError } = await serviceClient
      .from('form_submissions')
      .select(`
        id,
        form_type,
        sender_name,
        message,
        submitted_at,
        client_id,
        clients (
          name
        )
      `)
      .order('submitted_at', { ascending: false })
      .limit(5)
      
    if (recentSubmissionsError) {
      console.error('Error fetching recent submissions:', recentSubmissionsError)
      throw recentSubmissionsError
    }
    
    // Format the recent submissions for activity feed
    const formattedActivity = (recentSubmissions || []).map(submission => {
      const submittedDate = new Date(submission.submitted_at)
      const now = new Date()
      
      // Format time: if today, show time, else show date
      let timeDisplay
      if (submittedDate.toDateString() === now.toDateString()) {
        const hours = submittedDate.getHours()
        const minutes = submittedDate.getMinutes()
        timeDisplay = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
      } else {
        timeDisplay = submittedDate.toLocaleDateString()
      }
      
      // Safely access the client name
      let clientName = 'Unknown client'
      if (submission.clients) {
        if (Array.isArray(submission.clients) && submission.clients.length > 0) {
          clientName = String(submission.clients[0].name) || 'Unknown client'
        } else if (typeof submission.clients === 'object') {
          clientName = String((submission.clients as { name?: string }).name) || 'Unknown client'
        }
      }
      
      return {
        id: submission.id,
        iconName: submission.form_type,
        title: `New ${submission.form_type} Form Submission`,
        description: `${submission.sender_name} from ${clientName}`,
        time: timeDisplay
      } as ActivityItem
    })
    
    // Calculate total revenue (placeholder for now)
    const revenue = "$0" // This would be calculated from invoices/subscriptions in a real implementation
    
    const stats: DashboardStats = {
      totalClients: clientsCount?.toString() || "0",
      formSubmissions: submissionsCount?.toString() || "0",
      activeSubscriptions: subscriptionsCount?.toString() || "0",
      revenue
    }
    
    return { 
      stats,
      recentActivity: formattedActivity 
    }
  } catch (error) {
    console.error('Error in getDashboardData server action:', error)
    throw new Error('Failed to fetch dashboard data')
  }
} 