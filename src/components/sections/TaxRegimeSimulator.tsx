import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, TrendingUp, Info, Printer, Check, Sparkles } from "lucide-react";
import { gerarRelatorioPDF } from "@/lib/pdfReport";
import { plans } from "./Plans";
import { PlanContractDialog } from "@/components/PlanContractDialog";

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });

// ---------- Alíquotas internas de ICMS por UF (operações internas, padrão) ----------
// Referência: legislações estaduais vigentes em 2025/2026 (alíquota modal interna).
// Valores podem variar conforme produto, benefício fiscal e substituição tributária.
const ICMS_UF: Record<string, number> = {
  AC: 19, AL: 20, AP: 18, AM: 20, BA: 20.5, CE: 20, DF: 20, ES: 17,
  GO: 19, MA: 23, MT: 17, MS: 17, MG: 18, PA: 19, PB: 20, PR: 19.5,
  PE: 20.5, PI: 22.5, RJ: 22, RN: 20, RS: 17, RO: 19.5, RR: 20,
  SC: 17, SP: 18, SE: 22, TO: 20,
};

// ---------- Anexos do Simples Nacional (LC 155/2016) ----------
type Faixa = { ate: number; aliq: number; deduz: number };

// Partições (repartição dos tributos) por faixa — LC 155/2016
// Colunas: IRPJ | CSLL | COFINS | PIS/Pasep | CPP | ICMS | ISS (quando aplicável)
type Particao = {
  IRPJ: number; CSLL: number; COFINS: number; PIS: number; CPP: number; ICMS?: number; ISS?: number;
};

const PARTICOES: Record<string, Particao[]> = {
  I: [
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 41.5, ICMS: 34.0 },
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 41.5, ICMS: 34.0 },
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 42.0, ICMS: 33.5 },
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 42.0, ICMS: 33.5 },
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 12.74, PIS: 2.76, CPP: 42.0, ICMS: 33.5 },
    { IRPJ: 13.5, CSLL: 10.0, COFINS: 28.27, PIS: 6.13, CPP: 42.1, ICMS: 0 },
  ],
  II: [
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, ICMS: 32.0 }, // + IPI 7.5
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, ICMS: 32.0 },
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, ICMS: 32.0 },
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, ICMS: 32.0 },
    { IRPJ: 5.5, CSLL: 3.5, COFINS: 11.51, PIS: 2.49, CPP: 37.5, ICMS: 32.0 },
    { IRPJ: 8.5, CSLL: 7.5, COFINS: 20.96, PIS: 4.54, CPP: 23.5, ICMS: 35.0 },
  ],
  III: [
    { IRPJ: 4.0, CSLL: 3.5, COFINS: 12.82, PIS: 2.78, CPP: 43.4, ISS: 33.5 },
    { IRPJ: 4.0, CSLL: 3.5, COFINS: 14.05, PIS: 3.05, CPP: 43.4, ISS: 32.0 },
    { IRPJ: 4.0, CSLL: 3.5, COFINS: 13.64, PIS: 2.96, CPP: 43.4, ISS: 32.5 },
    { IRPJ: 4.0, CSLL: 3.5, COFINS: 13.64, PIS: 2.96, CPP: 43.4, ISS: 32.5 },
    { IRPJ: 4.0, CSLL: 3.5, COFINS: 12.82, PIS: 2.78, CPP: 43.4, ISS: 33.5 },
    { IRPJ: 35.0, CSLL: 15.0, COFINS: 16.03, PIS: 3.47, CPP: 30.5, ISS: 0 },
  ],
  IV: [
    { IRPJ: 18.8, CSLL: 15.2, COFINS: 17.67, PIS: 3.83, CPP: 0, ISS: 44.5 },
    { IRPJ: 19.8, CSLL: 15.2, COFINS: 20.55, PIS: 4.45, CPP: 0, ISS: 40.0 },
    { IRPJ: 20.8, CSLL: 15.2, COFINS: 19.73, PIS: 4.27, CPP: 0, ISS: 40.0 },
    { IRPJ: 17.8, CSLL: 19.2, COFINS: 18.9, PIS: 4.1, CPP: 0, ISS: 40.0 },
    { IRPJ: 18.8, CSLL: 19.2, COFINS: 18.08, PIS: 3.92, CPP: 0, ISS: 40.0 },
    { IRPJ: 53.5, CSLL: 21.5, COFINS: 20.55, PIS: 4.45, CPP: 0, ISS: 0 },
  ],
  V: [
    { IRPJ: 25.0, CSLL: 15.0, COFINS: 14.1, PIS: 3.05, CPP: 28.85, ISS: 14.0 },
    { IRPJ: 23.0, CSLL: 15.0, COFINS: 14.1, PIS: 3.05, CPP: 27.85, ISS: 17.0 },
    { IRPJ: 24.0, CSLL: 15.0, COFINS: 14.92, PIS: 3.23, CPP: 23.85, ISS: 19.0 },
    { IRPJ: 21.0, CSLL: 15.0, COFINS: 15.74, PIS: 3.41, CPP: 23.85, ISS: 21.0 },
    { IRPJ: 23.0, CSLL: 12.5, COFINS: 14.1, PIS: 3.05, CPP: 23.85, ISS: 23.5 },
    { IRPJ: 35.0, CSLL: 15.5, COFINS: 16.44, PIS: 3.56, CPP: 29.5, ISS: 0 },
  ],
};

