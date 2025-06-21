
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log('create-user function initialized');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fullName, email, password, role, status } = await req.json();

    if (!email || !password || !fullName || !role || !status) {
      throw new Error('Missing required fields: email, password, fullName, role, and status are required.');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user: callerUser } } = await supabaseClient.auth.getUser();
    if (!callerUser) {
      throw new Error('Could not identify calling user.');
    }

    const { data: callerProfile, error: callerError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', callerUser.id)
      .single();

    if (callerError) throw callerError;

    if (callerProfile?.role !== 'admin') {
      console.warn('Unauthorized attempt to create user by:', callerUser.id);
      return new Response(JSON.stringify({ error: 'Only admins can create users.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Admin ${callerUser.email} attempting to create user ${email}`);
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      email_confirm: false,
    });

    if (createError) {
      console.error('Error creating auth user:', createError.message);
      throw createError;
    }
    if (!newUser || !newUser.user) {
      throw new Error('Failed to create user.');
    }

    console.log(`Auth user ${email} created with id ${newUser.user.id}. Now updating profile.`);
    
    // The handle_new_user trigger creates the profile. Now update it with the specified role and status.
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role, status })
      .eq('id', newUser.user.id);
    
    if (updateError) {
      console.error(`Failed to update profile for ${newUser.user.id}. Rolling back auth user creation.`, updateError.message);
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      throw updateError;
    }

    console.log(`User ${email} created successfully.`);
    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('General error in create-user function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
