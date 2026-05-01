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
  Scale,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { TaxRegimeSimulator } from "./TaxRegimeSimulator";
import { gerarRelatorioPDF, loadBrand } from "@/lib/pdfReport";
import { Printer, Settings } from "lucide-react";
import { BrandSettingsDialog } from "@/components/BrandSettingsDialog";

type ToolKey =
  | "nf"
  | "rpa"
  | "agendamento"
  | "custo-funcionario"
  | "pro-labore"
  | "inss"
  | "simulador-tributario";

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
    key: "simulador-tributario",
    title: "Simulador Tributário de Regimes",
    short: "Simples × Presumido × Real + Reforma 2026",
    icon: Scale,
    type: "calc",
  },
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
  "simulador-tributario": {
    title: "Simulador Tributário de Regimes",
    body: (
      <>
        <p>
          Compare <strong>Simples Nacional</strong>, <strong>Lucro Presumido</strong>{" "}
          e <strong>Lucro Real</strong> com base no faturamento e lucro da sua
          empresa. O simulador já considera a{" "}
          <strong>Reforma Tributária (IBS + CBS)</strong> com vigência plena
          prevista para 2033.
        </p>
        <p>
          <strong>Simples Nacional:</strong> DAS unificado, alíquotas de{" "}
          <em>4% a 33%</em> conforme o anexo (I a V) e o RBT12.{" "}
          <strong>Lucro Presumido:</strong> IRPJ/CSLL sobre presunção (8%/12%
          para comércio, 32% para serviços), PIS 0,65% e COFINS 3% cumulativos.{" "}
          <strong>Lucro Real:</strong> IRPJ/CSLL sobre o lucro efetivo, PIS
          1,65% e COFINS 7,60% não cumulativos (com créditos).
        </p>
        <p className="text-sm text-muted-foreground">
          ⚠️ Simulação indicativa. A escolha correta do regime exige análise
          contábil completa (CNAE, folha, créditos). Consulte-nos para um
          planejamento tributário personalizado.
        </p>
      </>
    ),
  },
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
    // Provisão da multa rescisória de 40% sobre todo FGTS depositado no mês
    // (inclui FGTS do salário e FGTS sobre férias e 13º)
    const multaFgts40 = (fgts + fgtsProvisoes) * 0.4;
    const total =
      valor +
      inssPatronal +
      fgts +
      ratTerceiros +
      ferias +
      decimoTerceiro +
      fgtsProvisoes +
      multaFgts40;
    const pct = valor > 0 ? ((total / valor - 1) * 100).toFixed(1) : "0";
    return {
      inssPatronal,
      fgts,
      ratTerceiros,
      ferias,
      decimoTerceiro,
      fgtsProvisoes,
      multaFgts40,
      total,
      pct,
    };
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
          <Row label="Provisão multa rescisória FGTS (40%)" value={fmtBRL(result.multaFgts40)} />
          <div className="my-2 h-px bg-border" />
          <Row
            label="Custo total mensal"
            value={fmtBRL(result.total)}
            highlight
          />
          <p className="pt-1 text-xs text-muted-foreground">
            Equivale a aproximadamente <strong>{result.pct}%</strong> acima do salário bruto.
            A multa de 40% é provisionada mensalmente sobre o FGTS depositado, prevendo eventual rescisão sem justa causa.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full"
            onClick={() =>
              gerarRelatorioPDF({
                title: "Custo Total com Funcionário",
                subtitle: "Relatório de cortesia",
                fileName: `Custo_Funcionario_${Date.now()}.pdf`,
                sections: [
                  {
                    title: "Dados informados",
                    rows: [
                      { label: "Salário bruto mensal", value: fmtBRL(valor) },
                    ],
                  },
                  {
                    title: "Encargos e provisões",
                    rows: [
                      { label: "INSS patronal (20%)", value: fmtBRL(result.inssPatronal) },
                      { label: "FGTS (8%)", value: fmtBRL(result.fgts) },
                      { label: "RAT + Terceiros (~5,8%)", value: fmtBRL(result.ratTerceiros) },
                      { label: "Provisão de férias + 1/3", value: fmtBRL(result.ferias) },
                      { label: "Provisão de 13º salário", value: fmtBRL(result.decimoTerceiro) },
                      { label: "FGTS sobre provisões", value: fmtBRL(result.fgtsProvisoes) },
                      { label: "Provisão multa rescisória FGTS (40%)", value: fmtBRL(result.multaFgts40) },
                      { divider: true },
                      { label: "Custo total mensal", value: fmtBRL(result.total), highlight: true },
                      { label: "Custo total anual (×12)", value: fmtBRL(result.total * 12) },
                      { note: `Equivale a aproximadamente ${result.pct}% acima do salário bruto.` },
                      { note: "A multa de 40% sobre o FGTS é provisionada todos os meses, prevendo a rescisão sem justa causa, e incide sobre o total depositado de FGTS (salário + provisões de férias e 13º)." },
                    ],
                  },
                ],
              })
            }
          >

            <Printer className="mr-2 h-4 w-4" />
            Imprimir relatório
          </Button>
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
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full"
            onClick={() =>
              gerarRelatorioPDF({
                title: "Cálculo de Pró-labore",
                subtitle: "Relatório de cortesia — Company Contábil",
                fileName: `Pro_Labore_${Date.now()}.pdf`,
                sections: [
                  {
                    title: "Demonstrativo",
                    rows: [
                      { label: "Pró-labore bruto", value: fmtBRL(v) },
                      { label: "(-) INSS sócio (11%, com teto)", value: fmtBRL(result.inss) },
                      { label: "(-) IRRF (tabela progressiva)", value: fmtBRL(result.irrf) },
                      { divider: true },
                      { label: "Líquido a receber", value: fmtBRL(result.liquido), highlight: true },
                      { note: "Pró-labore é a remuneração mensal de sócios administradores. Não há FGTS, 13º nem férias, mas contribui para a aposentadoria do sócio." },
                    ],
                  },
                ],
              })
            }
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir relatório
          </Button>
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
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full"
            onClick={() =>
              gerarRelatorioPDF({
                title: "Cálculo de INSS — Empregado",
                subtitle: "Relatório de cortesia — Company Contábil",
                fileName: `INSS_${Date.now()}.pdf`,
                sections: [
                  {
                    title: "Demonstrativo",
                    rows: [
                      { label: "Salário de contribuição", value: fmtBRL(v) },
                      { label: "INSS devido", value: fmtBRL(inss), highlight: true },
                      { label: "Alíquota efetiva", value: `${aliq}%` },
                    ],
                  },
                  {
                    title: "Tabela progressiva vigente",
                    rows: [
                      { label: "Até R$ 1.518,00", value: "7,5%" },
                      { label: "De R$ 1.518,01 a R$ 2.793,88", value: "9,0%" },
                      { label: "De R$ 2.793,89 a R$ 4.190,83", value: "12,0%" },
                      { label: "De R$ 4.190,84 a R$ 8.157,41 (teto)", value: "14,0%" },
                      { note: "Cálculo progressivo: cada faixa é tributada por sua respectiva alíquota." },
                    ],
                  },
                ],
              })
            }
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir relatório
          </Button>
        </div>
      )}

      <div className="rounded-md bg-secondary/50 p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">Faixas vigentes:</strong> 7,5% até R$ 1.518,00 ·
        9% até R$ 2.793,88 · 12% até R$ 4.190,83 · 14% até R$ 8.157,41 (teto).
      </div>
    </div>
  );
};

