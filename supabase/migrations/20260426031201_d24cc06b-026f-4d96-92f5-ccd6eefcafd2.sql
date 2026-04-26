-- Enums para campos controlados
CREATE TYPE public.business_segment AS ENUM ('comercio', 'servico', 'industria', 'outros');
CREATE TYPE public.tax_regime AS ENUM ('mei', 'simples_nacional', 'lucro_presumido', 'lucro_real', 'nao_sei');

CREATE TABLE public.plan_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  has_cnpj BOOLEAN NOT NULL DEFAULT false,
  cnpj TEXT,
  segment public.business_segment NOT NULL,
  tax_regime public.tax_regime NOT NULL,
  monthly_revenue NUMERIC(14,2),
  employees_clt INTEGER NOT NULL DEFAULT 0,
  current_accountant BOOLEAN,
  preferred_contact TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.plan_leads ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode enviar lead
CREATE POLICY "Anyone can submit a plan lead"
ON public.plan_leads
FOR INSERT
WITH CHECK (true);

-- Apenas admins gerenciam os leads
CREATE POLICY "Admins manage plan leads"
ON public.plan_leads
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_plan_leads_created_at ON public.plan_leads (created_at DESC);