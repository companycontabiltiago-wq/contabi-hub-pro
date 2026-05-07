import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import logo from "@/assets/logo-company.jpeg";

const schema = z
  .object({
    password: z.string().min(6, "Mínimo 6 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "As senhas não coincidem", path: ["confirm"] });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Senha atualizada com sucesso!");
      navigate("/area-cliente", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <Link to="/" className="mb-6 flex items-center justify-center" aria-label="Company Contábil">
          <img src={logo} alt="Company Contábil" className="h-32 w-auto object-contain" />
        </Link>
        <h1 className="text-center font-display text-2xl font-bold text-primary">Definir nova senha</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {ready ? "Crie uma nova senha para acessar sua conta" : "Validando link de redefinição..."}
        </p>

        {ready && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="password">Nova senha</Label>
              <Input id="password" type="password" value={form.password} minLength={6} required
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="confirm">Confirmar senha</Label>
              <Input id="confirm" type="password" value={form.confirm} minLength={6} required
                onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? "Salvando..." : "Atualizar senha"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/auth" className="font-semibold text-accent hover:underline">Voltar ao login</Link>
        </p>
      </Card>
    </div>
  );
};

export default ResetPassword;