// ---------- Calculadora RPA ----------
const TETO_INSS_RPA = 8157.41; // teto previdenciário vigente
const RPA_FAIXA1 = 5000.0;
const RPA_FAIXA2 = 7350.0;

// Helpers de formatação
const formatCpfCnpj = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

// Conversor numérico → extenso em reais (simplificado)
const valorPorExtenso = (valor: number): string => {
  if (valor <= 0) return "zero reais";
  const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
  const especiais = ["dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
  const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
  const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

  const ate999 = (n: number): string => {
    if (n === 0) return "";
    if (n === 100) return "cem";
    const c = Math.floor(n / 100);
    const r = n % 100;
    const partes: string[] = [];
    if (c) partes.push(centenas[c]);
    if (r < 10) {
      if (r) partes.push(unidades[r]);
    } else if (r < 20) {
      partes.push(especiais[r - 10]);
    } else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      partes.push(dezenas[d] + (u ? " e " + unidades[u] : ""));
    }
    return partes.join(" e ");
  };

  const inteiro = Math.floor(valor);
  const cent = Math.round((valor - inteiro) * 100);
  const milhares = Math.floor(inteiro / 1000);
  const resto = inteiro % 1000;

  let texto = "";
  if (milhares > 0) {
    texto += (milhares === 1 ? "mil" : ate999(milhares) + " mil");
    if (resto > 0) texto += resto < 100 ? " e " : " ";
  }
  if (resto > 0) texto += ate999(resto);
  texto += inteiro === 1 ? " real" : " reais";
  if (cent > 0) {
    texto += " e " + ate999(cent) + (cent === 1 ? " centavo" : " centavos");
  }
  return texto;
};

