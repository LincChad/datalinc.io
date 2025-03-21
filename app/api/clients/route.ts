import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for creating/updating a client
const clientSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  domain: z.string().url({
    message: "Please enter a valid URL for the domain.",
  }),
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  avatar_url: z.string().optional(),
});

// GET: Get all clients
export async function GET(request: Request) {
  try {
    // Create authenticated Supabase client using cookies
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get search params for filtering/pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Build the query
    let query = supabase.from('clients').select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .order('joined_date', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json(
        { error: 'Failed to fetch clients' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data,
      total: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    });
    
  } catch (error) {
    console.error('Error in clients route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new client
export async function POST(request: Request) {
  try {
    // Create authenticated Supabase client using cookies
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const result = clientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid client data", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Insert new client
    const { data, error } = await supabase
      .from('clients')
      .insert(result.data)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      return NextResponse.json(
        { error: 'Failed to create client' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Client created successfully', data },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error in clients route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 