import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  CalendarClock,
  Receipt,
  FileText,
  TrendingUp,
  ArrowRight,
  MessageCircle,
  Download,
} from "lucide-react";
import meiImg from "@/assets/mei-illustration.jpg";
import comparativoImg from "@/assets/comparativo-empresas.jpg";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { gerarRelatorioPDF } from "@/lib/pdfReport";

const beneficios = [
  "CNPJ e inscrição imediata para emitir notas fiscais",
  "Aposentadoria por idade e auxílios do INSS (doença, maternidade)",
  "Carga tributária reduzida e fixa (DAS-MEI mensal)",
  "Acesso a crédito facilitado em bancos (PJ)",
  "Possibilidade de contratar até 1 funcionário com salário mínimo ou piso da categoria",
  "Isenção de tributos federais (IRPJ, PIS, COFINS, CSLL e IPI)",
];

const requisitos = [
  {
    title: "Requisitos legais (quem pode ser MEI)",
    items: [
      "Faturar até R$ 81.000,00 por ano (R$ 6.750,00/mês em média)",
      "Não ser sócio, titular ou administrador de outra empresa",
      "Ter no máximo 1 funcionário contratado, recebendo até 1 salário mínimo ou o piso da categoria",
      "Exercer atividade permitida na tabela oficial do SIMEI (CNAE MEI)",
      "Ser maior de 18 anos ou emancipado a partir dos 16 anos",
      "Estar em dia com a Receita Federal (CPF regular, sem pendências na declaração de IRPF)",
      "Não ser servidor público federal em atividade",
      "Não estar recebendo seguro-desemprego — a abertura do CNPJ cancela o benefício",
      "Estrangeiro deve possuir visto permanente e RNM/RNE válido",
    ],
  },
  {
    title: "Documentos e dados pessoais",
    items: [
      "CPF do titular",
      "Número do recibo da última declaração de IRPF (se declarou) ou título de eleitor",
      "Data de nascimento exatamente como consta na Receita Federal",
      "RG ou CNH digitalizados",
      "Telefone celular e e-mail ativos (recebem os códigos de confirmação)",
      "Conta gov.br nível Prata ou Ouro (obrigatória para o cadastro)",
    ],
  },
  {
    title: "Informações do negócio",
    items: [
      "Definição da atividade principal e até 15 atividades secundárias (CNAE permitidas ao MEI)",
      "Nome fantasia do negócio (opcional)",
      "Endereço comercial completo com CEP e número de inscrição imobiliária/IPTU",
      "Endereço residencial completo do titular",
      "Definição se a atividade é exercida no local fixo, na casa do cliente, em local próprio ou pela internet",
      "Verificação prévia de zoneamento/viabilidade junto à prefeitura",
    ],
  },
  {
    title: "Após a abertura (providências imediatas)",
    items: [
      "Emitir o CCMEI — Certificado da Condição de Microempreendedor Individual",
      "Solicitar o alvará de funcionamento e a inscrição municipal na prefeitura",
      "Solicitar Inscrição Estadual na Sefaz (obrigatória para comércio e indústria)",
      "Habilitar a emissão de nota fiscal (NFS-e nacional para serviços e NF-e para comércio)",
      "Gerar e pagar o DAS-MEI todo mês, até o dia 20",
      "Entregar a DASN-SIMEI até 31 de maio de cada ano",
      "Manter o Relatório Mensal de Receitas Brutas com as notas de entrada e saída",
      "Abrir conta bancária PJ para separar as finanças pessoais das da empresa",
      "Atenção ao IPTU: ao registrar o CNPJ no endereço residencial, a Prefeitura pode passar a cobrar a taxa/IPTU do imóvel, inclusive quando o imóvel alugado era isento",
    ],
  },
  {
    title: "Benefícios de ser MEI",
    items: beneficios,
  },
];

const baixarRequisitosPDF = () =>
  gerarRelatorioPDF({
    title: "Requisitos para Abertura de MEI",
    subtitle: "Checklist completo do Microempreendedor Individual",
    fileName: `Requisitos_Abertura_MEI_${Date.now()}.pdf`,
    sections: [
      ...requisitos.map((g) => ({
        title: g.title,
        rows: g.items.map((i) => ({ label: i, value: "☐" })),
      })),
      {
        title: "Impedimentos e observações",
        rows: [
          {
            note: "Não pode ser MEI: sócio, titular ou administrador de outra empresa; servidor público federal em atividade; quem exerce atividade fora da tabela do SIMEI; e beneficiários de auxílios que percam o direito ao abrir CNPJ.",
          },
          {
            note: "Seguro-desemprego: quem está recebendo o benefício não deve abrir MEI — a abertura do CNPJ caracteriza renda própria e cancela as parcelas restantes.",
          },
          {
            note: "IPTU: ao informar o endereço residencial como sede do MEI, a Prefeitura pode passar a cobrar IPTU/taxas do imóvel, inclusive quando o imóvel alugado tinha isenção.",
          },
          {
            note: "O DAS-MEI é fixo mensal: INSS (5% do salário mínimo) + R$ 1,00 de ICMS (comércio/indústria) e/ou R$ 5,00 de ISS (serviços).",
          },
          {
            note: "A Company Contábil cuida de toda a abertura, do enquadramento das atividades ao alvará e à emissão de notas fiscais.",
          },
        ],
      },
    ],
  });


