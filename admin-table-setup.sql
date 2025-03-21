-- Create admin users table to track users with admin privileges
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policy for admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view the admin_users table
CREATE POLICY "Admins can view admin_users" 
  ON admin_users
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users));
  
-- Only super_admins can insert/update/delete from admin_users  
CREATE POLICY "Super admins can manage admin_users" 
  ON admin_users
  FOR ALL 
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin'));

-- Update policies for clients table to restrict to admin users only
DROP POLICY IF EXISTS "Allow authenticated users to access clients" ON clients;
CREATE POLICY "Only admins can access clients"
  ON clients
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Update policies for form_submissions table
DROP POLICY IF EXISTS "Allow authenticated users to access form submissions" ON form_submissions;
CREATE POLICY "Only admins can access form submissions"
  ON form_submissions
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Update policies for form_configs table
DROP POLICY IF EXISTS "Allow authenticated users to access form configs" ON form_configs;  
CREATE POLICY "Only admins can access form configs"
  ON form_configs
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Update policies for invoices table
DROP POLICY IF EXISTS "Allow authenticated users to access invoices" ON invoices;
CREATE POLICY "Only admins can access invoices"
  ON invoices
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Update policies for subscriptions table
DROP POLICY IF EXISTS "Allow authenticated users to access subscriptions" ON subscriptions;
CREATE POLICY "Only admins can access subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Insert the first admin user (use your own admin user ID)
-- Replace 'YOUR_USER_ID' and 'YOUR_EMAIL' with your actual values
INSERT INTO admin_users (id, email, role)
VALUES 
  ('YOUR_USER_ID', 'YOUR_EMAIL', 'super_admin'); 