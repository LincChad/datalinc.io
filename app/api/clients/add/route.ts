import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { isUserAdmin } from '@/lib/admin';

// Validation schema for creating a client
const clientSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  domain: z.string(),
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Authenticate the user first
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. You must be logged in to add a client.' },
        { status: 401 }
      );
    }
    
    // Check if the user is an admin
    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden. Only admin users can manage clients.' },
        { status: 403 }
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
    
    // Insert client using admin client
    const { data: client, error } = await supabase
      .from('clients')
      .insert(result.data)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      return NextResponse.json(
        { error: 'Failed to create client: ' + error.message },
        { status: 500 }
      );
    }
    
    // Create default form config for this client
    const { error: configError } = await supabase
      .from('form_configs')
      .insert({
        client_id: client.id,
        form_type: 'contact',
        recipient_emails: [client.email],
        success_message: `Thank you for contacting ${client.name}. We will get back to you shortly.`,
        is_active: true
      });
    
    if (configError) {
      console.error('Error creating form config:', configError);
      // We continue even if form config creation fails
    }
    
    return NextResponse.json(
      { message: 'Client created successfully', data: client },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error in add client route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 