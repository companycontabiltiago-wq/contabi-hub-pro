import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, ExternalLink, FileText, Receipt, Users, Calendar, Settings, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo-company.jpeg";

type Resource = { id: string; title: string; description: string | null; url: string; icon: string | null };
type Profile = { full_name: string | null; company_name: string | null };

const ICONS: Record<string, any> = { FileText, Receipt, Users, Calendar };

const ClientArea = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      const [{ data: p }, { data: r }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("full_name, company_name").eq("id", session.user.id).maybeSingle(),
        supabase.from("client_resources").select("*").order("created_at"),
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
      ]);
      setProfile(p);
      setResources((r as Resource[]) || []);
      setIsAdmin(!!roles?.some((x: any) => x.role === "admin"));
      setLoading(false);
    })();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate("/");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="border-b border-border bg-background">
        <div className="container flex h-20 md:h-24 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Company Contábil">
            <img src={logo} alt="Company Contábil" className="h-16 w-auto md:h-20 object-contain" />
            <span className="hidden sm:inline font-display font-bold text-primary text-lg">Área do Cliente</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                <Settings className="mr-2 h-4 w-4" /> Admin
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-primary md:text-4xl">
            Olá, {profile?.full_name?.split(" ")[0] || "cliente"} 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            {profile?.company_name ? `Empresa: ${profile.company_name}` : "Bem-vindo à sua área exclusiva"}
          </p>
          {isAdmin && (
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <ShieldCheck className="h-3 w-3" /> Administrador
            </span>
          )}
        </div>

        <h2 className="mb-4 font-display text-xl font-semibold text-primary">Seus produtos e acessos</h2>
        {resources.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">Nenhum recurso disponível ainda.</Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {resources.map(r => {
              const Icon = (r.icon && ICONS[r.icon]) || ExternalLink;
              return (
                <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="group block">
                  <Card className="h-full p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-semibold text-primary">{r.title}</h3>
                    {r.description && <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>}
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent">
                      Acessar <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </Card>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientArea;
