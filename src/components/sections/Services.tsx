import { Card } from "@/components/ui/card";
import { Calculator, FileSpreadsheet, Users, Briefcase, ShieldCheck, TrendingUp } from "lucide-react";

const services = [
  { icon: Calculator, title: "Contabilidade Geral", desc: "Escrituração contábil, balancetes e demonstrações financeiras." },
  { icon: FileSpreadsheet, title: "Fiscal & Tributário", desc: "Apuração de impostos, SPED e planejamento tributário." },
  { icon: Users, title: "Departamento Pessoal", desc: "Folha, eSocial, admissões, demissões e holerites online." },
  { icon: Briefcase, title: "Abertura de Empresa", desc: "Constituição, alterações e regularização de CNPJ." },
  { icon: ShieldCheck, title: "Consultoria Tributária", desc: "Análise da Reforma Tributária e simulações de impacto." },
  { icon: TrendingUp, title: "Gestão Financeira", desc: "Indicadores, fluxo de caixa e BI contábil." },
];

export const Services = () => {
  return (
    <section id="servicos" className="bg-gradient-soft py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">O que fazemos</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl text-balance">
            Soluções contábeis completas para sua empresa
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cuidamos de todos os processos contábeis, fiscais e trabalhistas para você focar no que importa: crescer.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="group p-7 transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-primary">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
