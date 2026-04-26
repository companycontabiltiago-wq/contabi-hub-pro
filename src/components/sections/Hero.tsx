import { Button } from "@/components/ui/button";
import { ShieldCheck, Repeat, Phone } from "lucide-react";
import heroImage from "@/assets/escritorio-moderno.jpg";
import { openWhatsApp, buildWhatsAppUrl } from "@/lib/whatsapp";

export const Hero = () => {
  const waUrl = buildWhatsAppUrl();
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-accent blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-primary-glow blur-[120px]" />
      </div>

      <div className="container relative grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
            <ShieldCheck className="h-3.5 w-3.5" /> Contabilidade Consultiva
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-balance md:text-6xl">
            Reduzimos seus impostos de <span className="text-accent">forma Legal</span>.
          </h1>
          <p className="mt-4 font-display text-xl font-semibold text-primary-foreground/90 md:text-2xl">
            Contabilidade que usa a legislação ao seu favor.
          </p>
          <p className="mt-6 max-w-lg text-lg text-primary-foreground/85">
            Contabilidade estratégica, suporte humano e tecnologia para você crescer com segurança fiscal,
            trabalhista e previdenciária.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openWhatsApp(); }}
              >
                <Repeat className="mr-2 h-4 w-4" /> Trocar de contabilidade
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.preventDefault(); openWhatsApp(); }}
              >
                <Phone className="mr-2 h-4 w-4" /> Fale com um contador
              </a>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6">
            <div>
              <p className="font-display text-2xl font-bold text-accent">+500</p>
              <p className="text-xs text-primary-foreground/70">empresas atendidas</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-accent">15 anos</p>
              <p className="text-xs text-primary-foreground/70">de experiência</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-accent">100%</p>
              <p className="text-xs text-primary-foreground/70">digital</p>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in-right">
          <div className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" />
          <img
            src={heroImage}
            alt="Escritório moderno da Company Contábil em Fortaleza"
            width={1280}
            height={1280}
            className="relative w-full rounded-3xl shadow-elegant"
          />
        </div>
      </div>
    </section>
  );
};
