import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, Download, Trash2, Loader2 } from "lucide-react";

type Category = "fiscal" | "folha" | "contabil" | "societario" | "outros";

const CATEGORY_LABELS: Record<Category, string> = {
  fiscal: "Fiscal",
  folha: "Folha de Pagamento",
  contabil: "Contábil",
  societario: "Societário",
  outros: "Outros",
};

type Doc = {
  id: string;
  owner_id: string;
  uploaded_by: string;
  category: Category;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
};

const formatSize = (bytes: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface Props { userId: string; isAdmin?: boolean }

const ClientDocuments = ({ userId, isAdmin }: Props) => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<Category>("fiscal");
  const [filter, setFilter] = useState<Category | "all">("all");

  const load = async () => {
    setLoading(true);
    const q = supabase.from("client_documents").select("*").order("created_at", { ascending: false });
    const { data, error } = isAdmin ? await q : await q.eq("owner_id", userId);
    if (error) toast.error(error.message);
    setDocs((data as Doc[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [userId, isAdmin]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Arquivo excede 20 MB");
      return;
    }
    setUploading(true);
    const path = `${userId}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("client-documents").upload(path, file, {
      contentType: file.type, upsert: false,
    });
    if (upErr) {
      setUploading(false);
      toast.error(upErr.message);
      return;
    }
    const { error: insErr } = await supabase.from("client_documents").insert({
      owner_id: userId, uploaded_by: userId, category,
      file_name: file.name, file_path: path, file_size: file.size, mime_type: file.type,
    });
    setUploading(false);
    e.target.value = "";
    if (insErr) {
      await supabase.storage.from("client-documents").remove([path]);
      toast.error(insErr.message);
      return;
    }
    toast.success("Documento enviado!");
    load();
  };

  const handleDownload = async (doc: Doc) => {
    const { data, error } = await supabase.storage.from("client-documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data) return toast.error("Não foi possível gerar o link");
    window.open(data.signedUrl, "_blank");
  };

  const handleDelete = async (doc: Doc) => {
    if (!confirm(`Remover "${doc.file_name}"?`)) return;
    await supabase.storage.from("client-documents").remove([doc.file_path]);
    const { error } = await supabase.from("client_documents").delete().eq("id", doc.id);
    if (error) return toast.error(error.message);
    toast.success("Removido");
    load();
  };

  const filtered = filter === "all" ? docs : docs.filter(d => d.category === filter);

  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-primary">Documentos</h2>
          <p className="text-sm text-muted-foreground">
            Envie e baixe documentos com sua contabilidade. Arquivos privados (até 20 MB).
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label className="text-xs">Categoria do envio</Label>
            <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABELS) as Category[]).map(k => (
                  <SelectItem key={k} value={k}>{CATEGORY_LABELS[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild disabled={uploading} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <label className="cursor-pointer">
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {uploading ? "Enviando..." : "Enviar arquivo"}
              <Input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          Todos ({docs.length})
        </Button>
        {(Object.keys(CATEGORY_LABELS) as Category[]).map(k => (
          <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)}>
            {CATEGORY_LABELS[k]}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum documento nesta categoria.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/40">
              <FileText className="h-5 w-5 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-primary">{doc.file_name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="bg-accent/10 text-accent">{CATEGORY_LABELS[doc.category]}</Badge>
                  <span>{formatSize(doc.file_size)}</span>
                  <span>•</span>
                  <span>{new Date(doc.created_at).toLocaleDateString("pt-BR")}</span>
                  {isAdmin && doc.uploaded_by !== doc.owner_id && (
                    <Badge variant="outline">enviado pela contabilidade</Badge>
                  )}
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleDownload(doc)} title="Baixar">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(doc)} title="Remover">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ClientDocuments;
