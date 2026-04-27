import { FileText, Wallet, Users, FileSpreadsheet, Landmark, BookCheck, ArrowRight } from "lucide-react";

const clientSteps = [
  {
    n: "1º",
    icon: FileText,
    title: "Você emite suas notas",
    desc: "Realiza suas vendas ou serviços e emite as notas fiscais normalmente.",
  },
  {
    n: "2º",
    icon: Wallet,
    title: "Envia documentos do mês",
    desc: "Encaminha despesas e notas fiscais recebidas durante o mês.",
  },
];

const companySteps = [
  {
    n: "3º",
    icon: Users,
    title: "Processamos as informações",
    desc: "Nossa equipe de contadores especialistas analisa e processa tudo o que foi enviado.",
  },
  {
    n: "4º",
    icon: FileSpreadsheet,
    title: "Apuração de impostos",
    desc: "Elaboramos e enviamos seus impostos, taxas e fechamentos mensais.",
  },
  {
    n: "5º",
    icon: Landmark,
    title: "Obrigações acessórias",
    desc: "Entregamos todas as declarações e obrigações acessórias da sua empresa.",
  },
  {
    n: "6º",
    icon: BookCheck,
    title: "Demonstrativos anuais",
    desc: "Emitimos os demonstrativos contábeis anuais. Sua empresa 100% regular perante o fisco.",
  },
];

export const Process = () => {
  return (
    <section id="processo" className="relative overflow-hidden bg-gradient-hero py-20 text-primary-foreground md:py-28">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-primary-glow blur-[120px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent blur-[120px]" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Como trabalhamos
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance md:text-5xl">
            Processo simples e transparente <span className="text-accent">durante o mês</span>
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Você cuida do seu negócio. A Company Contábil cuida de toda a parte contábil, fiscal e tributária.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start">
          {/* Cliente */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">
              Sua responsabilidade
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {clientSteps.map(({ n, icon: Icon, title, desc }) => (
                <div
                  key={n}
                  className="group relative rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary-foreground/30 hover:bg-primary-foreground/[0.07]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-display text-4xl font-bold text-primary-foreground/30">
                      {n}
                    </span>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm text-primary-foreground/75">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divisor com seta */}
          <div className="hidden lg:flex h-full items-center justify-center pt-12">
            <div className="flex flex-col items-center gap-2 text-accent">
              <ArrowRight className="h-8 w-8" />
              <span className="rotate-90 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">
                Entrega
              </span>
            </div>
          </div>
        </div>

        {/* Empresa */}
        <div className="mt-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            Company Contábil cuida por você
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companySteps.map(({ n, icon: Icon, title, desc }) => (
              <div
                key={n}
                className="group relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 to-accent/5 p-6 transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-4xl font-bold text-accent/70">{n}</span>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-primary-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-primary-foreground/75">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
