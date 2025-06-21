
-- Drop the existing function first to allow changing its return type
DROP FUNCTION IF EXISTS public.get_profiles_with_email();

-- This function is re-created to include a "storage_used" column, which calculates
-- the total size of files each user has in the 'trade_images' bucket.
CREATE OR REPLACE FUNCTION public.get_profiles_with_email()
 RETURNS TABLE(id uuid, updated_at timestamp with time zone, full_name text, avatar_url text, role app_role, status app_status, email text, storage_used numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (get_my_role() = 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this information.';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.updated_at,
    p.full_name,
    p.avatar_url,
    p.role,
    p.status,
    u.email,
    (
        SELECT COALESCE(SUM((so.metadata->>'size')::numeric), 0)
        FROM storage.objects so
        WHERE so.bucket_id = 'trade_images' AND so.owner = p.id
    ) AS storage_used
  FROM
    public.profiles p
  JOIN
    auth.users u ON p.id = u.id;
END;
$function$
