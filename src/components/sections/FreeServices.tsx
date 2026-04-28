import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Receipt,
  CalendarClock,
  Users,
  Briefcase,
  Calculator,
  Gift,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type ToolKey =
  | "nf"
  | "rpa"
  | "agendamento"
  | "custo-funcionario"
  | "pro-labore"
  | "inss";

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const tools: {
  key: ToolKey;
  title: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  type: "info" | "calc";
}[] = [
  {
    key: "nf",
    title: "Emissão de Notas Fiscais",
    short: "Comércio e Serviços",
    icon: FileText,
    type: "info",
  },
  {
    key: "rpa",
    title: "Calculadora de RPA",
    short: "INSS, IRRF e ISS sobre o recibo",
    icon: Receipt,
    type: "calc",
  },
  {
    key: "agendamento",
    title: "Agendamento de Atendimento",
    short: "Via Google Agenda",
    icon: CalendarClock,
    type: "info",
  },
  {
    key: "custo-funcionario",
    title: "Cálculo de Custo com Funcionário",
    short: "Salário + encargos totais",
    icon: Users,
    type: "calc",
  },
  {
    key: "pro-labore",
    title: "Cálculo de Pró-labore",
    short: "Líquido após INSS e IRRF",
    icon: Briefcase,
    type: "calc",
  },
  {
    key: "inss",
    title: "Cálculo de INSS",
    short: "Tabela progressiva 2026",
    icon: Calculator,
    type: "calc",
  },
];

