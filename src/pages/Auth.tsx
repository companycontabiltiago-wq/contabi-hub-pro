import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import logo from "@/assets/logo-company.jpeg";

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
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", company_name: "", email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/area-cliente", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
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
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          toast.error("E-mail ou senha incorretos.");
          return;
        }
        toast.success("Bem-vindo!");
        navigate("/area-cliente", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <Link to="/" className="mb-6 flex items-center justify-center" aria-label="Company Contábil">
          <img src={logo} alt="Company Contábil — Consultoria e Gestão de Negócios" className="h-32 w-auto object-contain" />
        </Link>

        <h1 className="text-center font-display text-2xl font-bold text-primary">
          {mode === "signup" ? "Crie sua conta" : "Acesse sua conta"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Tenha acesso à área exclusiva de clientes" : "Entre na área do cliente"}
        </p>

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
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>

          <Button type="submit" disabled={loading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {loading ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="font-semibold text-accent hover:underline">
            {mode === "signup" ? "Entrar" : "Cadastre-se"}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Auth;
