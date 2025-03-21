-- Replace CLIENT_ID with the actual UUID from the previous query
INSERT INTO form_configs (client_id, form_type, recipient_emails, success_message, is_active)
VALUES
  ('CLIENT_ID', 'contact', ARRAY['client@example.com', 'manager@example.com'], 'Thank you for contacting us. We will get back to you shortly.', true);

-- You can add multiple form types for the same client
INSERT INTO form_configs (client_id, form_type, recipient_emails, success_message, is_active)
VALUES
  ('CLIENT_ID', 'quote', ARRAY['sales@example.com'], 'Your quote request has been received. We will contact you within 24 hours.', true); 