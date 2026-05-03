import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const EmpresaInativa = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container max-w-4xl">
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link to="/contabilidade-medica">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Contabilidade Médica
              </Link>
            </Button>
            <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">
              Contabilidade Médica
            </Badge>
            <h1 className="font-display text-3xl font-bold text-primary md:text-5xl">
              Empresa Inativa: o que fazer?
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Mesmo sem faturamento, sua empresa precisa cumprir obrigações para evitar multas
              e bloqueios no CNPJ.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-accent" />
              Obrigações acessórias · Leitura de 5 min
            </div>
          </div>
        </section>

        <article className="py-10 md:py-14">
          <div className="container max-w-3xl space-y-6 text-foreground">
            <h2 className="font-display text-2xl font-bold text-primary">
              O que é uma empresa inativa?
            </h2>
            <p>
              É a empresa que <strong>não realizou nenhuma operação</strong> (compra, venda,
              prestação de serviço, aplicação financeira ou movimentação patrimonial) durante
              o ano-calendário. Atenção: empresa <em>sem lucro</em> não é o mesmo que empresa
              inativa.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary">
              Obrigações da empresa inativa
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>DCTFWeb sem movimento</strong> – informar à Receita Federal a ausência
                de débitos;
              </li>
              <li>
                <strong>ECD/ECF (Lucro Presumido/Real)</strong> – mesmo zeradas, devem ser
                entregues;
              </li>
              <li>
                <strong>DEFIS sem movimento (Simples Nacional)</strong> – obrigatória todo ano;
              </li>
              <li>
                <strong>eSocial e EFD-Reinf</strong> – evento "S-1000" e fechamentos sem
                movimento;
              </li>
              <li>Manter alvará, inscrição estadual/municipal e Junta Comercial regulares.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary">
              Manter inativa ou encerrar?
            </h2>
            <p>
              Manter o CNPJ aberto gera custos de honorários, taxas e risco de multas se algo
              for esquecido. Se não há previsão de retomada nos próximos 12 meses,{" "}
              <strong>baixar a empresa</strong> costuma ser mais econômico. Se há intenção de
              voltar, mantenha tudo em dia.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary">
              Riscos de não declarar
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Multa mínima de R$ 200 por declaração não entregue;</li>
              <li>CNPJ pode ser declarado <strong>inapto</strong> pela Receita;</li>
              <li>Bloqueio do CPF dos sócios e restrições bancárias;</li>
              <li>Inscrição em dívida ativa.</li>
            </ul>

            <div className="mt-10 rounded-xl border bg-primary/5 p-6">
              <h3 className="font-display text-xl font-semibold text-primary">
                Tem uma empresa parada?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Avaliamos sua situação e indicamos o melhor caminho: regularizar, manter
                inativa ou encerrar com segurança.
              </p>
              <Button
                asChild
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a
                  href={buildWhatsAppUrl(
                    "Olá! Tenho uma empresa inativa e preciso de orientação.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Falar com especialista
                </a>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
};

export default EmpresaInativa;
