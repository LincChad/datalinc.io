import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for updating a submission
const submissionUpdateSchema = z.object({
  status: z.enum(['new', 'pending', 'completed', 'rejected']).optional(),
  is_read: z.boolean().optional(),
  notes: z.string().optional(), // Add a notes field if needed
});

// GET: Get a single form submission by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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
    
    const params = await context.params;
    const { id } = params;
    
    // Fetch submission with client info
    const { data, error } = await supabase
      .from('form_submissions')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          domain,
          company_name
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return NextResponse.json(
          { error: 'Form submission not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching form submission:', error);
      return NextResponse.json(
        { error: 'Failed to fetch form submission' },
        { status: 500 }
      );
    }
    
    // Mark as read if it wasn't already
    if (!data.is_read) {
      await supabase
        .from('form_submissions')
        .update({ is_read: true })
        .eq('id', id);
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in submission route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update a form submission (e.g., change status)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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
    
    const params = await context.params;
    const { id } = params;
    const body = await request.json();
    
    // Validate request body
    const result = submissionUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid submission data", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Update submission
    const { data, error } = await supabase
      .from('form_submissions')
      .update(result.data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating form submission:', error);
      return NextResponse.json(
        { error: 'Failed to update form submission' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Form submission updated successfully', data },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in submission route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a form submission
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
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
    
    const params = await context.params;
    const { id } = params;
    
    // Delete submission
    const { error } = await supabase
      .from('form_submissions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting form submission:', error);
      return NextResponse.json(
        { error: 'Failed to delete form submission' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Form submission deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error in submission route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 