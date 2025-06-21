import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('role').eq('id', user.id).single();
    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    const { userIdToDelete } = await req.json();
    if (!userIdToDelete) {
        return new Response(JSON.stringify({ error: 'Missing userIdToDelete in request body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    if (userIdToDelete === user.id) {
        return new Response(JSON.stringify({ error: 'Admins cannot delete their own data through this function.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: tradesError } = await serviceClient.from('trades').delete().eq('user_id', userIdToDelete);

    if (tradesError) {
      console.error(`Error deleting trades for user ${userIdToDelete}:`, tradesError);
      throw new Error(`Failed to delete user's trades: ${tradesError.message}`);
    }

    const BUCKET_NAME = 'trade_images';
    
    // List all files in the user's root folder recursively.
    const { data: files, error: listError } = await serviceClient
      .storage
      .from(BUCKET_NAME)
      .list(userIdToDelete, {
        limit: 10000, // A high limit to get all files
        offset: 0,
        // The `recursive` option is not in the type definitions, so we cast to `any`.
        ...( { recursive: true } as any),
      });

    if (listError) {
      // If the user's folder doesn't exist, `list` will error. We can ignore this.
      console.warn(`Could not list files for user ${userIdToDelete} (folder may not exist): ${listError.message}`);
    }

    if (files && files.length > 0) {
      // The `list` operation returns file paths relative to the path provided.
      // We need to prepend the user's ID to get the full path for removal.
      const filePaths = files.map(file => `${userIdToDelete}/${file.name}`);
      
      const { error: removeError } = await serviceClient.storage.from(BUCKET_NAME).remove(filePaths);

      if (removeError) {
        console.error(`Error removing files for user ${userIdToDelete}:`, removeError);
        throw new Error(`Failed to delete user's files: ${removeError.message}`);
      }
    }

    return new Response(JSON.stringify({ message: 'User data deleted successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in delete-user-data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
