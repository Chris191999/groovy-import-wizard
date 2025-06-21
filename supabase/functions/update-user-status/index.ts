
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('update-user-status function initialized')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, status, role } = await req.json()

    if (!userId || (!status && !role)) {
      throw new Error('Missing required fields: userId and status or role is required.')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user: callerUser } } = await supabaseClient.auth.getUser()
    if (!callerUser) {
      throw new Error('Could not identify calling user.')
    }

    const { data: callerProfile, error: callerError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', callerUser.id)
      .single()

    if (callerError) throw callerError

    if (callerProfile?.role !== 'admin') {
      console.warn('Unauthorized attempt to update user by:', callerUser.id)
      return new Response(JSON.stringify({ error: 'Only admins can update users.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // First, confirm email if status is being set to active
    if (status === 'active') {
      const { error: adminUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      )

      if (adminUpdateError) {
        console.error(`Failed to confirm email for user ${userId}.`, adminUpdateError.message)
        return new Response(JSON.stringify({ error: `Failed to confirm email: ${adminUpdateError.message}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
      }
      console.log(`Email for user ${userId} confirmed successfully.`)
    }

    // Then, update the profile status or role
    if (status || role) {
      const profileUpdate: { status?: string, role?: string } = {}
      if (status) profileUpdate.status = status;
      if (role) profileUpdate.role = role;
        
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdate)
        .eq('id', userId)
      
      if (updateError) {
        console.error(`Failed to update profile for ${userId}.`, updateError.message)
        throw updateError
      }
      console.log(`Profile for user ${userId} updated successfully with status: ${status}, role: ${role}.`)
    }

    console.log(`User ${userId} updated successfully.`)
    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('General error in update-user-status function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

