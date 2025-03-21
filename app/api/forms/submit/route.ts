import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from 'zod';
import { corsMiddleware } from '@/utils/cors';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Generic form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  clientId: z.string().uuid({
    message: "Invalid client ID.",
  }),
  formType: z.enum(['contact', 'quote', 'support', 'other']),
  metadata: z.record(z.any()).optional(),
});

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  const corsResult = await corsMiddleware(request);
  if (corsResult instanceof Response) {
    return corsResult;
  }
  return new Response(null, { status: 204 });
}

export async function POST(request: Request) {
  try {
    // Handle CORS
    const corsResult = await corsMiddleware(request);
    if (corsResult instanceof Response) {
      return corsResult;
    }
    if (!corsResult) {
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    
    // Validate the request body
    const result = formSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: "Invalid form data", details: result.error.format() }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsResult
          }
        }
      );
    }

    const { name, email, company, message, clientId, formType, metadata } = result.data;

    // Get client details and form configuration
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('name, email, domain')
      .eq('id', clientId)
      .single();

    if (clientError || !clientData) {
      console.error('Error fetching client:', clientError);
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsResult
          }
        }
      );
    }

    // Get form configuration for this client
    const { data: formConfig, error: formConfigError } = await supabase
      .from('form_configs')
      .select('recipient_emails, email_template, success_message')
      .eq('client_id', clientId)
      .eq('form_type', formType)
      .eq('is_active', true)
      .single();

    if (formConfigError) {
      console.log('formConfigError:', formConfigError);
    }

    // Default to client email if no form config exists
    const recipientEmails = formConfig?.recipient_emails || [clientData.email];
    
    // Insert form submission to database
    const { data: submissionData, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        client_id: clientId,
        form_type: formType,
        status: 'new',
        sender_name: name,
        sender_email: email,
        sender_company: company || null,
        message,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error saving form submission:', submissionError);
      return new Response(
        JSON.stringify({ error: 'Failed to save form submission' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsResult
          }
        }
      );
    }

    // Send email notification
    const { error: emailError } = await resend.emails.send({
      from: 'Form Submission <forms@datalinc.io>',
      to: recipientEmails,
      subject: `New ${formType.charAt(0).toUpperCase() + formType.slice(1)} Form Submission from ${name}`,
      html: `
        <h2>New ${formType.charAt(0).toUpperCase() + formType.slice(1)} Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Submitted From:</strong> ${clientData.domain}</p>
        ${metadata ? `<p><strong>Additional Information:</strong></p>
        <pre>${JSON.stringify(metadata, null, 2)}</pre>` : ''}
        <hr />
        <img src="https://datalinc.io/datalincLogoOG.png" alt="Datalinc Logo" />
        <p><small>You received this email because you are registered to receive form submissions from your website via Datalinc Pty Ltd.</small></p>
        <p><small>Submission ID: ${submissionData.id}</small></p>
      `,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      // Continue execution even if email fails
      // Update submission status to reflect email failure
      await supabase
        .from('form_submissions')
        .update({ status: 'pending' })
        .eq('id', submissionData.id);
    }

    return new Response(
      JSON.stringify({ 
        message: formConfig?.success_message || 'Form submission received successfully',
        id: submissionData.id,
        success: true
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsResult
        }
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    const corsResult = await corsMiddleware(request);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...(corsResult instanceof Response ? {} : corsResult || {})
        }
      }
    );
  }
} 