import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Building2, ArrowLeft, ShieldCheck, FileText, Users } from "lucide-react";
import logo from "@/assets/logo-company.jpeg";

const Plataforma = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      navigate(isAdmin ? "/admin" : "/area-cliente", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
          <img src={logo} alt="Company Contábil" className="h-10 w-auto object-contain" />
          <div className="w-28" />
        </div>
      </header>

      <main className="container flex flex-col items-center py-12 md:py-20">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
            Plataforma Company Contábil
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Escolha o ambiente para acessar. Cada perfil tem uma área dedicada de visualização e
            gerenciamento — totalmente separadas para garantir segurança e organização.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          {/* Gestão Contábil */}
          <button
            onClick={() => navigate("/auth?profile=admin")}
            className="group flex flex-col overflow-hidden rounded-2xl border border-primary/20 bg-card text-left shadow-elegant transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex items-center gap-4 bg-primary p-6 text-primary-foreground">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/80">Equipe interna</p>
                <h2 className="font-display text-2xl font-bold">Gestão Contábil</h2>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <p className="text-sm text-muted-foreground">
                Acesso restrito à equipe contábil para gerenciar clientes, documentos recebidos e
                publicar conteúdos.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-foreground/80">
                  <Users className="h-4 w-4 text-primary" /> Gestão de clientes cadastrados
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  <FileText className="h-4 w-4 text-primary" /> Documentos enviados pelos clientes
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Publicação de novidades e avisos
                </li>
              </ul>
              <span className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition group-hover:bg-primary/90">
                Entrar como Contabilidade
              </span>
            </div>
          </button>

          {/* Cliente */}
          <button
            onClick={() => navigate("/auth?profile=client")}
            className="group flex flex-col overflow-hidden rounded-2xl border border-accent/20 bg-card text-left shadow-elegant transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex items-center gap-4 bg-accent p-6 text-accent-foreground">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-foreground/20">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-foreground/80">Sua empresa</p>
                <h2 className="font-display text-2xl font-bold">Cliente</h2>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <p className="text-sm text-muted-foreground">
                Área exclusiva para clientes enviarem e receberem documentos da contabilidade com
                segurança.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-foreground/80">
                  <FileText className="h-4 w-4 text-accent" /> Upload e download de documentos
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  <Users className="h-4 w-4 text-accent" /> Pastas organizadas por categoria
                </li>
                <li className="flex items-center gap-2 text-foreground/80">
                  <ShieldCheck className="h-4 w-4 text-accent" /> Acompanhe o status do envio
                </li>
              </ul>
              <span className="mt-auto inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-bold uppercase tracking-wide text-accent-foreground transition group-hover:bg-accent/90">
                Entrar como Cliente
              </span>
            </div>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Ambientes isolados — credenciais e permissões são validadas pelo servidor a cada acesso.
        </p>
      </main>
    </div>
  );
};

export default Plataforma;
