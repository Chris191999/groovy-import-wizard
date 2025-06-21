
CREATE OR REPLACE FUNCTION public.get_user_status_by_email(p_email text)
RETURNS public.app_status
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_status public.app_status;
BEGIN
    SELECT
        p.status
    INTO
        v_status
    FROM
        public.profiles p
    JOIN
        auth.users u ON p.id = u.id
    WHERE
        u.email = p_email;

    RETURN v_status;
END;
$$;
