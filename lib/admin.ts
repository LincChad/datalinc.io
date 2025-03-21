import { createClient } from '@/utils/supabase/client';

const adminSupabase = await createClient();

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}

/**
 * Checks if a user is an admin
 * @param userId The user ID to check
 * @returns True if the user is an admin, false otherwise
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await adminSupabase
    .from('admin_users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  return true;
}

/**
 * Checks if a user is a super admin
 * @param userId The user ID to check
 * @returns True if the user is a super admin, false otherwise
 */
export async function isUserSuperAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await adminSupabase
    .from('admin_users')
    .select('role')
    .eq('id', userId)
    .eq('role', 'super_admin')
    .single();
  
  if (error || !data) {
    return false;
  }
  
  return true;
}

/**
 * Gets a user's admin information
 * @param userId The user ID to check
 * @returns The admin user object or null if not an admin
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  if (!userId) return null;
  
  const { data, error } = await adminSupabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as AdminUser;
} 