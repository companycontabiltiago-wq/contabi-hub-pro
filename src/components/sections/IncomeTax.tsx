import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  FolderCheck,
  Receipt,
  TrendingUp,
  XCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import irImage from "@/assets/imposto-renda-2026.jpg";

const importance = [
  {
    icon: ShieldCheck,
    title: "Regularidade fiscal",
    text: "Mantém seu CPF em dia, evita malha fina, bloqueio de conta e impedimentos para emitir passaporte ou tirar empréstimos.",
  },
  {
    icon: TrendingUp,
    title: "Comprovação de renda",
    text: "É o documento oficial usado por bancos, imobiliárias e consulados. Sem declaração, comprovar renda fica praticamente impossível.",
  },
  {
    icon: Receipt,
    title: "Restituição que é sua",
    text: "Quem teve imposto retido na fonte só recupera o valor pago a mais entregando a declaração — e quanto antes entrega, antes recebe.",
  },
  {
    icon: FileCheck2,
    title: "Histórico patrimonial",
    text: "Ela registra a evolução do seu patrimônio. Vendas futuras de imóveis, carros e investimentos exigem origem comprovada.",
  },
];

const documents = [
  {
    title: "Documentos pessoais",
    items: [
      "CPF do titular e dos dependentes (inclusive crianças)",
      "Título de eleitor",
      "Endereço atualizado e atividade profissional",
      "Cópia da última declaração entregue",
      "Dados bancários para restituição (conta corrente ou Pix)",
    ],
  },
  {
    title: "Rendimentos",
    items: [
      "Informe de rendimentos de empresas (CLT) e do INSS",
      "Informe de rendimentos de bancos e corretoras",
      "Recibos de aluguéis recebidos",
      "Pró-labore e distribuição de lucros (sócios)",
      "Carnê-leão (autônomos) com DARFs pagos",
    ],
  },
  {
    title: "Bens e direitos",
    items: [
      "Escritura ou contrato de imóveis (com valor de aquisição)",
      "Documento de veículos com valor de compra",
      "Saldos bancários, aplicações e criptoativos em 31/12",
      "Participações em empresas (capital social)",
      "Comprovantes de financiamentos e dívidas acima de R$ 5.000",
    ],
  },
  {
    title: "Despesas dedutíveis",
    items: [
      "Recibos médicos, odontológicos e de plano de saúde",
      "Comprovantes de mensalidades escolares e faculdade",
      "Recibos de pensão alimentícia (com decisão judicial)",
      "Comprovantes de previdência privada PGBL",
      "Doações realizadas com recibo oficial",
    ],
  },
];

const deductibles = [
  {
    icon: "💊",
    title: "Despesas médicas",
    text: "Médicos, dentistas, hospitais, exames, planos de saúde, fisioterapia e psicologia. Sem limite de valor — desde que tenha recibo válido.",
  },
  {
    icon: "🎓",
    title: "Educação",
    text: "Escola, faculdade, pós-graduação e ensino técnico do titular e dependentes. Limite anual de R$ 3.561,50 por pessoa.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Dependentes",
    text: "Cada dependente reduz R$ 2.275,08 da base de cálculo. Inclui filhos até 21 anos, ou 24 se universitários, e pais com renda baixa.",
  },
  {
    icon: "💰",
    title: "Previdência privada PGBL",
    text: "Contribuições para PGBL podem ser deduzidas em até 12% da renda tributável. Excelente para quem é tributado pelo modelo completo.",
  },
  {
    icon: "⚖️",
    title: "Pensão alimentícia",
    text: "Valores pagos por decisão judicial ou acordo homologado são integralmente dedutíveis. Sem limite de valor.",
  },
  {
    icon: "❤️",
    title: "Doações incentivadas",
    text: "Fundos da Criança e Adolescente, do Idoso, Lei Rouanet e esporte permitem deduzir até 6% do imposto devido.",
  },
];

const errors = [
  "Esquecer de declarar rendimentos de outras fontes (freelas, aluguéis, dividendos)",
  "Omitir contas em corretoras de criptoativos com saldo acima de R$ 5.000",
  "Lançar despesas médicas sem recibo formal ou com dados incompletos",
  "Declarar o mesmo dependente em mais de uma declaração da família",
  "Errar o valor de bens — usar valor de mercado em vez do valor de aquisição",
  "Não declarar venda de imóvel ou veículo realizada no ano",
  "Esquecer de informar contas no exterior acima de US$ 1.000",
  "Escolher o modelo errado (simplificado x completo) e pagar mais imposto",
];

const penalties = [
  {
    title: "Multa mínima",
    value: "R$ 165,74",
    text: "Para quem entrega em atraso, mesmo sem imposto a pagar.",
  },
  {
    title: "Multa por atraso",
    value: "1% ao mês",
    text: "Sobre o imposto devido, limitada a 20% do valor total.",
  },
  {
    title: "CPF irregular",
    value: "Bloqueios",
    text: "Impede empréstimos, financiamentos, passaporte e concursos.",
  },
  {
    title: "Malha fina",
    value: "Risco alto",
    text: "Sem entregar, a Receita pode lançar imposto de ofício com multa de 75% a 150%.",
  },
];