const ANEXOS: Record<string, { nome: string; faixas: Faixa[] }> = {
  I: {
    nome: "Anexo I - Comércio",
    faixas: [
      { ate: 180000, aliq: 0.04, deduz: 0 },
      { ate: 360000, aliq: 0.073, deduz: 5940 },
      { ate: 720000, aliq: 0.095, deduz: 13860 },
      { ate: 1800000, aliq: 0.107, deduz: 22500 },
      { ate: 3600000, aliq: 0.143, deduz: 87300 },
      { ate: 4800000, aliq: 0.19, deduz: 378000 },
    ],
  },
  II: {
    nome: "Anexo II - Indústria",
    faixas: [
      { ate: 180000, aliq: 0.045, deduz: 0 },
      { ate: 360000, aliq: 0.078, deduz: 5940 },
      { ate: 720000, aliq: 0.1, deduz: 13860 },
      { ate: 1800000, aliq: 0.112, deduz: 22500 },
      { ate: 3600000, aliq: 0.147, deduz: 85500 },
      { ate: 4800000, aliq: 0.3, deduz: 720000 },
    ],
  },
  III: {
    nome: "Anexo III - Serviços",
    faixas: [
      { ate: 180000, aliq: 0.06, deduz: 0 },
      { ate: 360000, aliq: 0.112, deduz: 9360 },
      { ate: 720000, aliq: 0.135, deduz: 17640 },
      { ate: 1800000, aliq: 0.16, deduz: 35640 },
      { ate: 3600000, aliq: 0.21, deduz: 125640 },
      { ate: 4800000, aliq: 0.33, deduz: 648000 },
    ],
  },
  IV: {
    nome: "Anexo IV - Serviços (construção, limpeza)",
    faixas: [
      { ate: 180000, aliq: 0.045, deduz: 0 },
      { ate: 360000, aliq: 0.09, deduz: 8100 },
      { ate: 720000, aliq: 0.102, deduz: 12420 },
      { ate: 1800000, aliq: 0.14, deduz: 39780 },
      { ate: 3600000, aliq: 0.22, deduz: 183780 },
      { ate: 4800000, aliq: 0.33, deduz: 828000 },
    ],
  },
  V: {
    nome: "Anexo V - Serviços intelectuais",
    faixas: [
      { ate: 180000, aliq: 0.155, deduz: 0 },
      { ate: 360000, aliq: 0.18, deduz: 4500 },
      { ate: 720000, aliq: 0.195, deduz: 9900 },
      { ate: 1800000, aliq: 0.205, deduz: 17100 },
      { ate: 3600000, aliq: 0.23, deduz: 62100 },
      { ate: 4800000, aliq: 0.305, deduz: 540000 },
    ],
  },
};

