import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Stethoscope, Building2, FileText } from "lucide-react";

const artigos = [
  {
    icon: Stethoscope,
    titulo: "PJ Médico: vale a pena abrir uma empresa?",
    resumo:
      "Entenda como a constituição de uma Pessoa Jurídica pode reduzir significativamente a carga tributária do médico, comparando o IRPF (até 27,5%) com o regime do Simples Nacional ou Lucro Presumido.",
  },
  {
    icon: Building2,
    titulo: "Empresa Inativa: o que fazer?",
    resumo:
      "Mesmo sem faturamento, sua empresa precisa cumprir obrigações acessórias. Saiba como manter a regularidade, evitar multas e decidir entre manter inativa ou encerrar o CNPJ.",
    Icon: Building2,
  },
  {
    icon: FileText,
    titulo: "IRPF para Médicos: deduções e cuidados",
    resumo:
      "Despesas com cursos, equipamentos, livro-caixa e o famoso Carnê-Leão. Conheça as principais deduções permitidas e como evitar cair na malha fina da Receita Federal.",
  },
];

const ContabilidadeMedica = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">
                Contabilidade Médica
              </Badge>
              <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">
                Conteúdo especializado para profissionais da saúde
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Artigos e guias práticos sobre PJ Médico, obrigações de empresas inativas e
                Imposto de Renda para médicos.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artigos.map(({ icon: Icon, titulo, resumo }) => (
                <Card
                  key={titulo}
                  className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-primary to-primary/70">
                    <Icon className="h-16 w-16 text-primary-foreground/90" />
                  </div>
                  <CardContent className="flex flex-1 flex-col p-6">
                    <Badge className="mb-3 w-fit bg-accent text-accent-foreground hover:bg-accent">
                      Contabilidade Médica
                    </Badge>
                    <h2 className="mb-3 font-display text-xl font-semibold text-primary">
                      {titulo}
                    </h2>
                    <p className="mb-6 flex-1 text-sm text-muted-foreground">{resumo}</p>
                    <Button variant="link" className="w-fit p-0 text-accent hover:text-accent/80">
                      Leia a matéria completa
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link to="/">← Voltar para a Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ContabilidadeMedica;
