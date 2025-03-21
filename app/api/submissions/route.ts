import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Get all form submissions with filtering and pagination
export async function GET(request: Request) {
  try {
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
    const formType = searchParams.get('formType');
    const clientId = searchParams.get('clientId');
    const search = searchParams.get('search');
    
    // Build the base query with joins for client info
    let query = supabase
      .from('form_submissions')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          domain
        )
      `, { count: 'exact' });
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (formType) {
      query = query.eq('form_type', formType);
    }
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    if (search) {
      query = query.or(`sender_name.ilike.%${search}%,sender_email.ilike.%${search}%,message.ilike.%${search}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .order('submitted_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error('Error fetching form submissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch form submissions' },
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
    console.error('Error in submissions route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 