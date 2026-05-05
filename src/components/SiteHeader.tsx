import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import logo from "@/assets/logo-company.jpeg";
import { Menu, X } from "lucide-react";

export const SiteHeader = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const links = [
    { label: "Serviços Gratuitos", href: "#servicos-gratuitos", highlight: true },
    { label: "Serviços", href: "#servicos" },
    { label: "Notícias", href: "#reformas" },
    { label: "Planos", href: "#planos" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="container flex h-20 md:h-24 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Company Contábil">
          <img src={logo} alt="Company Contábil — Consultoria e Gestão de Negócios" className="h-16 w-auto md:h-20 object-contain" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={
                l.highlight
                  ? "inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                  : "text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              }
            >
              {l.highlight && <span aria-hidden>🎁</span>}
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <Button variant="default" onClick={() => navigate("/area-cliente")}>Área do Cliente</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>Entrar</Button>
              <Button onClick={() => navigate("/auth?mode=signup")} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Cadastre-se
              </Button>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium py-2">
                {l.label}
              </a>
            ))}
            {session ? (
              <Button onClick={() => navigate("/area-cliente")}>Área do Cliente</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/auth")} className="flex-1">Entrar</Button>
                <Button onClick={() => navigate("/auth?mode=signup")} className="flex-1 bg-accent text-accent-foreground">Cadastrar</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