// ---------- Conceitos ----------
const concepts: Record<ToolKey, { title: string; body: React.ReactNode }> = {
  nf: {
    title: "O que é Nota Fiscal?",
    body: (
      <>
        <p>
          A <strong>Nota Fiscal (NF)</strong> é o documento que comprova a
          venda de mercadorias ou a prestação de serviços, registrando a
          operação para fins fiscais e contábeis.
        </p>
        <p>
          Existem dois tipos principais: a <strong>NF-e</strong> (Nota Fiscal
          Eletrônica de Comércio) e a <strong>NFS-e</strong> (Nota Fiscal de
          Serviços Eletrônica), emitida pela prefeitura do município.
        </p>
        <p>
          A emissão correta garante a apuração adequada de tributos (ICMS, ISS,
          PIS, COFINS) e evita autuações fiscais. Auxiliamos sua empresa em
          todo o processo de emissão e configuração.
        </p>
      </>
    ),
  },
  rpa: {
    title: "RPA — Recibo de Pagamento Autônomo",
    body: (
      <>
        <p>
          O cálculo e o pagamento dos impostos no <strong>RPA</strong> são
          responsabilidade da empresa contratante. Contudo, é importante que o
          autônomo conheça os tributos e descontos envolvidos para conferir os
          valores recebidos, entender os limites de desconto, declarar os
          recebimentos no IRPF e planejar suas finanças.
        </p>
        <p>
          O cálculo do RPA envolve <strong>três tributos</strong> que incidem
          na prestação de serviços: <strong>INSS</strong> (11% sobre o valor
          recebido, com teto), o <strong>IRRF</strong> (calculado após a
          dedução do INSS, conforme a tabela vigente) e o <strong>ISS</strong>{" "}
          (alíquota municipal, geralmente entre 2% e 5%).
        </p>

        <h4 className="mt-4 font-display font-bold text-primary">INSS</h4>
        <p>
          O desconto do INSS é considerado para fins de aposentadoria e direito
          a benefícios, como licença-maternidade e auxílio-doença.
        </p>
        <p>
          Para calcular o INSS no RPA, soma-se todos os valores recebidos no
          mês e aplica-se a alíquota de <strong>11%</strong>. Existe um{" "}
          <strong>teto mensal</strong> de contribuição: se a soma dos
          pagamentos ultrapassar esse limite, o desconto não deve exceder o
          teto. O autônomo pode fornecer a cada contratante uma declaração
          informando os valores de INSS já retidos no período. A empresa
          contratante também recolhe <strong>20% de contribuição patronal</strong>{" "}
          sobre o mesmo valor.
        </p>

        <h4 className="mt-4 font-display font-bold text-primary">IRRF</h4>
        <p>
          Para o <strong>Imposto de Renda Retido na Fonte</strong>, soma-se o
          total recebido no mês, desconta-se o INSS e aplica-se a tabela
          progressiva (até 27,5%). Desde a <strong>Lei nº 14.663/2023</strong>,
          existem novas regras de desconto:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <strong>Até R$ 5.000,00:</strong> IRRF isento.
          </li>
          <li>
            <strong>Entre R$ 5.000,01 e R$ 7.350,00:</strong> desconto especial
            calculado por: <em>R$ 978,62 − (0,133145 × rendimento tributável)</em>.
          </li>
          <li>
            <strong>Acima de R$ 7.350,00:</strong> tabela progressiva padrão,
            sem o desconto adicional.
          </li>
        </ul>

        <h4 className="mt-4 font-display font-bold text-primary">ISS</h4>
        <p>
          O <strong>ISS</strong> (Imposto sobre Serviços) é municipal, com
          alíquotas de <strong>2% a 5%</strong>. Em muitos municípios, a
          empresa contratante é obrigada a reter e recolher o ISS na fonte. O
          cálculo é simples: <em>valor do serviço × alíquota municipal</em>.
        </p>
      </>
    ),
  },
  agendamento: {
    title: "Agendamento de Horário de Atendimento",
    body: (
      <>
        <p>
          Para oferecer um atendimento mais ágil e organizado, disponibilizamos
          o <strong>agendamento de horários através do Google Agenda</strong>.
        </p>
        <p>
          Você escolhe o melhor dia e horário, recebe a confirmação por e-mail
          e um lembrete automático antes da reunião — presencial, por telefone
          ou videoconferência.
        </p>
        <p>
          Solicite seu horário pelo WhatsApp e enviaremos o link do Google
          Agenda com os horários disponíveis.
        </p>
      </>
    ),
  },
  "custo-funcionario": {
    title: "Custo Total com Funcionário",
    body: (
      <>
        <p>
          O <strong>custo de um funcionário</strong> vai muito além do salário
          bruto. A empresa deve considerar os <strong>encargos sociais</strong>{" "}
          (INSS patronal, FGTS, RAT/SAT, terceiros), os <strong>provisões
          trabalhistas</strong> (13º, férias + 1/3) e benefícios.
        </p>
        <p>
          Estimativa simplificada (Simples Nacional / regime geral aproximado):
          aproximadamente <strong>70% a 80%</strong> sobre o salário bruto em
          encargos e provisões.
        </p>
        <p className="text-sm text-muted-foreground">
          ⚠️ Cálculo estimado para fins de planejamento. O valor exato depende
          do regime tributário, CNAE e benefícios. Consulte-nos para um
          orçamento preciso.
        </p>
      </>
    ),
  },
  "pro-labore": {
    title: "O que é Pró-labore?",
    body: (
      <>
        <p>
          <strong>Pró-labore</strong> é a remuneração mensal recebida pelos
          sócios administradores que trabalham na empresa. É obrigatório o
          recolhimento de <strong>INSS (11%)</strong> e, se ultrapassar a
          faixa de isenção, <strong>IRRF</strong> conforme a tabela
          progressiva.
        </p>
        <p>
          Diferente do salário, o pró-labore <strong>não tem FGTS, 13º nem
          férias</strong>, mas contribui para a aposentadoria do sócio junto ao
          INSS.
        </p>
      </>
    ),
  },
  inss: {
    title: "Como funciona o INSS?",
    body: (
      <>
        <p>
          O <strong>INSS</strong> (Instituto Nacional do Seguro Social) é a
          contribuição previdenciária que garante benefícios como
          aposentadoria, auxílio-doença, salário-maternidade e pensão por
          morte.
        </p>
        <p>
          Para empregados CLT, a alíquota é <strong>progressiva</strong>:
          aplica-se uma alíquota diferente a cada faixa do salário (7,5% / 9% /
          12% / 14%), respeitando o teto previdenciário.
        </p>
        <p className="text-sm text-muted-foreground">
          ⚠️ Valores baseados em tabela vigente. Sempre confirme com seu
          contador antes de fechar a folha.
        </p>
      </>
    ),
  },
};

