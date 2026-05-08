import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  Users,
  ChevronDown,
  ChevronRight,
  FileText,
  Download,
  Search,
  Building2,
  Calendar,
} from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  created_at: string;
};

type Doc = {
  id: string;
  owner_id: string;
  uploaded_by: string;
  category: "fiscal" | "folha" | "contabil" | "societario" | "outros";
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
};

const CATEGORY_LABELS: Record<Doc["category"], string> = {
  fiscal: "Fiscal",
  folha: "Folha",
  contabil: "Contábil",
  societario: "Societário",
  outros: "Outros",
};

const formatSize = (bytes: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const AdminClientsPanel = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: p, error: pe }, { data: d, error: de }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, company_name, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("client_documents")
        .select("id, owner_id, uploaded_by, category, file_name, file_path, file_size, created_at")
        .order("created_at", { ascending: false }),
    ]);
    if (pe) toast.error(pe.message);
    if (de) toast.error(de.message);
    setProfiles((p as Profile[]) || []);
    setDocs((d as Doc[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const docsByOwner = useMemo(() => {
    const map: Record<string, Doc[]> = {};
    for (const doc of docs) {
      (map[doc.owner_id] ||= []).push(doc);
    }
    return map;
  }, [docs]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return profiles;
    return profiles.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(s) ||
        p.company_name?.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s)
    );
  }, [profiles, search]);

  const handleDownload = async (doc: Doc) => {
    const { data, error } = await supabase.storage
      .from("client-documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data) return toast.error("Não foi possível gerar o link");
    window.open(data.signedUrl, "_blank");
  };

  const totalDocs = docs.length;
  const totalClients = profiles.length;

  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Users className="h-5 w-5 text-accent" /> Clientes & Documentos
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalClients} cliente(s) cadastrado(s) · {totalDocs} documento(s) recebido(s)
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou empresa..."
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Carregando...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const list = docsByOwner[p.id] || [];
            const isOpen = openId === p.id;
            return (
              <Collapsible
                key={p.id}
                open={isOpen}
                onOpenChange={(o) => setOpenId(o ? p.id : null)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-3 text-left transition hover:bg-muted/40"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-primary">
                          {p.full_name || "(sem nome)"}
                        </p>
                        {p.company_name && (
                          <span className="hidden items-center gap-1 truncate text-xs text-muted-foreground sm:inline-flex">
                            <Building2 className="h-3 w-3" />
                            {p.company_name}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Cadastro: {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-[10px] opacity-70">
                          {p.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        list.length > 0
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {list.length} doc(s)
                    </Badge>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3 pt-2">
                  {list.length === 0 ? (
                    <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Este cliente ainda não enviou documentos.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {list.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-2.5"
                        >
                          <FileText className="h-4 w-4 shrink-0 text-accent" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-primary">
                              {doc.file_name}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Badge
                                variant="secondary"
                                className="bg-accent/10 text-accent"
                              >
                                {CATEGORY_LABELS[doc.category]}
                              </Badge>
                              <span>{formatSize(doc.file_size)}</span>
                              <span>·</span>
                              <span>
                                {new Date(doc.created_at).toLocaleString("pt-BR")}
                              </span>
                              {doc.uploaded_by !== doc.owner_id && (
                                <Badge variant="outline">enviado pela contabilidade</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownload(doc)}
                            title="Baixar"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default AdminClientsPanel;
