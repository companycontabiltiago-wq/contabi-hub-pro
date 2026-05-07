-- Category enum
CREATE TYPE public.document_category AS ENUM ('fiscal', 'folha', 'contabil', 'societario', 'outros');

-- Table
CREATE TABLE public.client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  uploaded_by uuid NOT NULL,
  category public.document_category NOT NULL DEFAULT 'outros',
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  file_size bigint,
  mime_type text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_documents_owner ON public.client_documents(owner_id);

ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own documents"
  ON public.client_documents FOR SELECT
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients insert own documents"
  ON public.client_documents FOR INSERT
  WITH CHECK (
    (auth.uid() = owner_id AND auth.uid() = uploaded_by)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clients delete own documents"
  ON public.client_documents FOR DELETE
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update documents"
  ON public.client_documents FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-documents', 'client-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: path is "<owner_id>/..."
CREATE POLICY "Clients read own client-documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'client-documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Clients upload own client-documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'client-documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Clients delete own client-documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'client-documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );