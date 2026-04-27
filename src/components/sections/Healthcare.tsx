import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stethoscope, TrendingDown, ShieldCheck, FileCheck, Calculator, HeartPulse, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import medicosImg from "@/assets/medicos-planejamento.jpg";

const advantages = [
  {
    icon: TrendingDown,
    title: "Redução legal de impostos",
    desc: "Análise do melhor regime tributário (PJ, Simples, Lucro Presumido) para pagar menos imposto dentro da lei.",
  },
  {
    icon: ShieldCheck,
    title: "Proteção patrimonial",
    desc: "Estruturação societária que separa o patrimônio pessoal do profissional, reduzindo riscos.",
  },
  {
    icon: FileCheck,
    title: "Conformidade total",
    desc: "Conselhos profissionais, ANS, Receita Federal e prefeituras — tudo em dia, sem dor de cabeça.",
  },
  {
    icon: Calculator,
    title: "Plano de carreira financeiro",
    desc: "Pró-labore, distribuição de lucros e previdência otimizados para aumentar sua renda líquida.",
  },
];

const targets = [
  "Médicos autônomos e PJ",
  "Clínicas e consultórios",
  "Dentistas e odontologistas",
  "Psicólogos e terapeutas",
  "Fisioterapeutas",
  "Nutricionistas",
  "Veterinários",
  "Profissionais da saúde em geral",
];

export const Healthcare = () => {
  const message =
    "Olá! Sou profissional da saúde e quero saber mais sobre o planejamento tributário da Company Contábil.";

  return (
    <section id="medicos" className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
            <div className="relative overflow-hidden rounded-2xl shadow-elegant ring-1 ring-border">
              <img
                src={medicosImg}
                alt="Planejamento tributário e consultoria contábil para médicos e profissionais da saúde"
                width={1280}
                height={960}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl bg-background/90 p-4 backdrop-blur">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Especialistas em Saúde</p>
                  <p className="text-xs text-muted-foreground">Mais de 10 anos atendendo médicos e clínicas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
              <Stethoscope className="h-3.5 w-3.5" />
              Para profissionais da saúde
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-primary md:text-5xl text-balance">
              Planejamento tributário para médicos e profissionais da saúde
            </h2>
            <p className="mt-4 text-muted-foreground">
              Você cuida da saúde dos seus pacientes. Nós cuidamos da saúde financeira e tributária da sua carreira.
              Estruturamos sua atuação como PJ, reduzimos sua carga tributária legalmente e organizamos toda a parte
              contábil da sua clínica ou consultório.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {targets.map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {t}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a href={buildWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com um especialista
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#planos">Ver planos</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Advantages */}
        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-2xl font-bold text-primary md:text-3xl">
              Vantagens de planejar com a Company Contábil
            </h3>
            <p className="mt-3 text-muted-foreground">
              Soluções desenhadas para a realidade de quem trabalha na área da saúde.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {advantages.map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="group p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mb-2 font-display text-lg font-semibold text-primary">{title}</h4>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
