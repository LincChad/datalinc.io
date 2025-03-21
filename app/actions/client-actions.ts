"use server"

import { createClient } from "@/utils/supabase/server"
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { notFound } from "next/navigation"

// Define types for Supabase data
interface Client {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  joined_date: string
  avatar_url: string | null
  company_name: string | null
}

// Extended Client type with all details
export interface ClientDetails {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  domain: string
  company_name: string | null
  joined_date: string
  avatar_url: string | null
  contact_person: string | null
  contact_phone: string | null
  address: string | null
  notes: string | null
  created_at: string
}

interface ClientStats {
  active: number
  inactive: number
  pending: number
}

interface ClientsResponse {
  clients: Client[]
  stats: ClientStats
  newClients: Client[]
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

// Server action to get a single client by ID
export async function getClient(id: string): Promise<ClientDetails> {
  try {
    // First check if the user is authenticated
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.log('Authentication error:', authError)
      throw new Error('Authentication failed or user not logged in')
    }
    
    // Try with the regular client first
    const { data: initialData, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single()
    
    let data = initialData
    
    // If there's an error, check if user is admin and try with service client
    if (error || !data) {
      const isAdmin = await isUserAdmin(authData.user.id)
      
      if (!isAdmin) {
        console.log('User is not admin, access denied')
        notFound()
      }
      
      // Try with service client
      const serviceClient = await createServiceClient()
      const result = await serviceClient
        .from("clients")
        .select("*")
        .eq("id", id)
        .single()
      
      if (result.error || !result.data) {
        console.error("Error fetching client:", result.error)
        notFound()
      }
      
      data = result.data
    }
    
    return data as ClientDetails
  } catch (error) {
    console.error("Error in getClient server action:", error)
    notFound()
  }
}

// Schema for client creation validation
const clientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  domain: z.string().url({ message: "Please enter a valid URL for the domain." }),
  company_name: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Type for client creation
export type ClientFormData = z.infer<typeof clientSchema>;

// Server action to add a new client
export async function addClient(formData: ClientFormData) {
  try {
    // First check if the user is authenticated
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.log('Authentication error:', authError)
      return { success: false, error: 'Authentication failed or user not logged in' }
    }
    
    // Validate the form data
    const result = clientSchema.safeParse(formData)
    if (!result.success) {
      const errorMessage = result.error.errors.map(e => e.message).join(', ')
      return { success: false, error: errorMessage }
    }
    
    // Use service client to check if user is an admin
    const serviceClient = await createServiceClient()
    const { data: adminData, error: adminError } = await serviceClient
      .from('admin_users')
      .select('role, email')
      .eq('id', authData.user.id)
      .single()
    
    if (adminError || !adminData) {
      return { success: false, error: 'Only admin users can add clients' }
    }
    
    // Insert new client using service client
    const { data: client, error: insertError } = await serviceClient
      .from('clients')
      .insert({
        ...result.data,
        joined_date: new Date().toISOString()
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error creating client:', insertError)
      return { success: false, error: `Failed to create client: ${insertError.message}` }
    }
    
    // Revalidate clients page to show the new client
    revalidatePath('/dashboard/clients')
    
    return { 
      success: true, 
      message: `Client ${formData.name} added successfully`, 
      client 
    }
  } catch (error) {
    console.error('Error in addClient server action:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function getClients(): Promise<ClientsResponse> {
  try {
    // First check if the user is authenticated
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.log('Authentication error:', authError)
      throw new Error('Authentication failed or user not logged in')
    }
    
    console.log(`User authenticated: ${authData.user.email} (${authData.user.id})`)
    
    // Try first with the regular client
    const { data: initialClientsData, error } = await supabase
      .from('clients')
      .select('*')
      .order('joined_date', { ascending: false })
    
    let clientsData = initialClientsData
    
    // If there's an error or no data with regular client, 
    // check if user is an admin and use service role client
    if (error || !clientsData || clientsData.length === 0) {
      console.log('Regular client failed, checking if user is admin')
      
      // Use service client to check if user is an admin
      const serviceClient = await createServiceClient()
      const { data: adminData, error: adminError } = await serviceClient
        .from('admin_users')
        .select('role, email')
        .eq('id', authData.user.id)
        .single()
      
      if (adminError || !adminData) {
        console.log('User is not an admin, access denied')
        return { 
          clients: [], 
          stats: { active: 0, inactive: 0, pending: 0 }, 
          newClients: [] 
        }
      }
      
      console.log(`Admin verified: ${adminData.email} with role ${adminData.role}`)
      
      // Now try using service client to fetch clients
      const result = await serviceClient
        .from('clients')
        .select('*')
        .order('joined_date', { ascending: false })
      
      if (result.error) {
        console.error('Error fetching clients with service client:', result.error)
        throw result.error
      }
      
      clientsData = result.data
    }
    
    if (!clientsData || clientsData.length === 0) {
      console.log('No clients found in database')
      return { 
        clients: [], 
        stats: { active: 0, inactive: 0, pending: 0 }, 
        newClients: [] 
      }
    }
    
    console.log(`Found ${clientsData.length} clients`)
    
    const clients = clientsData as Client[]
    
    // Calculate stats
    const active = clients.filter(client => client.status === 'active').length
    const inactive = clients.filter(client => client.status === 'inactive').length
    const pending = clients.filter(client => client.status === 'pending').length
    
    const stats = {
      active,
      inactive,
      pending
    }
    
    // Get recent clients (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentClients = clients.filter(client => {
      const joinedDate = new Date(client.joined_date)
      return joinedDate >= thirtyDaysAgo
    })
    
    const newClients = recentClients.slice(0, 3) as Client[]
    
    return { clients, stats, newClients }
  } catch (error) {
    console.error('Error in getClients server action:', error)
    throw new Error('Failed to fetch clients')
  }
}

