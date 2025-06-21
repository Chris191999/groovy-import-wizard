
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Get environment variables
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');

console.log('Environment check:', {
  hasResendKey: !!RESEND_API_KEY,
  hasAdminEmail: !!ADMIN_EMAIL,
  resendKeyStart: RESEND_API_KEY?.substring(0, 10),
  adminEmail: ADMIN_EMAIL
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200 
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  // Check if required environment variables are set
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY environment variable is not set');
    return new Response('Server configuration error: Missing API key', { 
      status: 500,
      headers: corsHeaders 
    });
  }

  if (!ADMIN_EMAIL) {
    console.error('ADMIN_EMAIL environment variable is not set');
    return new Response('Server configuration error: Missing admin email', { 
      status: 500,
      headers: corsHeaders 
    });
  }

  let data;
  try {
    data = await req.json();
    console.log('Received signup data:', data);
  } catch (e) {
    console.error('Invalid JSON:', e);
    return new Response('Invalid JSON', { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const { fullName, email, pricingPlan, auraCode } = data;
  if (!fullName || !email || !pricingPlan) {
    console.error('Missing required fields:', { fullName: !!fullName, email: !!email, pricingPlan: !!pricingPlan });
    return new Response('Missing required fields', { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const subject = `🚀 New User Signup: ${fullName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px; text-align: center;">🎉 New User Registration</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #495057; margin-top: 0;">User Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #495057;">Full Name:</td>
              <td style="padding: 8px 0; color: #212529;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #495057;">Email:</td>
              <td style="padding: 8px 0; color: #212529;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #495057;">Pricing Plan:</td>
              <td style="padding: 8px 0; color: #212529;">${pricingPlan}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #495057;">Aura Code:</td>
              <td style="padding: 8px 0; color: #212529;">${auraCode || 'None provided'}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6c757d; font-size: 14px;">This email was automatically generated from The House of Traders signup system.</p>
        </div>
      </div>
    </div>
  `;

  const text = `New User Signup - The House of Traders

User Details:
- Name: ${fullName}
- Email: ${email}
- Pricing Plan: ${pricingPlan}
- Aura Code: ${auraCode || 'None provided'}

Please review this new signup and activate the user's account if appropriate.`;

  console.log('Attempting to send email to:', ADMIN_EMAIL);

  try {
    // Send email via Resend using your verified domain
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The House of Traders <noreply@trademind.co.in>',
        to: [ADMIN_EMAIL],
        subject,
        html,
        text,
      }),
    });

    const responseData = await response.text();
    console.log('Resend API response status:', response.status);
    console.log('Resend API response:', responseData);

    if (!response.ok) {
      console.error('Failed to send email. Status:', response.status, 'Response:', responseData);
      return new Response(`Failed to send email: ${responseData}`, { 
        status: 500,
        headers: corsHeaders 
      });
    }

    console.log('Email sent successfully!');
    return new Response('Notification sent successfully', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(`Error sending email: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
