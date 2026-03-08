
-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery-images', 'gallery-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Allow anyone to read from gallery-images bucket
CREATE POLICY "Anyone can read gallery images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery-images');

-- Allow authenticated users to upload to gallery-images bucket
CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-images');

-- Allow authenticated users to delete gallery images
CREATE POLICY "Authenticated users can delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-images');

-- Delete the broken base64 entry
DELETE FROM public.gallery_items;

-- Re-insert original gallery items with proper URLs
INSERT INTO public.gallery_items (id, src, prompt, is_free, sort_order) VALUES
  ('00000000-0000-0000-0000-000000000001', '/gallery-1.jpg', 'A stylish young man in a designer white sweatshirt standing in front of an orange BMW sports car at night, urban street photography, high fashion editorial style, moody lighting', true, 1),
  ('00000000-0000-0000-0000-000000000002', '/gallery-2.jpg', 'A stylish man in a black Lanvin hoodie leaning against a red luxury sports car in a garage, fashion editorial photography, cinematic lighting', true, 2),
  ('00000000-0000-0000-0000-000000000003', '/gallery-3.jpg', 'A fashionable man in a black puffer jacket and beanie sitting in a luxury car interior at night, wearing sunglasses, street style photography, moody dark tones', false, 3),
  ('00000000-0000-0000-0000-000000000004', '/gallery-4.jpg', 'A stylish man in a navy beanie and black puffer jacket walking on a European city street at night, fashion editorial street photography, cinematic urban lighting', false, 4),
  ('00000000-0000-0000-0000-000000000005', '/gallery-5.jpg', 'A man in a blue polo shirt with sunglasses standing by Italian lakeside architecture, Lake Como vibes, warm golden hour light, fashion editorial photography', false, 5),
  ('00000000-0000-0000-0000-000000000006', '/gallery-6.jpg', 'A stylish man in a glossy black puffer jacket looking over his shoulder on a city street at night, moody fashion photography, dramatic lighting', false, 6),
  ('00000000-0000-0000-0000-000000000007', '/gallery-7.jpg', 'A fashionable man in a grey overcoat and turtleneck, European architecture background, editorial street style photography, soft natural lighting', false, 7),
  ('00000000-0000-0000-0000-000000000008', '/gallery-8.jpg', 'A man in a tan trench coat and white sneakers walking through a modern art gallery, high fashion editorial, clean minimalist setting', false, 8),
  ('00000000-0000-0000-0000-000000000009', '/gallery-9.jpg', 'A stylish man in a cream knit sweater and gold chain, leaning on a stone wall, Mediterranean setting, warm sunset light, fashion photography', false, 9);
