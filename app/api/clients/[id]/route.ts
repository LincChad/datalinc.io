import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for updating a client
const clientUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  status: z.enum(["active", "inactive", "pending"]).optional(),
  domain: z.string().url().optional(),
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  avatar_url: z.string().optional(),
});

// GET: Get a single client by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    // Fetch client and their form submissions, invoices and subscriptions
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (clientError) {
      if (clientError.code === "PGRST116") {
        // Not found
        return NextResponse.json(
          { error: "Client not found" },
          { status: 404 }
        );
      }

      console.error("Error fetching client:", clientError);
      return NextResponse.json(
        { error: "Failed to fetch client" },
        { status: 500 }
      );
    }

    // Get related records count
    const [submissionsResult, invoicesResult, subscriptionsResult] =
      await Promise.all([
        supabase
          .from("form_submissions")
          .select("id", { count: "exact" })
          .eq("client_id", id),
        supabase
          .from("invoices")
          .select("id", { count: "exact" })
          .eq("client_id", id),
        supabase
          .from("subscriptions")
          .select("id", { count: "exact" })
          .eq("client_id", id),
      ]);

    return NextResponse.json({
      ...client,
      stats: {
        submissions_count: submissionsResult.count || 0,
        invoices_count: invoicesResult.count || 0,
        subscriptions_count: subscriptionsResult.count || 0,
      },
    });
  } catch (error) {
    console.error("Error in client route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update a client
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    const body = await request.json();

    // Validate request body
    const result = clientUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid client data", details: result.error.format() },
        { status: 400 }
      );
    }

    // Update client
    const { data, error } = await supabase
      .from("clients")
      .update(result.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      return NextResponse.json(
        { error: "Failed to update client" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Client updated successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in client route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a client
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;

    // Delete client (related records will be cascade deleted due to foreign key constraints)
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      console.error("Error deleting client:", error);
      return NextResponse.json(
        { error: "Failed to delete client" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in client route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
