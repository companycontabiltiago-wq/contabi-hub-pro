import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRightLeft, Building2 } from "lucide-react";
import { openWhatsApp, buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };

const faqsMigrar: FaqItem[] = [
  {
    q: "Como a Company Contábil atende os seus clientes?",
    a: "Atendemos de forma 100% digital, com contador dedicado, área exclusiva do cliente, WhatsApp direto e envio de documentos online. Você não precisa se deslocar até o escritório.",
  },
  {
    q: "Por que escolher uma contabilidade digital?",
    a: "Mais agilidade, transparência nas obrigações, redução de custos com deslocamento e acesso aos seus relatórios contábeis a qualquer hora pela área do cliente.",
  },
  {
    q: "Como funciona a troca da minha contabilidade atual?",
    a: "Cuidamos de toda a transição: solicitamos a documentação ao contador anterior, realizamos a migração dos dados e regularizamos pendências, sem que você precise se preocupar.",
  },
  {
    q: "Vou ter problemas com o fisco ao trocar de contador?",
    a: "Não. Fazemos um diagnóstico completo da sua empresa antes da migração, identificamos pendências e regularizamos tudo para que você fique em dia com a Receita Federal e órgãos estaduais e municipais.",
  },
  {
    q: "O cliente tem área exclusiva?",
    a: "Sim. Você acessa sua área do cliente para baixar guias, relatórios, documentos contábeis e acompanhar suas obrigações em tempo real.",
  },
  {
    q: "Atendem empresas do Lucro Presumido e Lucro Real?",
    a: "Sim. Atendemos MEI, Simples Nacional, Lucro Presumido e Lucro Real, em diversos segmentos como comércio, serviços e indústria.",
  },
  {
    q: "Vocês fazem gestão financeira?",
    a: "Oferecemos consultoria contábil e financeira, com análise de relatórios, indicadores de desempenho e orientação para tomada de decisão. A operação financeira do dia a dia (contas a pagar e receber) pode ser contratada como serviço adicional.",
  },
];

const faqsAbrir: FaqItem[] = [
  {
    q: "Quanto custa para abrir uma empresa com a Company Contábil?",
    a: "A abertura de CNPJ é gratuita para clientes que contratam um dos nossos planos mensais. Você paga apenas as taxas obrigatórias dos órgãos públicos, quando houver.",
  },
  {
    q: "Quanto tempo leva para abrir minha empresa?",
    a: "Em média de 5 a 15 dias úteis, dependendo da atividade, do município e das exigências de alvará e vigilância sanitária.",
  },
  {
    q: "Vocês atendem Microempreendedor Individual (MEI)?",
    a: "Sim. Auxiliamos na abertura, regularização e migração do MEI para Microempresa quando o faturamento ultrapassar o limite permitido.",
  },
  {
    q: "Preciso ter endereço comercial para abrir a empresa?",
    a: "Não necessariamente. Para algumas atividades é possível usar endereço residencial ou contratar um endereço fiscal. Avaliamos a melhor opção para o seu caso.",
  },
  {
    q: "Qual regime tributário é melhor para minha empresa?",
    a: "Depende do faturamento, da atividade e da margem de lucro. Fazemos um planejamento tributário gratuito para indicar o regime mais econômico: Simples Nacional, Lucro Presumido ou Lucro Real.",
  },
  {
    q: "Precisarei abrir conta bancária PJ?",
    a: "Sim, é altamente recomendado separar as movimentações da pessoa física e jurídica. Indicamos parceiros bancários com abertura digital e sem tarifas para começar.",
  },
  {
    q: "Quais documentos preciso para abrir a empresa?",
    a: "Documento de identidade, CPF, comprovante de endereço dos sócios e do estabelecimento, e definição da atividade. Nossa equipe envia o checklist completo após o primeiro contato.",
  },
];

type TabKey = "migrar" | "abrir";

export const FAQ = () => {
  const [tab, setTab] = useState<TabKey>("migrar");
  const items = tab === "migrar" ? faqsMigrar : faqsAbrir;
  const waUrl = buildWhatsAppUrl("Olá! Tenho uma dúvida sobre os serviços da Company Contábil.");

  return (
    <section id="faq" className="py-20">
      <div className="container">
        <div className="rounded-3xl border bg-card p-6 shadow-elegant md:p-10">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">
                <span className="text-accent">Dúvidas</span> Frequentes
              </h2>
              <p className="mt-2 text-muted-foreground">
                Clique na sua principal dúvida
              </p>
            </div>

            {/* Tabs */}
            <div className="inline-flex rounded-full border bg-muted/40 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setTab("migrar")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  tab === "migrar"
                    ? "bg-accent text-accent-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ArrowRightLeft className="h-4 w-4" /> Migre sua empresa
              </button>
              <button
                type="button"
                onClick={() => setTab("abrir")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  tab === "abrir"
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Building2 className="h-4 w-4" /> Abra sua empresa
              </button>
            </div>
          </div>

          {/* Accordion */}
          <Accordion
            type="single"
            collapsible
            className="mt-8 space-y-3"
          >
            {items.map((item, i) => (
              <AccordionItem
                key={`${tab}-${i}`}
                value={`item-${i}`}
                className="rounded-xl border bg-background px-4 shadow-sm transition-colors data-[state=open]:border-accent/50 data-[state=open]:bg-accent/5"
              >
                <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline [&[data-state=open]]:text-accent">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-success text-success-foreground hover:bg-success/90 shadow-elegant rounded-full"
            >
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  openWhatsApp("Olá! Tenho uma dúvida sobre os serviços da Company Contábil.");
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chamar no WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