export const IncomeTax = () => {
  const [tab, setTab] = useState("importancia");

  const handleWhatsApp = () => {
    window.open(
      buildWhatsAppUrl(
        "Olá! Gostaria de fazer minha Declaração de Imposto de Renda 2026 com a Company Contábil."
      ),
      "_blank"
    );
  };

  return (
    <section
      id="imposto-renda"
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container">
        {/* Header */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20">
              Prazo: até 31 de maio de 2026
            </Badge>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-primary md:text-5xl text-balance">
              Declaração de Imposto de Renda{" "}
              <span className="text-accent">2026</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pessoa Física com tranquilidade, sem malha fina e com a maior
              restituição possível dentro da lei. Conduzido por contadores
              especialistas em legislação do IR.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={handleWhatsApp}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                Quero minha declaração com especialista
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document
                    .getElementById("ir-conteudo")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ver guia completo
              </Button>
            </div>

            {/* Highlight stat strip */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { v: "31/05", l: "Prazo final" },
                { v: "R$ 165", l: "Multa mínima" },
                { v: "+ deduções", l: "Restituição maior" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-border bg-card p-3 text-center"
                >
                  <div className="font-display text-lg font-bold text-primary">
                    {s.v}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-elegant">
              <img
                src={irImage}
                alt="Declaração de Imposto de Renda 2026 — guia completo"
                width={1280}
                height={896}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content tabs */}
        <div id="ir-conteudo" className="mt-16 scroll-mt-24">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mx-auto grid h-auto w-full max-w-3xl grid-cols-2 gap-1 bg-muted p-1 md:grid-cols-5">
              <TabsTrigger value="importancia" className="text-xs md:text-sm">
                Importância
              </TabsTrigger>
              <TabsTrigger value="documentos" className="text-xs md:text-sm">
                Documentos
              </TabsTrigger>
              <TabsTrigger value="deducoes" className="text-xs md:text-sm">
                Deduções
              </TabsTrigger>
              <TabsTrigger value="erros" className="text-xs md:text-sm">
                Erros comuns
              </TabsTrigger>
              <TabsTrigger value="penalidades" className="text-xs md:text-sm">
                Penalidades
              </TabsTrigger>
            </TabsList>

            {/* Importância */}
            <TabsContent value="importancia" className="mt-8">
              <div className="grid gap-5 md:grid-cols-2">
                {importance.map((it) => (
                  <Card
                    key={it.title}
                    className="group flex gap-4 p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <it.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-primary">
                        {it.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {it.text}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Documentos */}
            <TabsContent value="documentos" className="mt-8">
              <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-foreground/80">
                <span className="font-semibold text-primary">Dica de ouro:</span>{" "}
                Organize os documentos em pastas digitais por categoria. Quanto
                mais completo o material, mais rápida e precisa será sua
                declaração.
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {documents.map((d) => (
                  <Card key={d.title} className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <FolderCheck className="h-5 w-5 text-accent" />
                      <h3 className="font-display text-lg font-semibold text-primary">
                        {d.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {d.items.map((it, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-foreground/85"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Deduções */}
            <TabsContent value="deducoes" className="mt-8">
              <p className="mx-auto mb-6 max-w-2xl text-center text-muted-foreground">
                Despesas que reduzem o imposto a pagar (ou aumentam a sua
                restituição) — desde que comprovadas com documento fiscal
                válido.
              </p>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {deductibles.map((d) => (
                  <Card
                    key={d.title}
                    className="group p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
                  >
                    <div className="text-3xl">{d.icon}</div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-primary">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {d.text}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Erros */}
            <TabsContent value="erros" className="mt-8">
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <p className="text-sm text-foreground/85">
                  <span className="font-semibold text-primary">
                    A malha fina cresce a cada ano.
                  </span>{" "}
                  A Receita cruza dados em tempo real com bancos, corretoras,
                  cartórios e empresas. Os erros abaixo respondem por mais de{" "}
                  <strong>80% das retenções em malha</strong>.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {errors.map((e, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/40"
                  >
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <span className="text-sm text-foreground/85">{e}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Penalidades */}
            <TabsContent value="penalidades" className="mt-8">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {penalties.map((p) => (
                  <Card
                    key={p.title}
                    className="overflow-hidden border-2 border-destructive/10 p-0"
                  >
                    <div className="bg-destructive/10 px-5 py-3">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {p.title}
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <div className="font-display text-2xl font-bold text-primary">
                        {p.value}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {p.text}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-2 rounded-xl bg-primary/5 p-4 text-sm text-foreground/85">
                <Calendar className="h-5 w-5 text-accent" />
                <span>
                  <strong className="text-primary">Não deixe para a última hora.</strong>{" "}
                  Quem entrega nos primeiros lotes recebe a restituição antes —
                  e ainda evita filas no atendimento.
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Final CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-hero p-8 text-primary-foreground md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr,1fr]">
            <div>
              <h3 className="font-display text-2xl font-bold md:text-3xl text-balance">
                Conte com um contador especialista em Imposto de Renda
              </h3>
              <p className="mt-3 text-primary-foreground/80">
                Nosso time domina a legislação atualizada do IR, identifica
                todas as deduções aplicáveis ao seu caso e entrega sua
                declaração revisada — sem dor de cabeça e sem risco de malha
                fina.
              </p>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  "Análise completa de documentos",
                  "Simulação simplificado x completo",
                  "Revisão dupla antes do envio",
                  "Acompanhamento da restituição",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-primary-foreground/90"
                  >
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                onClick={handleWhatsApp}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                Falar no WhatsApp agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-center text-xs text-primary-foreground/70">
                Atendimento personalizado · Resposta rápida
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