// Server action to update an existing client
export async function updateClient(id: string, formData: ClientFormData) {
  try {
    // First check if the user is authenticated
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.log('Authentication error:', authError)
      return { success: false, error: 'Authentication failed or user not logged in' }
    }
    
    // Validate the form data
    const result = clientSchema.safeParse(formData)
    if (!result.success) {
      const errorMessage = result.error.errors.map(e => e.message).join(', ')
      return { success: false, error: errorMessage }
    }
    
    // Check if user is an admin
    const isAdmin = await isUserAdmin(authData.user.id)
    if (!isAdmin) {
      return { success: false, error: 'Only admin users can update clients' }
    }
    
    // Update client using service client
    const serviceClient = await createServiceClient()
    const { data: client, error: updateError } = await serviceClient
      .from('clients')
      .update(result.data)
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating client:', updateError)
      return { success: false, error: `Failed to update client: ${updateError.message}` }
    }
    
    // Revalidate client pages to show updated data
    revalidatePath('/dashboard/clients')
    revalidatePath(`/dashboard/clients/${id}`)
    
    return { 
      success: true, 
      message: `Client ${formData.name} updated successfully`, 
      client 
    }
  } catch (error) {
    console.error('Error in updateClient server action:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

// Server action to delete a client
export async function deleteClient(id: string) {
  try {
    // First check if the user is authenticated
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.log('Authentication error:', authError)
      return { success: false, error: 'Authentication failed or user not logged in' }
    }
    
    // Check if user is an admin
    const isAdmin = await isUserAdmin(authData.user.id)
    if (!isAdmin) {
      return { success: false, error: 'Only admin users can delete clients' }
    }
    
    // Get client name before deletion for success message
    const serviceClient = await createServiceClient()
    const { data: client } = await serviceClient
      .from('clients')
      .select('name')
      .eq('id', id)
      .single()
    
    // Delete client using service client
    const { error: deleteError } = await serviceClient
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (deleteError) {
      console.error('Error deleting client:', deleteError)
      return { success: false, error: `Failed to delete client: ${deleteError.message}` }
    }
    
    // Revalidate clients page
    revalidatePath('/dashboard/clients')
    
    return { 
      success: true, 
      message: `Client ${client?.name || ''} deleted successfully`
    }
  } catch (error) {
    console.error('Error in deleteClient server action:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
} 