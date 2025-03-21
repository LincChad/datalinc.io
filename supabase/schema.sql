-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
  domain TEXT NOT NULL,
  company_name TEXT,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  address TEXT,
  notes TEXT
);

-- Form Submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'quote', 'support', 'other')),
  status TEXT NOT NULL CHECK (status IN ('new', 'pending', 'completed', 'rejected')),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_company TEXT,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  is_read BOOLEAN DEFAULT FALSE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled')),
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  invoice_number TEXT NOT NULL UNIQUE,
  stripe_invoice_id TEXT
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trial')),
  plan_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE
);

-- Form Configurations table
CREATE TABLE IF NOT EXISTS form_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'quote', 'support', 'other')),
  recipient_emails TEXT[] NOT NULL,
  email_template TEXT,
  success_message TEXT,
  form_fields JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(client_id, form_type)
);

-- Set up RLS (Row Level Security) policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_configs ENABLE ROW LEVEL SECURITY;

-- Create policies that allow authenticated users to access all data
-- In a production environment, you would want to make these more restrictive
CREATE POLICY "Allow authenticated users to access clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to access form submissions"
  ON form_submissions
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to access invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to access subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to access form configs"
  ON form_configs
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_form_submissions_client_id ON form_submissions(client_id);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_subscriptions_client_id ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_form_configs_client_id ON form_configs(client_id);

-- Insert some sample data for testing
INSERT INTO clients (name, email, status, domain, company_name, joined_date)
VALUES 
  ('Elite Concrete', 'info@elitecrete.com.au', 'active', 'https://www.elitecrete.com.au', 'Elite Concrete PTY LTD', NOW() - INTERVAL '2 months'),
  ('Outdoor Oasis', 'contact@outdooroasis.com.au', 'active', 'https://www.outdooroasis.com.au', 'Outdoor Oasis Landscapes', NOW() - INTERVAL '3 months'),
  ('Pilbara 3D', 'hello@pilbara3d.com.au', 'active', 'https://www.pilbara3d.com.au', 'Pilbara 3D Print Solutions', NOW() - INTERVAL '1 month');

-- Insert sample form submissions
INSERT INTO form_submissions (client_id, form_type, status, sender_name, sender_email, sender_company, message, submitted_at, is_read)
VALUES
  ((SELECT id FROM clients WHERE domain = 'https://www.elitecrete.com.au'), 'contact', 'new', 'John Smith', 'john@example.com', 'ABC Construction', 'I need a quote for a concrete driveway project.', NOW() - INTERVAL '2 days', false),
  ((SELECT id FROM clients WHERE domain = 'https://www.outdooroasis.com.au'), 'quote', 'completed', 'Sarah Johnson', 'sarah@example.com', 'Green Gardens', 'Looking for a complete landscape design for my backyard.', NOW() - INTERVAL '1 week', true),
  ((SELECT id FROM clients WHERE domain = 'https://www.pilbara3d.com.au'), 'support', 'pending', 'Michael Brown', 'michael@example.com', NULL, 'Having issues with my recent 3D print order.', NOW() - INTERVAL '3 days', true);

-- Insert sample form configs
INSERT INTO form_configs (client_id, form_type, recipient_emails, success_message, is_active)
VALUES
  ((SELECT id FROM clients WHERE domain = 'https://www.elitecrete.com.au'), 'contact', ARRAY['info@elitecrete.com.au'], 'Thank you for contacting Elite Concrete. We will get back to you shortly.', true),
  ((SELECT id FROM clients WHERE domain = 'https://www.outdooroasis.com.au'), 'quote', ARRAY['contact@outdooroasis.com.au', 'sales@outdooroasis.com.au'], 'Your quote request has been received. Our team will contact you within 24 hours.', true),
  ((SELECT id FROM clients WHERE domain = 'https://www.pilbara3d.com.au'), 'support', ARRAY['support@pilbara3d.com.au'], 'Your support request has been logged. A team member will assist you soon.', true); 