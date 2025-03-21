import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for form configs
const formConfigSchema = z.object({
  client_id: z.string().uuid(),
  form_type: z.enum(['contact', 'quote', 'support', 'other']),
  recipient_emails: z.array(z.string().email()).min(1),
  email_template: z.string().optional(),
  success_message: z.string().optional(),
  form_fields: z.record(z.any()).optional(),
  is_active: z.boolean().default(true),
});

// GET: Get all form configs with filtering
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
    
    // Get search params for filtering
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const formType = searchParams.get('formType');
    const isActive = searchParams.get('isActive');
    
    // Build the query
    let query = supabase
      .from('form_configs')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          domain
        )
      `);
    
    // Apply filters if provided
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    if (formType) {
      query = query.eq('form_type', formType);
    }
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching form configs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch form configs' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
    
  } catch (error) {
    console.error('Error in form-configs route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new form config
export async function POST(request: Request) {
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
    
    const body = await request.json();
    
    // Validate request body
    const result = formConfigSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form config data", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Check if client exists
    const { data: clientExists, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('id', result.data.client_id)
      .maybeSingle();
    
    if (clientError || !clientExists) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Check for existing config for this client and form type
    const { data: existingConfig } = await supabase
      .from('form_configs')
      .select('id')
      .eq('client_id', result.data.client_id)
      .eq('form_type', result.data.form_type)
      .maybeSingle();
    
    if (existingConfig) {
      // Update existing config
      const { data, error } = await supabase
        .from('form_configs')
        .update(result.data)
        .eq('id', existingConfig.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating form config:', error);
        return NextResponse.json(
          { error: 'Failed to update form config' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { message: 'Form config updated successfully', data },
        { status: 200 }
      );
    } else {
      // Insert new config
      const { data, error } = await supabase
        .from('form_configs')
        .insert(result.data)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating form config:', error);
        return NextResponse.json(
          { error: 'Failed to create form config' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { message: 'Form config created successfully', data },
        { status: 201 }
      );
    }
    
  } catch (error) {
    console.error('Error in form-configs route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 