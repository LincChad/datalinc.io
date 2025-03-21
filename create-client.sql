-- Insert a new client
INSERT INTO clients (name, email, status, domain, company_name, contact_person, contact_phone)
VALUES 
  ('New Client Name', 'client@example.com', 'active', 'https://www.example.com', 'Example Company Ltd', 'John Contact', '+1234567890');

-- Get the ID of the newly created client to use in form_configs
SELECT id FROM clients WHERE email = 'client@example.com'; 