function calcSimples(rbt12: number, receitaMes: number, anexo: string) {
  const a = ANEXOS[anexo];
  if (!a || rbt12 <= 0 || receitaMes <= 0)
    return {
      das: 0,
      aliqEfet: 0,
      aliqNom: 0,
      deduz: 0,
      faixa: "",
    };
  const faixa = a.faixas.find((f) => rbt12 <= f.ate) || a.faixas[a.faixas.length - 1];
  const aliqEfet = Math.max(
    0,
    (rbt12 * faixa.aliq - faixa.deduz) / rbt12,
  );
  const das = receitaMes * aliqEfet;
  const idx = a.faixas.indexOf(faixa);
  return {
    das,
    aliqEfet,
    aliqNom: faixa.aliq,
    deduz: faixa.deduz,
    faixa: `${idx + 1}ª Faixa`,
  };
}

// ---------- Lucro Presumido ----------
// Presunção IRPJ/CSLL depende da atividade
function calcPresumido(
  receitaMes: number,
  atividade: "comercio" | "servico",
  issRate: number,
  icmsRate: number,
) {
  if (receitaMes <= 0)
    return { total: 0, irpj: 0, csll: 0, pis: 0, cofins: 0, icmsIss: 0, aliq: 0 };

  const presIRPJ = atividade === "comercio" ? 0.08 : 0.32;
  const presCSLL = atividade === "comercio" ? 0.12 : 0.32;
  const baseIRPJ = receitaMes * presIRPJ;
  const baseCSLL = receitaMes * presCSLL;
  const irpj = baseIRPJ * 0.15 + Math.max(0, baseIRPJ - 20000) * 0.1;
  const csll = baseCSLL * 0.09;
  const pis = receitaMes * 0.0065;
  const cofins = receitaMes * 0.03;
  const icmsIss =
    atividade === "comercio"
      ? receitaMes * (icmsRate / 100)
      : receitaMes * (issRate / 100);
  const total = irpj + csll + pis + cofins + icmsIss;
  return {
    total,
    irpj,
    csll,
    pis,
    cofins,
    icmsIss,
    aliq: total / receitaMes,
  };
}

// ---------- Lucro Real ----------
function calcReal(
  receitaMes: number,
  lucroMes: number,
  atividade: "comercio" | "servico",
  issRate: number,
  icmsRate: number,
) {
  if (receitaMes <= 0)
    return { total: 0, irpj: 0, csll: 0, pis: 0, cofins: 0, icmsIss: 0, aliq: 0 };
  const lucro = Math.max(0, lucroMes);
  const irpj = lucro * 0.15 + Math.max(0, lucro - 20000) * 0.1;
  const csll = lucro * 0.09;
  const pis = receitaMes * 0.0165;
  const cofins = receitaMes * 0.076;
  const icmsIss =
    atividade === "comercio"
      ? receitaMes * (icmsRate / 100)
      : receitaMes * (issRate / 100);
  const total = irpj + csll + pis + cofins + icmsIss;
  return {
    total,
    irpj,
    csll,
    pis,
    cofins,
    icmsIss,
    aliq: total / receitaMes,
  };
}