// ---------- Tabelas (valores aproximados / referência) ----------
// INSS empregado — faixas progressivas (referência atualizada)
const INSS_BRACKETS = [
  { upTo: 1518.0, rate: 0.075 },
  { upTo: 2793.88, rate: 0.09 },
  { upTo: 4190.83, rate: 0.12 },
  { upTo: 8157.41, rate: 0.14 },
];

const calcInssEmpregado = (salario: number) => {
  if (salario <= 0) return 0;
  let remaining = Math.min(salario, INSS_BRACKETS[INSS_BRACKETS.length - 1].upTo);
  let prev = 0;
  let total = 0;
  for (const b of INSS_BRACKETS) {
    if (remaining <= 0) break;
    const faixa = Math.min(remaining, b.upTo - prev);
    if (faixa > 0) {
      total += faixa * b.rate;
      remaining -= faixa;
    }
    prev = b.upTo;
  }
  return total;
};

// IRRF tabela progressiva mensal (referência)
const calcIRRF = (base: number) => {
  if (base <= 2428.8) return 0;
  if (base <= 2826.65) return base * 0.075 - 182.16;
  if (base <= 3751.05) return base * 0.15 - 394.16;
  if (base <= 4664.68) return base * 0.225 - 675.49;
  return Math.max(0, base * 0.275 - 908.73);
};

// ---------- Calculadoras ----------
const CustoFuncionarioCalc = () => {
  const [salario, setSalario] = useState<string>("");
  const valor = parseFloat(salario.replace(",", ".")) || 0;

  const result = useMemo(() => {
    const inssPatronal = valor * 0.2;
    const fgts = valor * 0.08;
    const ratTerceiros = valor * 0.058; // RAT 1-3% + Terceiros ~5,8%
    const ferias = (valor + valor / 3) / 12;
    const decimoTerceiro = valor / 12;
    const fgtsProvisoes = (ferias + decimoTerceiro) * 0.08;
    const total =
      valor +
      inssPatronal +
      fgts +
      ratTerceiros +
      ferias +
      decimoTerceiro +
      fgtsProvisoes;
    const pct = valor > 0 ? ((total / valor - 1) * 100).toFixed(1) : "0";
    return { inssPatronal, fgts, ratTerceiros, ferias, decimoTerceiro, fgtsProvisoes, total, pct };
  }, [valor]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="salario-cf">Salário bruto mensal (R$)</Label>
        <Input
          id="salario-cf"
          type="number"
          inputMode="decimal"
          placeholder="Ex: 2000"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
          maxLength={10}
        />
      </div>

      {valor > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
          <Row label="Salário bruto" value={fmtBRL(valor)} />
          <Row label="INSS patronal (20%)" value={fmtBRL(result.inssPatronal)} />
          <Row label="FGTS (8%)" value={fmtBRL(result.fgts)} />
          <Row label="RAT + Terceiros (~5,8%)" value={fmtBRL(result.ratTerceiros)} />
          <Row label="Provisão de férias + 1/3" value={fmtBRL(result.ferias)} />
          <Row label="Provisão de 13º salário" value={fmtBRL(result.decimoTerceiro)} />
          <Row label="FGTS sobre provisões" value={fmtBRL(result.fgtsProvisoes)} />
          <div className="my-2 h-px bg-border" />
          <Row
            label="Custo total mensal"
            value={fmtBRL(result.total)}
            highlight
          />
          <p className="pt-1 text-xs text-muted-foreground">
            Equivale a aproximadamente <strong>{result.pct}%</strong> acima do salário bruto.
          </p>
        </div>
      )}
    </div>
  );
};

const ProLaboreCalc = () => {
  const [valor, setValor] = useState<string>("");
  const v = parseFloat(valor.replace(",", ".")) || 0;

  const result = useMemo(() => {
    const inss = Math.min(v * 0.11, 8157.41 * 0.11); // 11% limitado ao teto
    const baseIR = v - inss;
    const irrf = calcIRRF(baseIR);
    const liquido = v - inss - irrf;
    return { inss, irrf, liquido };
  }, [v]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prolabore">Valor do pró-labore (R$)</Label>
        <Input
          id="prolabore"
          type="number"
          inputMode="decimal"
          placeholder="Ex: 3000"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          maxLength={10}
        />
      </div>

      {v > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
          <Row label="Pró-labore bruto" value={fmtBRL(v)} />
          <Row label="INSS sócio (11%)" value={`- ${fmtBRL(result.inss)}`} />
          <Row label="IRRF" value={`- ${fmtBRL(result.irrf)}`} />
          <div className="my-2 h-px bg-border" />
          <Row label="Líquido a receber" value={fmtBRL(result.liquido)} highlight />
        </div>
      )}
    </div>
  );
};

