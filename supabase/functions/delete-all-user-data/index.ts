
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log(`[delete-all-user-data] Received request: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    console.log('[delete-all-user-data] Handling OPTIONS preflight request.');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[delete-all-user-data] Processing request.');
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('[delete-all-user-data] Missing Authorization header.');
      return new Response(JSON.stringify({ error: 'User not authenticated: Missing Authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: userData, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !userData.user) {
      console.error('[delete-all-user-data] Error getting user or user not found:', userError?.message);
      return new Response(JSON.stringify({ error: `User not authenticated: ${userError?.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    const user = userData.user;
    console.log(`[delete-all-user-data] Authenticated as user: ${user.id}`);
    
    const serviceClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log('[delete-all-user-data] Service client created.');

    const BUCKET_NAME = 'trade_images';
    const userFolder = `${user.id}`;
    
    console.log(`[delete-all-user-data] Listing files in bucket '${BUCKET_NAME}' for user ${user.id}`);
    const { data: files, error: listError } = await serviceClient.storage
        .from(BUCKET_NAME)
        .list(userFolder, { recursive: true });

    if (listError) {
        console.error(`[delete-all-user-data] Error listing files for user ${user.id}:`, listError.message);
    }
    
    if (files && files.length > 0) {
        const filePaths = files.map(file => `${userFolder}/${file.name}`);
        console.log(`[delete-all-user-data] Removing ${filePaths.length} files for user ${user.id}`);
        const { error: removeError } = await serviceClient.storage
            .from(BUCKET_NAME)
            .remove(filePaths);
        
        if (removeError) {
            console.error(`[delete-all-user-data] Error removing files for user ${user.id}:`, removeError.message);
        }
    }
    
    const { error: dbError } = await serviceClient
      .from('trades')
      .delete()
      .eq('user_id', user.id)

    if (dbError) {
      console.error(`[delete-all-user-data] Error deleting trades for user ${user.id}:`, dbError);
      throw dbError
    }

    console.log(`[delete-all-user-data] Successfully deleted data for user ${user.id}`);
    return new Response(JSON.stringify({ message: 'All user data deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(`[delete-all-user-data] Unhandled error:`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