const RpaCalc = () => {
  const [bruto, setBruto] = useState<string>("");
  const [iss, setIss] = useState<string>("5");
  const [inssRetidoOutros, setInssRetidoOutros] = useState<string>("");

  // Dados do recibo
  const [prestador, setPrestador] = useState("");
  const [cpfPrestador, setCpfPrestador] = useState("");
  const [tomador, setTomador] = useState("");
  const [cnpjTomador, setCnpjTomador] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cidade, setCidade] = useState("");
  const [data, setData] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const v = parseFloat(bruto.replace(",", ".")) || 0;
  const aliqIss = parseFloat(iss.replace(",", ".")) || 0;
  const inssOutros = parseFloat(inssRetidoOutros.replace(",", ".")) || 0;

  const result = useMemo(() => {
    const tetoInss = TETO_INSS_RPA * 0.11;
    const inssBruto = v * 0.11;
    const inssDevido = Math.max(0, Math.min(inssBruto, tetoInss - inssOutros));

    const baseIR = Math.max(0, v - inssDevido);
    const irrfPadrao = calcIRRF(baseIR);

    let irrfFinal = irrfPadrao;
    let regraIR = "Tabela progressiva padrão";
    if (v <= RPA_FAIXA1) {
      irrfFinal = 0;
      regraIR = "Isento (até R$ 5.000,00)";
    } else if (v <= RPA_FAIXA2) {
      const desconto = 978.62 - 0.133145 * v;
      irrfFinal = Math.max(0, irrfPadrao - Math.max(0, desconto));
      regraIR = "Desconto especial (Lei 14.663/2023)";
    }

    const issValor = v * (aliqIss / 100);
    const liquido = v - inssDevido - irrfFinal - issValor;
    const inssPatronal = v * 0.2;

    return { inssDevido, irrfFinal, regraIR, issValor, liquido, inssPatronal, baseIR };
  }, [v, aliqIss, inssOutros]);

  const gerarRecibo = () => {
    const brand = loadBrand();
    const hexToRgb = (hex: string): [number, number, number] => {
      const m = hex.replace("#", "");
      return [0, 2, 4].map((i) => parseInt(m.substring(i, i + 2), 16)) as [number, number, number];
    };
    const [pr, pg, pb] = hexToRgb(brand.primaryColor || "#0F2048");

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    let y = margin;

    // Cabeçalho com marca
    const headerH = brand.logoDataUrl ? 30 : 24;
    doc.setFillColor(pr, pg, pb);
    doc.rect(0, 0, pageW, headerH, "F");

    let titleX = pageW / 2;
    let titleAlign: "center" | "left" = "center";
    if (brand.logoDataUrl) {
      try {
        const fmt = brand.logoDataUrl.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
        doc.addImage(brand.logoDataUrl, fmt, margin, 5, 20, 20);
        titleX = margin + 26;
        titleAlign = "left";
      } catch {
        /* logo inválida */
      }
    }
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(brand.companyName.toUpperCase(), titleX, 12, { align: titleAlign });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("RECIBO DE PAGAMENTO A AUTÔNOMO (RPA)", titleX, 19, { align: titleAlign });

    const contatos = [brand.phone, brand.email, brand.website].filter(Boolean) as string[];
    if (contatos.length) {
      doc.setFontSize(8);
      let cy = 9;
      contatos.forEach((c) => {
        doc.text(c, pageW - margin, cy, { align: "right" });
        cy += 4;
      });
    }

    y = headerH + 8;
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Nº do recibo: ${Date.now().toString().slice(-8)}`, margin, y);
    doc.text(`Data: ${new Date(data).toLocaleDateString("pt-BR")}`, pageW - margin, y, { align: "right" });

    y += 10;
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, pageW - margin * 2, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`VALOR BRUTO: ${fmtBRL(v)}`, pageW / 2, y + 9, { align: "center" });

    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const ano = new Date(data).getFullYear();
    const declaracao =
      `Recebi de ${tomador || "________________________"}, inscrito(a) no CNPJ nº ${cnpjTomador || "____________________"}, ` +
      `a importância de ${fmtBRL(v)} (${valorPorExtenso(v)}), referente a ${descricao || "prestação de serviços autônomos"}, ` +
      `prestado(s) no exercício de ${ano}, conforme demonstrativo abaixo.`;
    const linhas = doc.splitTextToSize(declaracao, pageW - margin * 2);
    doc.text(linhas, margin, y);
    y += linhas.length * 5 + 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(pr, pg, pb);
    doc.text("Demonstrativo de cálculo", margin, y);
    doc.setTextColor(20, 20, 20);
    y += 2;
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageW - margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const linha = (label: string, val: string, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.text(label, margin, y);
      doc.text(val, pageW - margin, y, { align: "right" });
      y += 6;
    };
    linha("Valor bruto do serviço", fmtBRL(v));
    linha("(-) INSS (11%, com teto)", fmtBRL(result.inssDevido));
    linha(`(-) IRRF — ${result.regraIR}`, fmtBRL(result.irrfFinal));
    linha(`(-) ISS (${aliqIss}%)`, fmtBRL(result.issValor));
    y += 1;
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
    linha("VALOR LÍQUIDO A RECEBER", fmtBRL(result.liquido), true);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(pr, pg, pb);
    doc.text("Identificação das partes", margin, y);
    doc.setTextColor(20, 20, 20);
    y += 2;
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    linha("Prestador (autônomo)", prestador || "—", true);
    linha("CPF/CNPJ do prestador", cpfPrestador || "—");
    y += 2;
    linha("Tomador (contratante)", tomador || "—", true);
    linha("CNPJ do tomador", cnpjTomador || "—");

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text(
      `${cidade || "________________"}, ${new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}.`,
      margin,
      y,
    );
    y += 24;
    doc.line(margin + 30, y, pageW - margin - 30, y);
    y += 5;
    doc.text(prestador || "Assinatura do prestador", pageW / 2, y, { align: "center" });

    // Rodapé com marca
    const footerLine =
      [brand.companyName, brand.address, brand.phone, brand.email, brand.website]
        .filter(Boolean)
        .join(" · ") || "Calculadora gratuita.";
    doc.setDrawColor(pr, pg, pb);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 16, pageW - margin, pageH - 16);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(footerLine, pageW / 2, pageH - 11, {
      align: "center",
      maxWidth: pageW - margin * 2,
    });
    doc.text(
      "Documento informativo — conferência sujeita à legislação vigente.",
      pageW / 2,
      pageH - 7,
      { align: "center" },
    );

    doc.save(`RPA_${(prestador || "prestador").replace(/\s+/g, "_")}_${data}.pdf`);
  };

  const podeGerar = v > 0 && !!prestador && !!tomador && !!cnpjTomador && !!cidade;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="rpa-bruto">Valor bruto do serviço (R$)</Label>
          <Input
            id="rpa-bruto"
            type="number"
            inputMode="decimal"
            placeholder="Ex: 6000"
            value={bruto}
            onChange={(e) => setBruto(e.target.value)}
            maxLength={10}
          />
        </div>
        <div>
          <Label htmlFor="rpa-iss">Alíquota ISS municipal (%)</Label>
          <Input
            id="rpa-iss"
            type="number"
            inputMode="decimal"
            placeholder="2 a 5"
            value={iss}
            onChange={(e) => setIss(e.target.value)}
            maxLength={5}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="rpa-inss-outros">
          INSS já retido por outros contratantes no mês (R$){" "}
          <span className="text-xs text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="rpa-inss-outros"
          type="number"
          inputMode="decimal"
          placeholder="0,00"
          value={inssRetidoOutros}
          onChange={(e) => setInssRetidoOutros(e.target.value)}
          maxLength={10}
        />
      </div>

      {v > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
          <Row label="Valor bruto do serviço" value={fmtBRL(v)} />
          <Row label="INSS (11%, com teto)" value={`- ${fmtBRL(result.inssDevido)}`} />
          <Row label={`IRRF — ${result.regraIR}`} value={`- ${fmtBRL(result.irrfFinal)}`} />
          <Row label={`ISS (${aliqIss}%)`} value={`- ${fmtBRL(result.issValor)}`} />
          <div className="my-2 h-px bg-border" />
          <Row label="Líquido a receber" value={fmtBRL(result.liquido)} highlight />
          <p className="pt-2 text-xs text-muted-foreground">
            Base de cálculo do IRRF: <strong>{fmtBRL(result.baseIR)}</strong>.
            Contribuição patronal da empresa (20%, informativo):{" "}
            <strong>{fmtBRL(result.inssPatronal)}</strong>.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
        <h4 className="font-display font-bold text-primary">
          Dados para emissão do recibo
        </h4>
        <p className="text-xs text-muted-foreground">
          Preencha os dados abaixo para gerar automaticamente o recibo em PDF
          com o cálculo já aplicado.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="rpa-prestador">Nome do prestador (autônomo)</Label>
            <Input
              id="rpa-prestador"
              placeholder="Ex: João da Silva"
              value={prestador}
              onChange={(e) => setPrestador(e.target.value)}
              maxLength={120}
            />
          </div>
          <div>
            <Label htmlFor="rpa-cpf">CPF/CNPJ do prestador</Label>
            <Input
              id="rpa-cpf"
              placeholder="000.000.000-00"
              value={cpfPrestador}
              onChange={(e) => setCpfPrestador(formatCpfCnpj(e.target.value))}
              maxLength={18}
            />
          </div>
          <div>
            <Label htmlFor="rpa-tomador">Nome do tomador (contratante)</Label>
            <Input
              id="rpa-tomador"
              placeholder="Ex: Empresa XYZ Ltda."
              value={tomador}
              onChange={(e) => setTomador(e.target.value)}
              maxLength={150}
            />
          </div>
          <div>
            <Label htmlFor="rpa-cnpj">CNPJ do tomador</Label>
            <Input
              id="rpa-cnpj"
              placeholder="00.000.000/0000-00"
              value={cnpjTomador}
              onChange={(e) => setCnpjTomador(formatCpfCnpj(e.target.value))}
              maxLength={18}
            />
          </div>
          <div>
            <Label htmlFor="rpa-cidade">Cidade</Label>
            <Input
              id="rpa-cidade"
              placeholder="Ex: São Paulo"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              maxLength={80}
            />
          </div>
          <div>
            <Label htmlFor="rpa-data">Data</Label>
            <Input
              id="rpa-data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="rpa-desc">Descrição do serviço prestado</Label>
            <Input
              id="rpa-desc"
              placeholder="Ex: Consultoria técnica em outubro/2026"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={200}
            />
          </div>
        </div>

        <Button
          onClick={gerarRecibo}
          disabled={!podeGerar}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <FileText className="mr-2 h-4 w-4" />
          Gerar recibo em PDF
        </Button>
        {!podeGerar && (
          <p className="text-xs text-muted-foreground">
            Preencha o valor, prestador, tomador, CNPJ e cidade para liberar a
            geração do recibo.
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        ⚠️ Cálculo estimado para conferência. As retenções e o recolhimento são
        responsabilidade da empresa contratante. Consulte-nos para apuração
        precisa conforme o município e a sua situação.
      </p>
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
  const [brandOpen, setBrandOpen] = useState(false);

  const renderCalc = () => {
    switch (openTool) {
      case "custo-funcionario":
        return <CustoFuncionarioCalc />;
      case "pro-labore":
        return <ProLaboreCalc />;
      case "inss":
        return <InssCalc />;
      case "rpa":
        return <RpaCalc />;
      case "simulador-tributario":
        return <TaxRegimeSimulator />;
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={() => setBrandOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Personalizar PDFs (logo, nome e contatos)
          </Button>
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
        <DialogContent className={`max-h-[90vh] overflow-y-auto ${openTool === "simulador-tributario" ? "sm:max-w-5xl" : "sm:max-w-2xl"}`}>
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
