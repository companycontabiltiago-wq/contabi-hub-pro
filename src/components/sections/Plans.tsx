import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { PlanContractDialog } from "@/components/PlanContractDialog";

const plans = [
  {
    name: "Essencial",
    price: "299",
    desc: "Ideal para MEI e pequenas empresas no Simples Nacional.",
    features: [
      "Escrituração fiscal",
      "Apuração mensal de impostos",
      "Folha para até 3 funcionários",
      "Atendimento por WhatsApp",
      "Portal do cliente",
    ],
    highlight: false,
  },
  {
    name: "Profissional",
    price: "599",
    desc: "Para empresas em crescimento que precisam de consultoria.",
    features: [
      "Tudo do plano Essencial",
      "Folha para até 15 funcionários",
      "Consultoria tributária mensal",
      "Simulações da Reforma Tributária",
      "Relatórios gerenciais",
      "Atendimento prioritário",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "1.299",
    desc: "Para médias empresas que exigem alta complexidade.",
    features: [
      "Tudo do plano Profissional",
      "Folha ilimitada",
      "Planejamento tributário anual",
      "BI contábil personalizado",
      "Contador dedicado",
      "Visitas presenciais",
    ],
    highlight: false,
  },
];

export const Plans = () => {
  const navigate = useNavigate();
  return (
    <section id="planos" className="bg-gradient-soft py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Planos</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl text-balance">
            Escolha o plano ideal para sua empresa
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sem letras miúdas. Sem surpresas. Cancele quando quiser.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map(plan => (
            <Card
              key={plan.name}
              className={`relative flex flex-col p-8 transition-all hover:-translate-y-1 ${
                plan.highlight ? "border-2 border-accent shadow-elegant scale-100 md:scale-105" : "shadow-card"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-glow">
                  <Sparkles className="h-3 w-3" /> Mais popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-primary">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className="font-display text-5xl font-bold text-primary">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate("/auth?mode=signup")}
                className={`mt-8 w-full ${plan.highlight ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
              >
                Contratar agora
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
