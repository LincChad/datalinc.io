import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

type CorsHeaders = {
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
  'Access-Control-Max-Age'?: string;
};

export async function validateCorsOrigin(origin: string | null): Promise<boolean> {
  if (!origin) return false;

  // Always allow datalinc.io and its subdomains
  if (origin.match(/^https?:\/\/(.*\.)?datalinc\.io$/)) {
    return true;
  }

  // Allow localhost in development
  if (process.env.NODE_ENV === 'development' && origin.match(/^https?:\/\/localhost(:\d+)?$/)) {
    return true;
  }

  try {
    // Clean the origin for comparison with stored domains
    const cleanOrigin = origin
      .replace(/^https?:\/\//, '') // Remove protocol
      .replace(/:\d+$/, '')        // Remove port
      .replace(/\/$/, '');         // Remove trailing slash

    // Special handling for localhost in the database
    if (cleanOrigin.startsWith('localhost')) {
      const { data: client, error } = await supabase
        .from('clients')
        .select('id')
        .eq('status', 'active')
        .eq('domain', 'localhost')
        .maybeSingle();

      if (!error && client) {
        return true;
      }
    }

    // Check if the origin matches any client's domain
    const { data: client, error } = await supabase
      .from('clients')
      .select('id')
      .eq('status', 'active')
      .eq('domain', cleanOrigin)
      .maybeSingle();

    if (error) {
      console.error('Error checking client domain:', error);
      return false;
    }

    return !!client;
  } catch (error) {
    console.error('Error in CORS validation:', error);
    return false;
  }
}

export async function corsMiddleware(request: Request): Promise<Response | CorsHeaders | null> {
  try {
    
    const origin = request.headers.get('origin');

    console.log('CORS Check - Origin:', origin); // Add logging

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const isValid = await validateCorsOrigin(origin);
      console.log('CORS Preflight - Valid:', isValid); // Add logging
      if (!isValid) {
        return new Response(null, {
          status: 403,
          statusText: 'Forbidden',
        });
      }

      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin || '',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // For actual requests, return the headers to be used
    const isValid = await validateCorsOrigin(origin);
    console.log('CORS Request - Valid:', isValid); // Add logging
    return isValid
      ? {
          'Access-Control-Allow-Origin': origin || '',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      : null;
  } catch (error) {
    console.error('Error in CORS middleware:', error);
    return null;
  }
}