
CREATE OR REPLACE FUNCTION public.get_profiles_with_email()
RETURNS TABLE(
  id UUID,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT,
  role public.app_role,
  status public.app_status,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec RECORD;
BEGIN
  -- This check ensures that only users with the 'admin' role can execute this function.
  IF NOT (get_my_role() = 'admin') THEN
    RAISE EXCEPTION 'Only admins can access this information.';
  END IF;

  FOR rec IN
    SELECT
      p.id,
      p.updated_at,
      p.full_name,
      p.avatar_url,
      p.role,
      p.status,
      u.email
    FROM
      public.profiles p
    JOIN
      auth.users u ON p.id = u.id
  LOOP
    "id" := rec.id;
    "updated_at" := rec.updated_at;
    "full_name" := rec.full_name;
    "avatar_url" := rec.avatar_url;
    "role" := rec.role;
    "status" := rec.status;
    "email" := rec.email;
    RETURN NEXT;
  END LOOP;
  
  RETURN;
END;
$$;
