import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, ArrowLeft, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const PjMedico = () => {
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
              PJ Médico: vale a pena abrir uma empresa?
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Entenda quando a Pessoa Jurídica reduz legalmente a carga tributária do médico e
              quais cuidados tomar para não cair em irregularidades.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <Stethoscope className="h-4 w-4 text-accent" />
              Planejamento tributário · Leitura de 6 min
            </div>
          </div>
        </section>

        <article className="py-10 md:py-14">
          <div className="container max-w-3xl space-y-6 text-foreground">
            <h2 className="font-display text-2xl font-bold text-primary">
              Por que abrir um CNPJ como médico?
            </h2>
            <p>
              Quando o médico atua exclusivamente como pessoa física, todo o rendimento entra na
              tabela progressiva do Imposto de Renda, com alíquota que pode chegar a{" "}
              <strong>27,5%</strong>, somada ainda à contribuição previdenciária (Carnê-Leão).
              Já como Pessoa Jurídica, é possível recolher impostos em regimes mais vantajosos
              como Simples Nacional (Anexo III ou V) ou Lucro Presumido.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary">
              Comparativo prático
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Cenário</th>
                    <th className="p-3 text-left">Carga estimada</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">PF (IRPF + INSS)</td>
                    <td className="p-3">27,5% + INSS</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">PJ Simples Nacional (Anexo III)</td>
                    <td className="p-3">~6% a 15,5%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">PJ Lucro Presumido</td>
                    <td className="p-3">~13,33% a 16,33%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="font-display text-2xl font-bold text-primary">
              Quando vale a pena?
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Faturamento mensal acima de R$ 5.000 a R$ 8.000;</li>
              <li>Atendimento em hospitais, clínicas ou plantões via PJ;</li>
              <li>Possibilidade de distribuição de lucros isentos de IR;</li>
              <li>Necessidade de proteção patrimonial e separação de despesas.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary">
              Cuidados importantes
            </h2>
            <p>
              É fundamental escolher o <strong>CNAE correto</strong>, definir um pró-labore
              compatível com o mercado e manter a contabilidade regular. A pejotização sem
              respaldo (sem prestação de serviço efetiva como PJ) pode gerar autuações.
            </p>

            <div className="mt-10 rounded-xl border bg-primary/5 p-6">
              <h3 className="font-display text-xl font-semibold text-primary">
                Quer simular o seu caso?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Nossa equipe pode comparar PF x PJ com seus números reais e indicar o melhor
                regime.
              </p>
              <Button
                asChild
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a
                  href={buildWhatsAppUrl(
                    "Olá! Sou médico e gostaria de simular a abertura de PJ.",
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

export default PjMedico;