const InssCalc = () => {
  const [valor, setValor] = useState<string>("");
  const v = parseFloat(valor.replace(",", ".")) || 0;
  const inss = useMemo(() => calcInssEmpregado(v), [v]);
  const aliq = v > 0 ? ((inss / v) * 100).toFixed(2) : "0";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sal-inss">Salário de contribuição (R$)</Label>
        <Input
          id="sal-inss"
          type="number"
          inputMode="decimal"
          placeholder="Ex: 2500"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          maxLength={10}
        />
      </div>

      {v > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
          <Row label="Salário base" value={fmtBRL(v)} />
          <Row label="INSS devido" value={fmtBRL(inss)} highlight />
          <p className="pt-1 text-xs text-muted-foreground">
            Alíquota efetiva: <strong>{aliq}%</strong> (cálculo progressivo).
          </p>
        </div>
      )}

      <div className="rounded-md bg-secondary/50 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Faixas vigentes:</strong> 7,5% até R$ 1.518,00 ·
        9% até R$ 2.793,88 · 12% até R$ 4.190,83 · 14% até R$ 8.157,41 (teto).
      </div>
    </div>
  );
};

const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={highlight ? "font-semibold text-foreground" : "text-muted-foreground"}>
      {label}
    </span>
    <span className={highlight ? "text-base font-bold text-accent" : "font-medium text-foreground"}>
      {value}
    </span>
  </div>
);

// ---------- Componente principal ----------
export const FreeServices = () => {
  const [openTool, setOpenTool] = useState<ToolKey | null>(null);

  const renderCalc = () => {
    switch (openTool) {
      case "custo-funcionario":
        return <CustoFuncionarioCalc />;
      case "pro-labore":
        return <ProLaboreCalc />;
      case "inss":
        return <InssCalc />;
      default:
        return null;
    }
  };

  const current = openTool ? concepts[openTool] : null;
  const currentTool = openTool ? tools.find((t) => t.key === openTool) : null;

  const waMessage = currentTool
    ? `Olá! Tenho interesse no serviço gratuito: ${currentTool.title}. Podem me ajudar?`
    : undefined;

  return (
    <section id="servicos-gratuitos" className="bg-gradient-soft py-20 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            <Gift className="h-3.5 w-3.5" /> Cortesia para nossos clientes
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-primary md:text-4xl">
            Serviços <span className="text-accent">Gratuitos</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ferramentas e suportes que disponibilizamos para facilitar o dia a dia
            da sua empresa. Use as calculadoras, conheça os conceitos e fale
            conosco para acionar o serviço.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setOpenTool(t.key)}
                className="group text-left"
              >
                <Card className="h-full border-border/60 bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-elegant">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent text-accent-foreground shadow-glow">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {t.type === "calc" ? "Calculadora" : "Serviço"}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-primary">
                    {t.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    {t.type === "calc" ? "Calcular agora" : "Saber mais"}
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!openTool} onOpenChange={(o) => !o && setOpenTool(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {current && currentTool && (
            <>
              <DialogHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent text-accent-foreground">
                  <currentTool.icon className="h-6 w-6" />
                </div>
                <DialogTitle className="font-display text-2xl text-primary">
                  {current.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Informações sobre {currentTool.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-sm leading-relaxed text-foreground/85">
                {current.body}
              </div>

              {currentTool.type === "calc" && (
                <div className="mt-5 rounded-xl border border-accent/30 bg-accent/5 p-5">
                  <h4 className="mb-3 font-display font-bold text-primary">
                    Faça o cálculo
                  </h4>
                  {renderCalc()}
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row">
                <Button
                  asChild
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <a
                    href={buildWhatsAppUrl(waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Solicitar pelo WhatsApp
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setOpenTool(null)}>
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
