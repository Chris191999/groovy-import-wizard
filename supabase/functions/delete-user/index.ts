
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log('delete-user function initialized');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userIdToDelete } = await req.json();
    console.log('Attempting to delete user:', userIdToDelete);

    if (!userIdToDelete) {
      throw new Error('userIdToDelete is required');
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
      console.warn('Unauthorized attempt to delete user by:', callerUser.id);
      return new Response(JSON.stringify({ error: 'Only admins can delete users.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    if (callerUser.id === userIdToDelete) {
      console.warn('Admin attempted to self-delete:', callerUser.id);
      return new Response(JSON.stringify({ error: 'Admins cannot delete their own account.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Admin authorized. Proceeding with deletion.');
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

    if (deleteError) {
      console.error('Error deleting user:', deleteError.message);
      throw deleteError;
    }

    console.log('User deleted successfully:', userIdToDelete);
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('General error in delete-user function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