const RegimeCard = ({
  nome,
  total,
  aliq,
  itens,
  best,
}: {
  nome: string;
  total: number;
  aliq: number;
  itens: { label: string; value: number }[];
  best?: boolean;
}) => (
  <Card
    className={`border p-5 ${
      best
        ? "border-accent/60 bg-accent/5 shadow-elegant"
        : "border-border bg-card"
    }`}
  >
    <div className="flex items-start justify-between">
      <h5 className="font-display text-base font-bold text-primary">{nome}</h5>
      {best && (
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
          <CheckCircle2 className="h-3 w-3" /> Mais econômico
        </span>
      )}
    </div>
    <p className="mt-1 text-xs text-muted-foreground">
      Alíquota efetiva: <strong>{(aliq * 100).toFixed(2)}%</strong>
    </p>
    <div className="mt-3 text-2xl font-bold text-primary">
      {fmtBRL(total)}
      <span className="ml-1 text-xs font-normal text-muted-foreground">/mês</span>
    </div>
    <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs">
      {itens.map((i) => (
        <div key={i.label} className="flex justify-between">
          <span className="text-muted-foreground">{i.label}</span>
          <span className="font-medium text-foreground">{fmtBRL(i.value)}</span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-border pt-2">
        <span className="font-semibold text-primary">Total anual</span>
        <span className="font-bold text-primary">{fmtBRL(total * 12)}</span>
      </div>
    </div>
  </Card>
);

export const TaxRegimeSimulator = () => {
  const [faturamentoMes, setFatMes] = useState("50000");
  const [faturamentoAno, setFatAno] = useState("600000");
  const [lucroMes, setLucroMes] = useState("10000");
  const [atividade, setAtividade] = useState<"comercio" | "servico">("comercio");
  const [anexo, setAnexo] = useState("I");
  const [iss, setIss] = useState("5");
  const [uf, setUf] = useState<string>("SP");
  const [icms, setIcms] = useState(String(ICMS_UF["SP"]));
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);

  // Atualiza ICMS automaticamente ao trocar UF
  const handleUfChange = (novaUf: string) => {
    setUf(novaUf);
    if (ICMS_UF[novaUf] !== undefined) setIcms(String(ICMS_UF[novaUf]));
  };

  const fm = parseFloat(faturamentoMes) || 0;
  const fa = parseFloat(faturamentoAno) || 0;
  const lm = parseFloat(lucroMes) || 0;
  const issN = parseFloat(iss) || 0;
  const icmsN = parseFloat(icms) || 0;
  const margem = fm > 0 ? (lm / fm) * 100 : 0;

  const simples = useMemo(
    () => calcSimples(fa, fm, anexo),
    [fa, fm, anexo],
  );
  const presumido = useMemo(
    () => calcPresumido(fm, atividade, issN, icmsN),
    [fm, atividade, issN, icmsN],
  );
  const real = useMemo(
    () => calcReal(fm, lm, atividade, issN, icmsN),
    [fm, lm, atividade, issN, icmsN],
  );

  const best = useMemo(() => {
    const arr = [
      { k: "simples", v: simples.das },
      { k: "presumido", v: presumido.total },
      { k: "real", v: real.total },
    ].filter((x) => x.v > 0);
    if (!arr.length) return null;
    return arr.reduce((a, b) => (a.v < b.v ? a : b)).k;
  }, [simples.das, presumido.total, real.total]);

  // IBS + CBS (Reforma 2033 - sistema pleno, estimativa sem créditos)
  const ibsCbs2033 = fm * 0.265;
  const cargaAtualReferencia =
    best === "simples" ? simples.das : best === "presumido" ? presumido.total : real.total;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Faturamento mensal (R$)</Label>
          <Input
            type="number"
            inputMode="decimal"
            value={faturamentoMes}
            onChange={(e) => setFatMes(e.target.value)}
          />
        </div>
        <div>
          <Label>Faturamento anual / RBT12 (R$)</Label>
          <Input
            type="number"
            inputMode="decimal"
            value={faturamentoAno}
            onChange={(e) => setFatAno(e.target.value)}
          />
        </div>
        <div>
          <Label>Lucro mensal (R$) — para Lucro Real</Label>
          <Input
            type="number"
            inputMode="decimal"
            value={lucroMes}
            onChange={(e) => setLucroMes(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Margem: {margem.toFixed(2)}%
          </p>
        </div>
        <div>
          <Label>Atividade</Label>
          <Select
            value={atividade}
            onValueChange={(v: "comercio" | "servico") => setAtividade(v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comercio">Comércio / Indústria</SelectItem>
              <SelectItem value="servico">Serviços</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Anexo do Simples Nacional</Label>
          <Select value={anexo} onValueChange={setAnexo}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ANEXOS).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label>ISS (%)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={iss}
              onChange={(e) => setIss(e.target.value)}
            />
          </div>
          <div>
            <Label>UF (ICMS)</Label>
            <Select value={uf} onValueChange={handleUfChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {Object.keys(ICMS_UF)
                  .sort()
                  .map((sigla) => (
                    <SelectItem key={sigla} value={sigla}>
                      {sigla} — {ICMS_UF[sigla]}%
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ICMS (%)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={icms}
              onChange={(e) => setIcms(e.target.value)}
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              Alíquota interna padrão de {uf}. Edite se aplicável.
            </p>
          </div>
        </div>
      </div>

      {/* Banner melhor regime */}
      {best && fm > 0 && fa > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-accent/40 bg-gradient-accent p-4 text-accent-foreground">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
              Regime mais econômico
            </p>
            <p className="font-display text-lg font-bold">
              {best === "simples"
                ? "Simples Nacional"
                : best === "presumido"
                  ? "Lucro Presumido"
                  : "Lucro Real"}{" "}
              — {fmtBRL(cargaAtualReferencia)}/mês
            </p>
          </div>
        </div>
      )}

      {/* Cards comparativos */}
      <div className="grid gap-4 md:grid-cols-3">
        <RegimeCard
          nome="Simples Nacional"
          total={simples.das}
          aliq={simples.aliqEfet}
          best={best === "simples"}
          itens={[
            { label: "DAS unificado", value: simples.das },
          ]}
        />
        <RegimeCard
          nome="Lucro Presumido"
          total={presumido.total}
          aliq={presumido.aliq}
          best={best === "presumido"}
          itens={[
            { label: "IRPJ", value: presumido.irpj },
            { label: "CSLL", value: presumido.csll },
            { label: "PIS", value: presumido.pis },
            { label: "COFINS", value: presumido.cofins },
            {
              label: atividade === "comercio" ? "ICMS" : "ISS",
              value: presumido.icmsIss,
            },
          ]}
        />
        <RegimeCard
          nome="Lucro Real"
          total={real.total}
          aliq={real.aliq}
          best={best === "real"}
          itens={[
            { label: "IRPJ", value: real.irpj },
            { label: "CSLL", value: real.csll },
            { label: "PIS", value: real.pis },
            { label: "COFINS", value: real.cofins },
            {
              label: atividade === "comercio" ? "ICMS" : "ISS",
              value: real.icmsIss,
            },
          ]}
        />
      </div>

      {/* Detalhe Simples */}
      {simples.das > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <h5 className="mb-2 font-display font-bold text-primary">
            📊 Partição do Simples Nacional
          </h5>
          <div className="grid gap-1 sm:grid-cols-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Faturamento Anual (RBT12):</span>
              <span className="font-medium">{fmtBRL(fa)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Anexo:</span>
              <span className="font-medium">{ANEXOS[anexo].nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Faixa identificada:</span>
              <span className="font-medium">{simples.faixa}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alíquota Nominal:</span>
              <span className="font-medium">{(simples.aliqNom * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor a Deduzir:</span>
              <span className="font-medium">{fmtBRL(simples.deduz)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alíquota Efetiva:</span>
              <span className="font-bold text-accent">
                {(simples.aliqEfet * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Fórmula: <em>((RBT12 × Alíq. Nominal) − Dedução) / RBT12</em>
          </p>
        </div>
      )}

      {/* Reforma tributária IBS + CBS */}
      {fm > 0 && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h5 className="font-display font-bold text-primary">
              Reforma Tributária — IBS + CBS (vigência plena 2033)
            </h5>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">CBS (Federal) — 8,8%</p>
              <p className="font-bold text-primary">{fmtBRL(fm * 0.088)}/mês</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">IBS (Est./Mun.) — 17,7%</p>
              <p className="font-bold text-primary">{fmtBRL(fm * 0.177)}/mês</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">IVA Total — ~26,5%</p>
              <p className="font-bold text-accent">{fmtBRL(ibsCbs2033)}/mês</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            <Info className="mr-1 inline h-3 w-3" />
            Estimativa bruta, sem considerar créditos de IVA (não cumulativo). A
            transição é gradual: 2026 (fase de testes), 2027 (CBS plena), 2033
            (sistema pleno).
          </p>
        </div>
      )}

      {/* Tabela de Faixas e Partição do Anexo selecionado */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h5 className="mb-1 font-display font-bold text-primary">
          📑 {ANEXOS[anexo].nome} — Faixas e Repartição dos Tributos
        </h5>
        <p className="mb-3 text-xs text-muted-foreground">
          Tabela oficial conforme LC 155/2016. A "partição" define como o DAS é
          distribuído internamente entre IRPJ, CSLL, COFINS, PIS, CPP (INSS
          patronal) e {anexo === "I" || anexo === "II" ? "ICMS" : "ISS"}.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-xs">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="border border-border px-2 py-2 text-left">Faixa</th>
                <th className="border border-border px-2 py-2 text-left">Receita em 12 meses (RBT12)</th>
                <th className="border border-border px-2 py-2 text-center">Alíq. Nominal</th>
                <th className="border border-border px-2 py-2 text-right">Dedução (R$)</th>
                <th className="border border-border px-2 py-2 text-center">IRPJ</th>
                <th className="border border-border px-2 py-2 text-center">CSLL</th>
                <th className="border border-border px-2 py-2 text-center">COFINS</th>
                <th className="border border-border px-2 py-2 text-center">PIS</th>
                <th className="border border-border px-2 py-2 text-center">CPP</th>
                <th className="border border-border px-2 py-2 text-center">
                  {anexo === "I" || anexo === "II" ? "ICMS" : "ISS"}
                </th>
              </tr>
            </thead>
            <tbody>
              {ANEXOS[anexo].faixas.map((f, i) => {
                const p = PARTICOES[anexo][i];
                const ativa = simples.faixa === `${i + 1}ª Faixa`;
                const limInf = i === 0 ? 0 : ANEXOS[anexo].faixas[i - 1].ate;
                return (
                  <tr
                    key={i}
                    className={
                      ativa
                        ? "bg-accent/15 font-semibold"
                        : i % 2
                          ? "bg-muted/40"
                          : "bg-card"
                    }
                  >
                    <td className="border border-border px-2 py-1.5">{i + 1}ª</td>
                    <td className="border border-border px-2 py-1.5">
                      {fmtBRL(limInf)} — {fmtBRL(f.ate)}
                    </td>
                    <td className="border border-border px-2 py-1.5 text-center">
                      {(f.aliq * 100).toFixed(2)}%
                    </td>
                    <td className="border border-border px-2 py-1.5 text-right">
                      {f.deduz === 0 ? "—" : fmtBRL(f.deduz)}
                    </td>
                    <td className="border border-border px-2 py-1.5 text-center">{p.IRPJ.toFixed(2)}%</td>
                    <td className="border border-border px-2 py-1.5 text-center">{p.CSLL.toFixed(2)}%</td>
                    <td className="border border-border px-2 py-1.5 text-center">{p.COFINS.toFixed(2)}%</td>
                    <td className="border border-border px-2 py-1.5 text-center">{p.PIS.toFixed(2)}%</td>
                    <td className="border border-border px-2 py-1.5 text-center">{p.CPP.toFixed(2)}%</td>
                    <td className="border border-border px-2 py-1.5 text-center">
                      {(anexo === "I" || anexo === "II" ? p.ICMS : p.ISS)?.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          <p>
            <strong className="text-foreground">CPP:</strong> Contribuição
            Previdenciária Patronal (INSS da empresa).
          </p>
          <p>
            <strong className="text-foreground">6ª faixa:</strong> ICMS/ISS não
            são recolhidos no DAS — são apurados fora do Simples.
          </p>
          {anexo === "II" && (
            <p className="sm:col-span-2">
              <strong className="text-foreground">Anexo II:</strong> inclui
              também IPI de 7,5% na partição (industrialização).
            </p>
          )}
          {anexo === "V" && (
            <p className="sm:col-span-2">
              <strong className="text-foreground">Fator R:</strong> serviços
              intelectuais com folha ≥ 28% da receita migram para o Anexo III
              (carga menor).
            </p>
          )}
        </div>
      </div>

      {/* Planos de Assessoria Contábil */}
      {fm > 0 && fa > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h5 className="mb-1 font-display font-bold text-primary">
            💼 Planos de Assessoria Contábil
          </h5>
          <p className="mb-4 text-xs text-muted-foreground">
            Combine a carga tributária simulada com o investimento mensal em assessoria contábil.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.code}
                className={`flex flex-col border p-4 transition-all ${
                  plan.highlight
                    ? "border-accent/60 bg-accent/5 shadow-elegant"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-2 inline-flex items-center gap-1 self-start rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                    <Sparkles className="h-3 w-3" /> Mais popular
                  </span>
                )}
                <div className="rounded-lg bg-primary px-3 py-2 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                    Plano
                  </p>
                  <p className="font-display text-2xl font-bold text-accent">
                    {plan.name}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/90">
                    {plan.subtitle}
                  </p>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    A partir de
                  </p>
                  <p className="font-display text-3xl font-bold text-primary">
                    R$ {plan.price},00
                    <span className="text-sm font-normal text-muted-foreground"> /mês</span>
                  </p>
                </div>
                <ul className="mt-3 flex-1 space-y-1 text-xs">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 rounded-lg bg-primary/10 p-2 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Total mensal estimado
                  </p>
                  <p className="font-display text-lg font-bold text-primary">
                    {fmtBRL(cargaAtualReferencia + Number(plan.price))}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Tributos + plano
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    setSelectedPlan({ name: plan.name, price: plan.price })
                  }
                  className={`mt-3 w-full ${
                    plan.highlight
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : ""
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                  size="sm"
                >
                  Contratar {plan.name}
                </Button>
              </Card>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            ⚠️ O total mensal estimado é a soma da carga tributária do regime mais econômico com o investimento do plano. Valores meramente informativos.
          </p>
        </div>
      )}

      {fm > 0 && fa > 0 && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            gerarRelatorioPDF({
              title: "Simulador Tributário de Regimes",
              subtitle: "Comparativo Simples × Presumido × Real + Reforma 2033",
              fileName: `Simulador_Tributario_${Date.now()}.pdf`,
              sections: [
                {
                  title: "Parâmetros informados",
                  rows: [
                    { label: "Faturamento mensal", value: fmtBRL(fm) },
                    { label: "Faturamento anual / RBT12", value: fmtBRL(fa) },
                    { label: "Lucro mensal (Lucro Real)", value: fmtBRL(lm) },
                    { label: "Margem de lucro", value: `${margem.toFixed(2)}%` },
                    { label: "Atividade", value: atividade === "comercio" ? "Comércio / Indústria" : "Serviços" },
                    { label: "Anexo do Simples", value: ANEXOS[anexo].nome },
                    { label: "ISS", value: `${issN.toFixed(2)}%` },
                    { label: `ICMS (${uf})`, value: `${icmsN.toFixed(2)}%` },
                  ],
                },
                {
                  title: "Simples Nacional",
                  rows: [
                    { label: "Faixa identificada", value: simples.faixa || "—" },
                    { label: "Alíquota nominal", value: `${(simples.aliqNom * 100).toFixed(2)}%` },
                    { label: "Valor a deduzir", value: fmtBRL(simples.deduz) },
                    { label: "Alíquota efetiva", value: `${(simples.aliqEfet * 100).toFixed(2)}%` },
                    { divider: true },
                    { label: "DAS mensal", value: fmtBRL(simples.das), highlight: best === "simples" },
                    { label: "Total anual estimado", value: fmtBRL(simples.das * 12) },
                  ],
                },
                {
                  title: "Lucro Presumido",
                  rows: [
                    { label: "IRPJ", value: fmtBRL(presumido.irpj) },
                    { label: "CSLL", value: fmtBRL(presumido.csll) },
                    { label: "PIS (0,65%)", value: fmtBRL(presumido.pis) },
                    { label: "COFINS (3%)", value: fmtBRL(presumido.cofins) },
                    { label: atividade === "comercio" ? `ICMS (${icmsN}%)` : `ISS (${issN}%)`, value: fmtBRL(presumido.icmsIss) },
                    { divider: true },
                    { label: "Total mensal", value: fmtBRL(presumido.total), highlight: best === "presumido" },
                    { label: "Alíquota efetiva", value: `${(presumido.aliq * 100).toFixed(2)}%` },
                    { label: "Total anual estimado", value: fmtBRL(presumido.total * 12) },
                  ],
                },
                {
                  title: "Lucro Real",
                  rows: [
                    { label: "IRPJ (15% + adicional 10%)", value: fmtBRL(real.irpj) },
                    { label: "CSLL (9%)", value: fmtBRL(real.csll) },
                    { label: "PIS (1,65% não-cumulativo)", value: fmtBRL(real.pis) },
                    { label: "COFINS (7,6% não-cumulativo)", value: fmtBRL(real.cofins) },
                    { label: atividade === "comercio" ? `ICMS (${icmsN}%)` : `ISS (${issN}%)`, value: fmtBRL(real.icmsIss) },
                    { divider: true },
                    { label: "Total mensal", value: fmtBRL(real.total), highlight: best === "real" },
                    { label: "Alíquota efetiva", value: `${(real.aliq * 100).toFixed(2)}%` },
                    { label: "Total anual estimado", value: fmtBRL(real.total * 12) },
                  ],
                },
                {
                  title: "Conclusão",
                  rows: [
                    {
                      label: "Regime mais econômico",
                      value:
                        best === "simples"
                          ? "Simples Nacional"
                          : best === "presumido"
                            ? "Lucro Presumido"
                            : "Lucro Real",
                      highlight: true,
                    },
                    { label: "Carga tributária mensal", value: fmtBRL(cargaAtualReferencia) },
                    { label: "Carga tributária anual", value: fmtBRL(cargaAtualReferencia * 12) },
                  ],
                },
                {
                  title: "Planos de Assessoria Contábil",
                  rows: [
                    ...plans.map((plan) => ({
                      label: `Plano ${plan.name} (${plan.subtitle})`,
                      value: `R$ ${plan.price},00/mês`,
                      highlight: plan.highlight,
                    })),
                    { divider: true },
                    {
                      label: "Total mensal (tributos + plano START)",
                      value: fmtBRL(cargaAtualReferencia + 569),
                      highlight: true,
                    },
                    {
                      label: "Total mensal (tributos + plano PREMIUM)",
                      value: fmtBRL(cargaAtualReferencia + 899),
                    },
                  ],
                },
                {
                  title: "Reforma Tributária — IBS + CBS (vigência plena 2033)",
                  rows: [
                    { label: "CBS Federal (8,8%)", value: `${fmtBRL(fm * 0.088)}/mês` },
                    { label: "IBS Estadual/Municipal (17,7%)", value: `${fmtBRL(fm * 0.177)}/mês` },
                    { label: "IVA Total (~26,5%)", value: `${fmtBRL(ibsCbs2033)}/mês`, highlight: true },
                    { note: "Estimativa bruta sem créditos do IVA não-cumulativo. Transição: 2026 testes, 2027 CBS plena, 2033 sistema pleno." },
                  ],
                },
              ],
            })
          }
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimir relatório comparativo
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        ⚠️ Simulação para fins de planejamento. O enquadramento ideal depende de
        análise detalhada (CNAE, folha, créditos, benefícios fiscais). Consulte
        a Company Contábil para um diagnóstico preciso.
      </p>

      <PlanContractDialog
        open={!!selectedPlan}
        onOpenChange={(o) => !o && setSelectedPlan(null)}
        planName={selectedPlan?.name ?? ""}
        planPrice={selectedPlan?.price}
      />
    </div>
  );
};
