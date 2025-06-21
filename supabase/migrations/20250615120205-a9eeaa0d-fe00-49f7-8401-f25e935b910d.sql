
-- Create an enum type for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create an enum type for user status
CREATE TYPE public.app_status AS ENUM ('pending_approval', 'active', 'inactive');

-- Create a table for public profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'user',
  status app_status NOT NULL DEFAULT 'pending_approval'
);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER function to check the current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

-- RLS Policies for profiles

-- SELECT: Profiles are viewable by the user they belong to or by admins.
CREATE POLICY "Profiles are viewable by users and admins."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.get_my_role() = 'admin');

-- UPDATE: Only admins can update profiles.
CREATE POLICY "Admins can update any profile."
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- DELETE: Only admins can delete profiles.
CREATE POLICY "Admins can delete any profile."
  ON public.profiles FOR DELETE
  USING (public.get_my_role() = 'admin');

