"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { z } from "zod";

// Initialize service role client
async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }
  
  return createAdminClient(supabaseUrl, supabaseServiceKey);
}

const formConfigSchema = z.object({
  form_type: z.enum(["contact", "quote", "support", "other"]),
  recipient_emails: z.array(z.string().email()).min(1),
  success_message: z.string().min(10),
  is_active: z.boolean(),
  email_template: z.string().nullable(),
  form_fields: z.array(z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(["text", "email", "tel", "textarea", "select", "checkbox"]),
    required: z.boolean(),
    options: z.array(z.string()).optional()
  })).nullable()
});

export async function getFormConfigs(clientId: string) {
  try {
    // First check if the user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Authentication failed or user not logged in");
    }

    // Use service client for admin operations
    const serviceClient = await createServiceClient();
    const { data: formConfigs, error } = await serviceClient
      .from("form_configs")
      .select("*")
      .eq("client_id", clientId);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to fetch form configurations");
    }

    return formConfigs || [];
  } catch (err) {
    console.error("Error in getFormConfigs:", err);
    throw new Error("Failed to fetch form configurations");
  }
}

export async function createFormConfig(clientId: string, config: z.infer<typeof formConfigSchema>) {
  try {
    // First check if the user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Authentication failed or user not logged in");
    }

    // Validate config
    formConfigSchema.parse(config);

    // Use service client for admin operations
    const serviceClient = await createServiceClient();
    const { data, error } = await serviceClient
      .from("form_configs")
      .insert([
        {
          client_id: clientId,
          ...config,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to create form configuration");
    }

    return data;
  } catch (err) {
    console.error("Error in createFormConfig:", err);
    throw new Error("Failed to create form configuration");
  }
}

export async function updateFormConfig(
  configId: string,
  config: z.infer<typeof formConfigSchema>
) {
  try {
    // First check if the user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Authentication failed or user not logged in");
    }

    // Validate config
    formConfigSchema.parse(config);

    // Use service client for admin operations
    const serviceClient = await createServiceClient();
    const { data, error } = await serviceClient
      .from("form_configs")
      .update(config)
      .eq("id", configId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to update form configuration");
    }

    return data;
  } catch (err) {
    console.error("Error in updateFormConfig:", err);
    throw new Error("Failed to update form configuration");
  }
}

export async function deleteFormConfig(configId: string) {
  try {
    // First check if the user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("Authentication failed or user not logged in");
    }

    // Use service client for admin operations
    const serviceClient = await createServiceClient();
    const { error } = await serviceClient
      .from("form_configs")
      .delete()
      .eq("id", configId);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Failed to delete form configuration");
    }
  } catch (err) {
    console.error("Error in deleteFormConfig:", err);
    throw new Error("Failed to delete form configuration");
  }
} 