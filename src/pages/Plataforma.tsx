import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Building2, ArrowLeft, ShieldCheck, FileText, Users, Wallet, TrendingUp, Clock, CheckCircle2, Sparkles } from "lucide-react";
import logo from "@/assets/logo-company-transparent.png";
import { openWhatsApp, buildWhatsAppUrl } from "@/lib/whatsapp";

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

        {/* Sistema de Gestão Financeira e RH gratuito */}
        <section className="mt-16 w-full max-w-4xl rounded-2xl border border-primary/15 bg-card p-8 shadow-elegant md:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Gratuito para clientes Company
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-primary md:text-3xl">
            Sistema de Gestão Financeira e RH — sem custo adicional
          </h2>
          <p className="mt-3 text-muted-foreground">
            Desenvolvido pela Company Contábil para os nossos clientes. Empresa organizada é empresa
            lucrativa: quando o financeiro e o departamento pessoal estão sob controle, você paga
            menos imposto de forma legal, evita multas trabalhistas e toma decisões com números reais
            — não com achismo.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary">Gestão Financeira</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Contas a pagar e a receber com alertas de vencimento</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Fluxo de caixa diário e projeção dos próximos meses</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Separação entre despesas da empresa e do sócio</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Relatórios de faturamento para acompanhar o limite do regime</li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/60 p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary">Recursos Humanos (RH)</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Cadastro de colaboradores e documentos em um só lugar</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Controle de férias, admissões e desligamentos</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Custo real por funcionário, incluindo encargos e provisões</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Holerites e informações trabalhistas sempre acessíveis</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gradient-soft p-5">
              <TrendingUp className="h-5 w-5 text-accent" />
              <p className="mt-2 text-sm font-semibold text-primary">Decisões com dados</p>
              <p className="mt-1 text-xs text-muted-foreground">Saiba se o mês fechou no lucro antes do contador te avisar.</p>
            </div>
            <div className="rounded-xl bg-gradient-soft p-5">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <p className="mt-2 text-sm font-semibold text-primary">Menos risco</p>
              <p className="mt-1 text-xs text-muted-foreground">Prazos trabalhistas e fiscais controlados, sem multas por esquecimento.</p>
            </div>
            <div className="rounded-xl bg-gradient-soft p-5">
              <Clock className="h-5 w-5 text-accent" />
              <p className="mt-2 text-sm font-semibold text-primary">Mais tempo</p>
              <p className="mt-1 text-xs text-muted-foreground">Fim das planilhas soltas: tudo integrado com a sua contabilidade.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/auth?profile=client&mode=signup")}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90"
            >
              Quero acessar gratuitamente
            </button>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.preventDefault(); openWhatsApp(); }}
              className="inline-flex items-center justify-center rounded-lg border border-primary/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition hover:bg-primary/5"
            >
              Falar com um contador
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Plataforma;
