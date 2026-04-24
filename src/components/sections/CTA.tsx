import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
            <Button size="lg" onClick={() => navigate("/auth?mode=signup")}
              className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
              Falar com um especialista <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
