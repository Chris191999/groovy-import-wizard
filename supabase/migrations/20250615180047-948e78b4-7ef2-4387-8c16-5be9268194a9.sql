
-- Create a storage bucket for trade images, and make it public for easy access
insert into storage.buckets (id, name, public)
  values ('trade_images', 'trade_images', true);

-- Create RLS policies for the new 'trade_images' bucket

-- 1. Allow authenticated users to upload files to their own user-specific folder
CREATE POLICY "Allow authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trade_images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 2. Allow users to update their own files
CREATE POLICY "Allow user to update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'trade_images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Allow users to delete their own files
CREATE POLICY "Allow user to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trade_images' AND (storage.foldername(name))[1] = auth.uid()::text);