const PAGE_TITLE = "MEI: abertura, obrigações e diferenças entre MEI, ME e EPP | Company Contábil";
const PAGE_DESCRIPTION =
  "Abra seu MEI com a Company Contábil. Conheça as obrigações mensais, limites de faturamento e veja o comparativo entre MEI, ME, EPP e Demais empresas.";

const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};


const obrigacoes = [
  {
    icon: Receipt,
    title: "DAS-MEI mensal",
    desc: "Pagamento mensal do Documento de Arrecadação do Simples Nacional, com vencimento todo dia 20.",
  },
  {
    icon: FileText,
    title: "DASN-SIMEI anual",
    desc: "Declaração Anual do Simples Nacional do MEI, entregue até 31 de maio de cada ano informando o faturamento.",
  },
  {
    icon: CalendarClock,
    title: "Relatório Mensal de Receitas",
    desc: "Manter o relatório mensal de receitas brutas, com as notas fiscais de compras e vendas anexadas.",
  },
  {
    icon: TrendingUp,
    title: "Limite de faturamento",
    desc: "Faturar até R$ 81.000/ano (R$ 251.600 para MEI Caminhoneiro). Excedeu? Comunicar e desenquadrar.",
  },
];

const comparativo = [
  {
    porte: "MEI",
    fat: "Até R$ 81 mil/ano",
    func: "Até 1 funcionário",
    regime: "Simples Nacional (SIMEI)",
    tributos: "DAS fixo (~R$ 75 a R$ 80/mês)",
    obrig: "DASN-SIMEI anual + DAS mensal",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  {
    porte: "ME",
    fat: "Até R$ 360 mil/ano",
    func: "Sem limite legal (cuidado com folha)",
    regime: "Simples, Presumido ou Real",
    tributos: "Alíquota de 4% a 19,5% (Simples)",
    obrig: "DAS, DEFIS, eSocial, EFD-Reinf",
    color: "bg-primary/10 text-primary border-primary/30",
  },
  {
    porte: "EPP",
    fat: "R$ 360 mil a R$ 4,8 mi/ano",
    func: "Sem limite legal",
    regime: "Simples, Presumido ou Real",
    tributos: "Alíquota de 7% a 33% (Simples)",
    obrig: "DAS, DEFIS, eSocial, EFD-Reinf, sublimite ICMS/ISS",
    color: "bg-accent/15 text-accent-foreground border-accent/40",
  },
  {
    porte: "Demais",
    fat: "Acima de R$ 4,8 mi/ano",
    func: "Sem limite",
    regime: "Lucro Presumido ou Lucro Real",
    tributos: "IRPJ, CSLL, PIS, COFINS, ICMS/ISS separados",
    obrig: "ECF, ECD, SPED Fiscal/Contribuições, EFD-Reinf, DCTFWeb",
    color: "bg-slate-500/10 text-slate-700 border-slate-200",
  },
];

const quandoMudar = [
  {
    de: "MEI → ME",
    motivo: "Faturamento ultrapassou R$ 81.000/ano, contratou mais de 1 funcionário ou abriu filial.",
  },
  {
    de: "ME → EPP",
    motivo: "Faturamento ultrapassou R$ 360.000/ano. O desenquadramento é automático no Simples Nacional.",
  },
  {
    de: "EPP → Demais",
    motivo: "Faturamento acima de R$ 4,8 milhões/ano — sai do Simples e migra para Presumido ou Real.",
  },
  {
    de: "Mudança de regime",
    motivo: "Margem de lucro muito alta favorece o Simples; margem baixa pode favorecer o Lucro Real.",
  },
];

const Mei = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    setMeta("description", PAGE_DESCRIPTION);
    setMeta("keywords", "MEI, abertura de MEI, obrigações MEI, ME, EPP, Simples Nacional, DAS-MEI, DASN-SIMEI, contabilidade MEI");
    setMeta("og:title", PAGE_TITLE, "property");
    setMeta("og:description", PAGE_DESCRIPTION, "property");
    setMeta("og:type", "article", "property");
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}/mei`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-gradient-soft py-16 md:py-24">
          <div className="container grid items-center gap-10 md:grid-cols-2">
            <div>
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                MEI · Microempreendedor Individual
              </Badge>
              <h1 className="mt-4 font-display text-3xl font-bold text-primary md:text-5xl text-balance">
                Abra seu MEI em até 24h e comece a faturar legalmente
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Cuidamos de toda a abertura, da emissão do CCMEI à orientação
                sobre obrigações mensais, limites de faturamento e quando migrar
                para ME ou EPP.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <a
                    href={buildWhatsAppUrl(
                      "Olá! Quero abrir meu MEI com a Company Contábil.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Quero abrir meu MEI
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#comparativo">Comparar MEI × ME × EPP</a>
                </Button>
              </div>
            </div>
            <img
              src={meiImg}
              alt="Microempreendedor Individual com seu CNPJ formalizado"
              width={1024}
              height={640}
              className="rounded-2xl shadow-elegant"
            />
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Vantagens
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-primary md:text-4xl">
                Por que se formalizar como MEI?
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {beneficios.map((b) => (
                <div
                  key={b}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm text-foreground/90">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requisitos para abertura */}
        <section id="requisitos" className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Requisitos
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-primary md:text-4xl">
                Tudo o que é exigido para abrir um MEI
              </h2>
              <p className="mt-3 text-muted-foreground">
                Confira os requisitos legais, os documentos e as informações
                necessárias. Você pode baixar a lista completa em PDF e usar
                como checklist.
              </p>
              <Button onClick={baixarRequisitosPDF} size="lg" className="mt-6">
                <Download className="mr-2 h-5 w-5" />
                Baixar requisitos em PDF
              </Button>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {requisitos.map((grupo) => (
                <Card key={grupo.title} className="p-6">
                  <h3 className="font-display text-lg font-semibold text-primary">
                    {grupo.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {grupo.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="text-sm text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong>Quem não pode ser MEI:</strong> sócio, titular ou
                administrador de outra empresa; servidor público federal em
                atividade; quem exerce atividade não permitida na tabela oficial
                do SIMEI; e pensionistas/beneficiários de auxílios que percam o
                direito ao abrir CNPJ.
              </p>
            </div>
          </div>
        </section>



        {/* Obrigações */}
        <section className="bg-gradient-soft py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Obrigações do MEI
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-primary md:text-4xl">
                O que você precisa cumprir todo mês e todo ano
              </h2>
              <p className="mt-3 text-muted-foreground">
                Mesmo com regras simplificadas, o MEI tem obrigações que, se
                ignoradas, geram multas, dívida ativa e até cancelamento do CNPJ.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {obrigacoes.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="p-6">
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong>Atenção:</strong> a falta de pagamento do DAS por 12
                meses gera dívida ativa e perda dos benefícios previdenciários. A
                não entrega da DASN-SIMEI gera multa mínima de R$ 50,00.
              </p>
            </div>
          </div>
        </section>

        {/* Comparativo */}
        <section id="comparativo" className="py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Comparativo
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-primary md:text-4xl">
                MEI × ME × EPP × Demais empresas
              </h2>
              <p className="mt-3 text-muted-foreground">
                Entenda os limites e obrigações de cada porte e descubra qual é o
                ideal para o momento da sua empresa.
              </p>
            </div>

            <div className="mt-10">
              <img
                src={comparativoImg}
                alt="Comparativo visual entre MEI, ME, EPP e Demais empresas"
                width={1280}
                height={640}
                loading="lazy"
                className="mx-auto w-full max-w-4xl rounded-2xl shadow-elegant"
              />
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {comparativo.map((c) => (
                <Card key={c.porte} className="flex flex-col p-6">
                  <div
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold ${c.color}`}
                  >
                    {c.porte}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-primary">
                    Faturamento
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.fat}</p>
                  <h3 className="mt-3 font-display text-sm font-semibold text-primary">
                    Funcionários
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.func}</p>
                  <h3 className="mt-3 font-display text-sm font-semibold text-primary">
                    Regimes possíveis
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.regime}</p>
                  <h3 className="mt-3 font-display text-sm font-semibold text-primary">
                    Tributos
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.tributos}</p>
                  <h3 className="mt-3 font-display text-sm font-semibold text-primary">
                    Principais obrigações
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.obrig}</p>
                </Card>
              ))}
            </div>

            {/* Tabela resumo */}
            <div className="mt-12 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Porte</th>
                    <th className="px-4 py-3 text-left">Faturamento anual</th>
                    <th className="px-4 py-3 text-left">Funcionários</th>
                    <th className="px-4 py-3 text-left">Regime</th>
                  </tr>
                </thead>
                <tbody>
                  {comparativo.map((c, i) => (
                    <tr key={c.porte} className={i % 2 ? "bg-muted/40" : ""}>
                      <td className="px-4 py-3 font-semibold text-primary">{c.porte}</td>
                      <td className="px-4 py-3">{c.fat}</td>
                      <td className="px-4 py-3">{c.func}</td>
                      <td className="px-4 py-3">{c.regime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Quando mudar */}
        <section className="bg-gradient-soft py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Quando mudar
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-primary md:text-4xl">
                Quando é hora de mudar de porte ou regime?
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {quandoMudar.map((q) => (
                <Card key={q.de} className="p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
                    <ArrowRight className="h-4 w-4" />
                    {q.de}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{q.motivo}</p>
                </Card>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
              <Rocket className="mx-auto h-10 w-10 text-accent" />
              <h3 className="mt-4 font-display text-2xl font-bold text-primary">
                Pronto para abrir, migrar ou desenquadrar?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Nossa equipe orienta sobre o melhor porte, executa toda a
                burocracia e mantém suas obrigações mensais em dia.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <a
                    href={buildWhatsAppUrl(
                      "Olá! Quero falar sobre abertura ou enquadramento da minha empresa (MEI, ME, EPP).",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Falar no WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/#planos">Ver planos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Mei;
