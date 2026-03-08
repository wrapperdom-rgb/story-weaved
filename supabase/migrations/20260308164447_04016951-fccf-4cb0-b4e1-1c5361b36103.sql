
-- Drop all existing restrictive policies on gallery_items
DROP POLICY IF EXISTS "Anyone can read gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Authenticated users can delete gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Authenticated users can insert gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Authenticated users can update gallery items" ON public.gallery_items;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can read gallery items"
  ON public.gallery_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert gallery items"
  ON public.gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery items"
  ON public.gallery_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery items"
  ON public.gallery_items FOR DELETE
  TO authenticated
  USING (true);
