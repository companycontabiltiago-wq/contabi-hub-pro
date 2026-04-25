import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Repeat, Phone } from "lucide-react";

export const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center shadow-elegant md:p-16">
          <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl text-balance">
              Pronto para ter uma contabilidade que entende seu negócio?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Migre para a Company Contábil em poucos minutos. Cuidamos de toda a transição.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
                <a href="https://wa.me/5585999154055?text=Como%20podemos%20ajudar%20voc%C3%AA%20hoje%3F" target="_blank" rel="noopener noreferrer">
                  <Repeat className="mr-2 h-4 w-4" /> Trocar de contabilidade
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/5585999154055?text=Como%20podemos%20ajudar%20voc%C3%AA%20hoje%3F" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" /> Fale com um contador
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
