import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Sparkles } from "lucide-react";

type Segment = "comercio" | "servico" | "industria" | "outros";
type TaxRegime = "mei" | "simples_nacional" | "lucro_presumido" | "lucro_real" | "nao_sei";

const segmentLabels: Record<Segment, string> = {
  comercio: "Comércio",
  servico: "Serviço",
  industria: "Indústria",
  outros: "Outros",
};

const regimeLabels: Record<TaxRegime, string> = {
  mei: "MEI",
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  nao_sei: "Não sei informar",
};

const schema = z.object({
  contact_name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  phone: z.string().trim().min(10, "Telefone inválido").max(20),
  company_name: z.string().trim().max(150).optional().or(z.literal("")),
  has_cnpj: z.boolean(),
  cnpj: z.string().trim().max(20).optional().or(z.literal("")),
  segment: z.enum(["comercio", "servico", "industria", "outros"]),
  tax_regime: z.enum(["mei", "simples_nacional", "lucro_presumido", "lucro_real", "nao_sei"]),
  monthly_revenue: z.string().trim().max(20).optional().or(z.literal("")),
  employees_clt: z.string().trim().max(6),
  current_accountant: z.boolean(),
  preferred_contact: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormState = {
  contact_name: string;
  email: string;
  phone: string;
  company_name: string;
  has_cnpj: boolean;
  cnpj: string;
  segment: Segment | "";
  tax_regime: TaxRegime | "";
  monthly_revenue: string;
  employees_clt: string;
  current_accountant: boolean;
  preferred_contact: string;
  notes: string;
};

const initialState: FormState = {
  contact_name: "",
  email: "",
  phone: "",
  company_name: "",
  has_cnpj: true,
  cnpj: "",
  segment: "",
  tax_regime: "",
  monthly_revenue: "",
  employees_clt: "0",
  current_accountant: false,
  preferred_contact: "WhatsApp",
  notes: "",
};

const parseRevenue = (raw: string): number | null => {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  planPrice?: string;
}

export const PlanContractDialog = ({ open, onOpenChange, planName, planPrice }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({
        title: "Verifique os dados",
        description: first?.message ?? "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const revenue = parseRevenue(form.monthly_revenue);
    const employees = parseInt(form.employees_clt, 10) || 0;

    const { error } = await supabase.from("plan_leads").insert({
      plan_name: planName,
      contact_name: form.contact_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company_name: form.company_name.trim() || null,
      has_cnpj: form.has_cnpj,
      cnpj: form.has_cnpj ? form.cnpj.trim() || null : null,
      segment: form.segment as Segment,
      tax_regime: form.tax_regime as TaxRegime,
      monthly_revenue: revenue,
      employees_clt: employees,
      current_accountant: form.current_accountant,
      preferred_contact: form.preferred_contact || null,
      notes: form.notes.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Não foi possível enviar",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
      return;
    }

    const message = [
      `Olá! Tenho interesse no plano *${planName}*${planPrice ? ` (R$ ${planPrice}/mês)` : ""}.`,
      "",
      `*Nome:* ${form.contact_name}`,
      `*E-mail:* ${form.email}`,
      `*Telefone:* ${form.phone}`,
      form.company_name ? `*Empresa:* ${form.company_name}` : null,
      `*Possui CNPJ:* ${form.has_cnpj ? "Sim" : "Não"}`,
      form.has_cnpj && form.cnpj ? `*CNPJ:* ${form.cnpj}` : null,
      `*Segmento:* ${segmentLabels[form.segment as Segment]}`,
      `*Regime tributário:* ${regimeLabels[form.tax_regime as TaxRegime]}`,
      revenue !== null ? `*Faturamento mensal:* R$ ${revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : null,
      `*Funcionários CLT:* ${employees}`,
      `*Já tem contabilidade:* ${form.current_accountant ? "Sim" : "Não"}`,
      form.preferred_contact ? `*Melhor contato:* ${form.preferred_contact}` : null,
      form.notes ? `*Observações:* ${form.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    openWhatsApp(message);

    toast({
      title: "Pedido enviado!",
      description: "Recebemos seus dados e você será redirecionado ao WhatsApp.",
    });

    setForm(initialState);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3 w-3" /> Plano {planName}
          </span>
          <DialogTitle className="font-display text-2xl text-primary">
            Solicitar contratação
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para que possamos preparar uma proposta personalizada e entrar em contato.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ScrollArea className="max-h-[55vh] pr-4">
            <div className="space-y-4">
              {/* Contato */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact_name">Seu nome *</Label>
                  <Input
                    id="contact_name"
                    value={form.contact_name}
                    onChange={e => update("contact_name", e.target.value)}
                    placeholder="Nome completo"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">WhatsApp / Telefone *</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={e => update("phone", e.target.value)}
                    placeholder="(85) 9 9999-9999"
                    maxLength={20}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="seu@email.com"
                  maxLength={255}
                  required
                />
              </div>

              {/* Empresa */}
              <div className="space-y-1.5">
                <Label htmlFor="company_name">Nome da empresa</Label>
                <Input
                  id="company_name"
                  value={form.company_name}
                  onChange={e => update("company_name", e.target.value)}
                  placeholder="Razão social ou nome fantasia"
                  maxLength={150}
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label htmlFor="has_cnpj" className="text-sm">A empresa possui CNPJ?</Label>
                    <p className="text-xs text-muted-foreground">Se ainda não possui, podemos abrir para você.</p>
                  </div>
                  <Switch
                    id="has_cnpj"
                    checked={form.has_cnpj}
                    onCheckedChange={v => update("has_cnpj", v)}
                  />
                </div>

                {form.has_cnpj && (
                  <div className="space-y-1.5">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={form.cnpj}
                      onChange={e => update("cnpj", e.target.value)}
                      placeholder="00.000.000/0000-00"
                      maxLength={20}
                    />
                  </div>
                )}
              </div>

              {/* Segmento */}
              <div className="space-y-2">
                <Label>Segmento da empresa *</Label>
                <RadioGroup
                  value={form.segment}
                  onValueChange={v => update("segment", v as Segment)}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {(Object.keys(segmentLabels) as Segment[]).map(s => (
                    <Label
                      key={s}
                      htmlFor={`seg-${s}`}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent/5 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-accent"
                    >
                      <RadioGroupItem id={`seg-${s}`} value={s} />
                      {segmentLabels[s]}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Regime */}
              <div className="space-y-1.5">
                <Label htmlFor="tax_regime">Regime tributário atual *</Label>
                <Select
                  value={form.tax_regime}
                  onValueChange={v => update("tax_regime", v as TaxRegime)}
                >
                  <SelectTrigger id="tax_regime">
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(regimeLabels) as TaxRegime[]).map(r => (
                      <SelectItem key={r} value={r}>{regimeLabels[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Faturamento e funcionários */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="monthly_revenue">Faturamento mensal (R$)</Label>
                  <Input
                    id="monthly_revenue"
                    inputMode="decimal"
                    value={form.monthly_revenue}
                    onChange={e => update("monthly_revenue", e.target.value)}
                    placeholder="Ex.: 25.000,00"
                    maxLength={20}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="employees_clt">Funcionários com CTPS assinada *</Label>
                  <Input
                    id="employees_clt"
                    type="number"
                    min={0}
                    max={9999}
                    value={form.employees_clt}
                    onChange={e => update("employees_clt", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Já possui contabilidade */}
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 p-4">
                <div>
                  <Label htmlFor="current_accountant" className="text-sm">Já possui contabilidade?</Label>
                  <p className="text-xs text-muted-foreground">Cuidamos de toda a transição sem custo adicional.</p>
                </div>
                <Switch
                  id="current_accountant"
                  checked={form.current_accountant}
                  onCheckedChange={v => update("current_accountant", v)}
                />
              </div>

              {/* Preferência de contato */}
              <div className="space-y-1.5">
                <Label htmlFor="preferred_contact">Como prefere ser contatado?</Label>
                <Select
                  value={form.preferred_contact}
                  onValueChange={v => update("preferred_contact", v)}
                >
                  <SelectTrigger id="preferred_contact">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Ligação">Ligação telefônica</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="Reunião online">Reunião online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Observações */}
              <div className="space-y-1.5">
                <Label htmlFor="notes">Observações adicionais</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={e => update("notes", e.target.value)}
                  placeholder="Conte-nos sobre suas necessidades, dúvidas ou desafios da empresa."
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Enviar e abrir WhatsApp</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
