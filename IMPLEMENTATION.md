# Datalinc Agency Dashboard Implementation Guide

This guide outlines the steps to implement the Datalinc Agency Dashboard with integrated form submission handling, client management, and more.

## 1. Database Setup

### Supabase Configuration

1. Log in to your Supabase dashboard and select your project
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/schema.sql` and paste it into a new SQL query
4. Run the query to create all tables, RLS policies, and sample data

### Environment Variables

Ensure your `.env.local` file contains the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
```

## 2. Form Submission Setup for Client Websites

### Option 1: JavaScript SDK

1. Host the `form-sdk.js` file on your server or CDN
2. Add it to the client's website using a script tag:

```html
<script src="https://datalinc.io/form-sdk.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const formHandler = new DatalincForm({
      clientId: 'your-client-id', // Get this from the dashboard
      formType: 'contact' // or 'quote', 'support', etc.
    }).createFormHandler('#contact-form', {
      onSuccess: function(response) {
        // Show success message
        alert('Thank you for your message. We will get back to you shortly.');
      },
      onError: function(error) {
        // Show error message
        alert('There was an error submitting your form. Please try again.');
      }
    });
  });
</script>
```

### Option 2: Direct API Integration

Clients can also make a direct POST request to the API:

```javascript
fetch('https://datalinc.io/api/forms/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I would like to inquire about your services.',
    company: 'ACME Corp',
    clientId: 'your-client-id',
    formType: 'contact'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Option 3: Legacy Contact Form Integration

For existing contact forms, append the client ID to the request:

```javascript
fetch('https://datalinc.io/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I would like to inquire about your services.',
    company: 'ACME Corp',
    clientId: 'your-client-id' // This is the only change needed
  })
})
```

## 3. Form Configuration

For each client, you'll need to create a form configuration to determine:

1. Who receives email notifications for form submissions
2. What success message to display to users
3. Any custom fields or templates for the forms

Use the Dashboard UI to configure these settings or use the API:

```javascript
// Example: Create a form configuration
fetch('https://datalinc.io/api/form-configs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  },
  body: JSON.stringify({
    client_id: 'client-uuid',
    form_type: 'contact',
    recipient_emails: ['client@example.com', 'manager@datalinc.io'],
    success_message: 'Thank you for your message. We will respond within 24 hours.',
    is_active: true
  })
})
```

## 4. Testing Form Submissions

1. Add a client through the Dashboard UI
2. Configure their form settings
3. Use the Form SDK in a test page with their client ID
4. Submit a test form
5. Verify the submission appears in the Dashboard
6. Verify the email notification was sent to the configured recipients

## 5. Next Steps

After implementing the basic form submission flow, you can proceed with:

1. Adding invoice management
2. Implementing subscription tracking with Stripe
3. Setting up analytics dashboards
4. Building client access portal

## Troubleshooting

- **Form submissions not appearing in dashboard**: Check that the client ID is correct and that the form is properly configured
- **No email notifications**: Verify Resend API keys and that recipient emails are correctly configured
- **Authentication issues**: Ensure Supabase authentication is properly set up and working