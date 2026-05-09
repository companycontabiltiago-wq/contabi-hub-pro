import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { Briefcase, Building2 } from "lucide-react";
import logo from "@/assets/logo-company.jpeg";

type Profile = "admin" | "client";

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Informe seu nome").max(100),
  company_name: z.string().trim().min(2, "Informe sua empresa").max(150),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});
const signinSchema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

type Mode = "signin" | "signup" | "forgot";

const Auth = () => {
  const [params] = useSearchParams();
  const initial = params.get("mode");
  const [mode, setMode] = useState<Mode>(
    initial === "signup" ? "signup" : initial === "forgot" ? "forgot" : "signin"
  );
  const [profile, setProfile] = useState<Profile | null>(
    (params.get("profile") as Profile) || null
  );
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", company_name: "", email: "", password: "" });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const emailParsed = z.string().trim().email("E-mail inválido").max(255).safeParse(form.email);
        if (!emailParsed.success) {
          toast.error(emailParsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(emailParsed.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Enviamos um link de redefinição para o seu e-mail.");
        setMode("signin");
      } else if (mode === "signup") {
        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/area-cliente`,
            data: { full_name: parsed.data.full_name, company_name: parsed.data.company_name },
          },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already")) toast.error("Este e-mail já está cadastrado.");
          else toast.error(error.message);
          return;
        }
        toast.success("Cadastro realizado! Redirecionando...");
        navigate("/area-cliente", { replace: true });
      } else {
        const parsed = signinSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          toast.error("E-mail ou senha incorretos.");
          return;
        }
        if (profile === "admin") {
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: signInData.user.id,
            _role: "admin",
          });
          if (!isAdmin) {
            await supabase.auth.signOut();
            toast.error("Este usuário não tem acesso à Gestão Contábil.");
            return;
          }
          toast.success("Bem-vindo!");
          navigate("/admin", { replace: true });
        } else {
          toast.success("Bem-vindo!");
          navigate("/area-cliente", { replace: true });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
        <Card className="w-full max-w-2xl p-8 shadow-elegant">
          <Link to="/" className="mb-6 flex items-center justify-center" aria-label="Company Contábil">
            <img src={logo} alt="Company Contábil" className="h-24 w-auto object-contain" />
          </Link>
          <p className="text-center text-sm font-medium text-muted-foreground">Escolha o ambiente:</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => { setProfile("admin"); setMode("signin"); }}
              className="group flex items-center justify-center gap-3 rounded-lg bg-emerald-500 px-6 py-6 text-lg font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-emerald-600 hover:-translate-y-0.5"
            >
              <Briefcase className="h-6 w-6" />
              Gestão Contábil
            </button>
            <button
              onClick={() => { setProfile("client"); setMode("signin"); }}
              className="group flex items-center justify-center gap-3 rounded-lg bg-orange-400 px-6 py-6 text-lg font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-orange-500 hover:-translate-y-0.5"
            >
              <Building2 className="h-6 w-6" />
              Cliente
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <Link to="/" className="mb-6 flex items-center justify-center" aria-label="Company Contábil">
          <img src={logo} alt="Company Contábil — Consultoria e Gestão de Negócios" className="h-32 w-auto object-contain" />
        </Link>

        <div className="mb-4 flex items-center justify-center">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${profile === "admin" ? "bg-emerald-500" : "bg-orange-400"}`}>
            {profile === "admin" ? <Briefcase className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
            {profile === "admin" ? "Gestão Contábil" : "Cliente"}
          </span>
        </div>

        <h1 className="text-center font-display text-2xl font-bold text-primary">
          {mode === "signup" ? "Crie sua conta" : mode === "forgot" ? "Recuperar senha" : "Acesse sua conta"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "signup"
            ? "Tenha acesso à área exclusiva de clientes"
            : mode === "forgot"
            ? "Informe seu e-mail para receber o link de redefinição"
            : profile === "admin"
            ? "Acesso restrito à equipe contábil"
            : "Entre na área do cliente"}
        </p>
        <div className="mt-2 text-center">
          <button type="button" onClick={() => setProfile(null)}
            className="text-xs text-muted-foreground hover:text-accent hover:underline">
            Trocar perfil
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="full_name">Seu nome</Label>
                <Input id="full_name" value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="company_name">Empresa</Label>
                <Input id="company_name" value={form.company_name}
                  onChange={e => setForm({ ...form, company_name: e.target.value })} required />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          {mode !== "forgot" && (
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
          )}

          {mode === "signin" && (
            <div className="text-right">
              <button type="button" onClick={() => setMode("forgot")}
                className="text-sm font-medium text-accent hover:underline">
                Esqueci minha senha
              </button>
            </div>
          )}

          <Button type="submit" disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {loading
              ? "Aguarde..."
              : mode === "signup"
              ? "Criar conta"
              : mode === "forgot"
              ? "Enviar link de redefinição"
              : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "forgot" ? (
            <>
              Lembrou a senha?{" "}
              <button onClick={() => setMode("signin")}
                className="font-semibold text-accent hover:underline">
                Voltar ao login
              </button>
            </>
          ) : mode === "signup" ? (
            <>
              Já tem conta?{" "}
              <button onClick={() => setMode("signin")}
                className="font-semibold text-accent hover:underline">
                Entrar
              </button>
            </>
          ) : profile === "client" ? (
            <>
              Não tem conta?{" "}
              <button onClick={() => setMode("signup")}
                className="font-semibold text-accent hover:underline">
                Cadastre-se
              </button>
            </>
          ) : null}
        </p>
      </Card>
    </div>
  );
};

export default Auth;
