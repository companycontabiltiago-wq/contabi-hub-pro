import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import AdminClientsPanel from "@/components/AdminClientsPanel";

type News = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "tributaria" | "trabalhista" | "previdenciaria";
  published: boolean;
  created_at: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [form, setForm] = useState({
    title: "", summary: "", content: "", category: "tributaria" as News["category"],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = !!roles?.some((r: any) => r.role === "admin");
      setAuthorized(admin);
      if (admin) loadNews();
    })();
  }, [navigate]);

  const loadNews = async () => {
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    setNews((data as News[]) || []);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("news").insert({ ...form, published: true });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Novidade publicada!");
    setForm({ title: "", summary: "", content: "", category: "tributaria" });
    loadNews();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removida");
    loadNews();
  };

  if (authorized === null) return <div className="flex min-h-screen items-center justify-center">Verificando...</div>;
  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Acesso restrito</h1>
        <p className="text-muted-foreground max-w-md">
          Esta área é exclusiva para administradores. Solicite o papel "admin" para gerenciar conteúdos.
        </p>
        <Button onClick={() => navigate("/area-cliente")}>Voltar à área do cliente</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/area-cliente" className="flex items-center gap-2 text-sm font-medium text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <h1 className="font-display font-bold text-primary">Painel Admin</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container space-y-10 py-12">
        <AdminClientsPanel />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Plus className="h-5 w-5 text-accent" /> Nova novidade
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={200} />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={form.category} onValueChange={(v: News["category"]) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tributaria">Reforma Tributária</SelectItem>
                  <SelectItem value="trabalhista">Reforma Trabalhista</SelectItem>
                  <SelectItem value="previdenciaria">Reforma Previdenciária</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="summary">Resumo</Label>
              <Textarea id="summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} rows={2} maxLength={300} />
            </div>
            <div>
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea id="content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} maxLength={5000} />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {saving ? "Publicando..." : "Publicar"}
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="mb-4 font-display text-xl font-bold text-primary">Novidades publicadas ({news.length})</h2>
          <div className="space-y-3">
            {news.map(n => (
              <Card key={n.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2 bg-accent/10 text-accent">{n.category}</Badge>
                    <h3 className="font-semibold text-primary">{n.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{n.summary}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
            {news.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma novidade ainda.</p>}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default Admin;
