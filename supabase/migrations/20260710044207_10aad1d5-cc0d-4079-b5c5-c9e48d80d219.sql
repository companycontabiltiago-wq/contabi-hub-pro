
-- 1) Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated (linter 0028/0029)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 2) Replace permissive "WITH CHECK (true)" INSERT policy on plan_leads with input validation
DROP POLICY IF EXISTS "Anyone can submit a plan lead" ON public.plan_leads;

CREATE POLICY "Public can submit valid plan lead"
ON public.plan_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(contact_name)) BETWEEN 2 AND 120
  AND email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  AND length(email) <= 200
  AND length(regexp_replace(phone, '\D', '', 'g')) >= 8
  AND length(phone) <= 40
  AND length(plan_name) BETWEEN 2 AND 120
  AND (cnpj IS NULL OR length(cnpj) <= 20)
  AND (notes IS NULL OR length(notes) <= 2000)
  AND (company_name IS NULL OR length(company_name) <= 200)
  AND (preferred_contact IS NULL OR length(preferred_contact) <= 40)
);

-- 3) Restrict listing on the public `news-images` bucket.
-- Public buckets serve files via CDN without RLS, so removing the broad SELECT
-- policy stops the storage list API from enumerating objects but keeps public
-- URLs working normally.
DROP POLICY IF EXISTS "News images publicly accessible" ON storage.objects;
