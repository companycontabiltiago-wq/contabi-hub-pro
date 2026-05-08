import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  LogOut,
  Settings,
  ShieldCheck,
  Menu,
  Building2,
  ChevronLeft,
  Folder,
  FileText,
  Download,
  Trash2,
  Upload,
  Loader2,
  Search,
  ArrowLeft,
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  ClipboardList,
  MessageSquare,
  AlertCircle,
  UserPlus,
  Plane,
  UserMinus,
  Boxes,
  HardHat,
  Mail,
  Users,
  History,
  FileBadge,
  PlaySquare,
} from "lucide-react";
import logo from "@/assets/logo-company.jpeg";

type Category =
  | "contabil"
  | "fiscal"
  | "folha"
  | "societario"
  | "financeiro"
  | "extras"
  | "outros";

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

type Profile = { full_name: string | null; company_name: string | null };

const FOLDERS: { key: Category; label: string }[] = [
  { key: "contabil", label: "Contábil" },
  { key: "fiscal", label: "Fiscal" },
  { key: "folha", label: "Pessoal" },
  { key: "societario", label: "Societário" },
  { key: "financeiro", label: "Financeiro" },
  { key: "extras", label: "Extras" },
  { key: "outros", label: "Outros" },
];

const SIDEBAR_ITEMS = [
  { key: "empresa", label: "Minha Empresa", icon: LayoutDashboard },
  { key: "arquivos", label: "Arquivos", icon: FolderOpen },
  { key: "contabeis", label: "Arquivos Contábeis", icon: BookOpen },
  { key: "protocolos", label: "Protocolos", icon: ClipboardList },
  { key: "solicitacoes", label: "Solicitações", icon: MessageSquare },
  { key: "ocorrencias", label: "Ocorrências da Folha", icon: AlertCircle },
  { key: "admissoes", label: "Admissões", icon: UserPlus },
  { key: "ferias", label: "Férias", icon: Plane },
  { key: "rescisoes", label: "Rescisões", icon: UserMinus },
  { key: "inventarios", label: "Inventários", icon: Boxes },
  { key: "sst", label: "SST", icon: HardHat },
  { key: "convites", label: "Convites", icon: Mail },
  { key: "usuarios", label: "Usuários", icon: Users },
  { key: "auditoria", label: "Auditoria", icon: History },
  { key: "certidoes", label: "Certidões", icon: FileBadge },
  { key: "central", label: "Central de Conteúdos", icon: PlaySquare },
] as const;

type SidebarKey = (typeof SIDEBAR_ITEMS)[number]["key"];

const formatSize = (bytes: number | null) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ClientArea = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [active, setActive] = useState<SidebarKey>("arquivos");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openFolder, setOpenFolder] = useState<Category | null>(null);

  const [docs, setDocs] = useState<Doc[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<Category>("contabil");
  const fileRef = useRef<HTMLInputElement | null>(null);

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
      const [{ data: p }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("full_name, company_name").eq("id", session.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
      ]);
      setProfile(p);
      setEmail(session.user.email || "");
      setIsAdmin(!!roles?.some((x: any) => x.role === "admin"));
      setUserId(session.user.id);
      setLoading(false);
    })();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDocs = async (uid: string) => {
    setDocsLoading(true);
    const { data, error } = await supabase
      .from("client_documents")
      .select("*")
      .eq("owner_id", uid)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setDocs((data as Doc[]) || []);
    setDocsLoading(false);
  };

  useEffect(() => {
    if (userId) loadDocs(userId);
  }, [userId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada");
    navigate("/");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Arquivo excede 20 MB");
      return;
    }
    const cat = openFolder || uploadCategory;
    setUploading(true);
    const path = `${userId}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
    const { error: upErr } = await supabase.storage
      .from("client-documents")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      setUploading(false);
      toast.error(upErr.message);
      return;
    }
    const { error: insErr } = await supabase.from("client_documents").insert({
      owner_id: userId,
      uploaded_by: userId,
      category: cat,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      mime_type: file.type,
    });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (insErr) {
      await supabase.storage.from("client-documents").remove([path]);
      toast.error(insErr.message);
      return;
    }
    toast.success("Arquivo enviado!");
    loadDocs(userId);
  };

  const handleDownload = async (doc: Doc) => {
    const { data, error } = await supabase.storage
      .from("client-documents")
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
    if (userId) loadDocs(userId);
  };

  const folderCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of docs) map[d.category] = (map[d.category] || 0) + 1;
    return map;
  }, [docs]);

  const filteredFolderDocs = useMemo(() => {
    if (!openFolder) return [];
    const s = search.trim().toLowerCase();
    return docs
      .filter((d) => d.category === openFolder)
      .filter((d) => !s || d.file_name.toLowerCase().includes(s));
  }, [docs, openFolder, search]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  const companyLine = profile?.company_name || profile?.full_name || "Cliente";

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-0"} sticky top-0 h-screen shrink-0 overflow-hidden border-r border-border bg-background transition-all duration-200`}
      >
        <div className="flex h-20 items-center justify-center border-b border-border p-4">
          <Link to="/" aria-label="Início">
            <img src={logo} alt="Company Contábil" className="h-12 w-auto object-contain" />
          </Link>
        </div>
        <nav className="flex flex-col gap-0.5 p-2 text-sm">
          {SIDEBAR_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActive(key);
                  if (key !== "arquivos") setOpenFolder(null);
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-left transition ${
                  isActive
                    ? "bg-accent/10 font-semibold text-accent"
                    : "text-foreground/80 hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border bg-background">
          <div className="flex h-14 items-center gap-3 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Alternar menu"
              className="bg-accent/10 text-accent hover:bg-accent/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              Cliente
            </Badge>
            <div className="hidden min-w-0 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm md:flex">
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate font-medium text-primary">{companyLine}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                  <Settings className="mr-2 h-4 w-4" /> Admin
                </Button>
              )}
              <span className="hidden text-xs text-muted-foreground md:inline">{email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Page title */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary md:text-3xl">
                {companyLine}
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile?.full_name && profile?.company_name
                  ? profile.full_name
                  : "Bem-vindo à sua área exclusiva"}
                {isAdmin && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    <ShieldCheck className="h-3 w-3" /> Administrador
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Section content */}
          {active === "arquivos" ? (
            <section className="rounded-lg border border-border bg-background">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div className="flex items-center gap-2">
                  {openFolder && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenFolder(null)}
                      className="text-accent"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" /> Pastas
                    </Button>
                  )}
                  <h2 className="font-display text-lg font-semibold text-primary">
                    {openFolder
                      ? FOLDERS.find((f) => f.key === openFolder)?.label
                      : "Arquivos e Pastas"}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {openFolder ? (
                    <>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Pesquisar arquivo..."
                          className="h-9 w-56 pl-9"
                        />
                      </div>
                      <Button
                        size="sm"
                        disabled={uploading}
                        onClick={() => fileRef.current?.click()}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {uploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Enviar arquivo
                      </Button>
                    </>
                  ) : (
                    <>
                      <Select
                        value={uploadCategory}
                        onValueChange={(v: Category) => setUploadCategory(v)}
                      >
                        <SelectTrigger className="h-9 w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FOLDERS.map((f) => (
                            <SelectItem key={f.key} value={f.key}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        disabled={uploading}
                        onClick={() => fileRef.current?.click()}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {uploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Enviar lote de arquivos
                      </Button>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </div>
              </div>

              {!openFolder ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-2 font-medium">Nome</th>
                        <th className="px-4 py-2 font-medium">Itens</th>
                        <th className="hidden px-4 py-2 font-medium md:table-cell">Atualizado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FOLDERS.map((f) => {
                        const count = folderCounts[f.key] || 0;
                        const last = docs.find((d) => d.category === f.key);
                        return (
                          <tr
                            key={f.key}
                            onClick={() => {
                              setOpenFolder(f.key);
                              setSearch("");
                            }}
                            className="cursor-pointer border-b border-border transition hover:bg-muted/40"
                          >
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-2 font-medium text-accent">
                                <Folder className="h-4 w-4" />
                                {f.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{count}</td>
                            <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                              {last ? new Date(last.created_at).toLocaleString("pt-BR") : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : docsLoading ? (
                <p className="p-8 text-center text-sm text-muted-foreground">Carregando...</p>
              ) : filteredFolderDocs.length === 0 ? (
                <div className="p-10 text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum arquivo nesta pasta ainda.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-4 py-2 font-medium">Nome</th>
                        <th className="px-4 py-2 font-medium">Criado em</th>
                        <th className="hidden px-4 py-2 font-medium md:table-cell">Origem</th>
                        <th className="hidden px-4 py-2 font-medium md:table-cell">Tamanho</th>
                        <th className="px-4 py-2 text-right font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFolderDocs.map((d) => (
                        <tr key={d.id} className="border-b border-border hover:bg-muted/40">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2 text-primary">
                              <FileText className="h-4 w-4 text-accent" />
                              <span className="truncate">{d.file_name}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(d.created_at).toLocaleString("pt-BR")}
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            {d.uploaded_by === d.owner_id ? (
                              <Badge variant="outline">Cliente</Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-accent/10 text-accent">
                                Contabilidade
                              </Badge>
                            )}
                          </td>
                          <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                            {formatSize(d.file_size)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDownload(d)}
                              title="Baixar"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(d)}
                              title="Remover"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : (
            <section className="rounded-lg border border-dashed border-border bg-background p-12 text-center">
              <ChevronLeft className="mx-auto mb-3 h-8 w-8 rotate-180 text-muted-foreground" />
              <h3 className="font-display text-lg font-semibold text-primary">
                {SIDEBAR_ITEMS.find((s) => s.key === active)?.label}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Este módulo estará disponível em breve. Por enquanto, utilize a aba{" "}
                <button
                  className="font-medium text-accent underline-offset-2 hover:underline"
                  onClick={() => setActive("arquivos")}
                >
                  Arquivos
                </button>{" "}
                para enviar e receber documentos.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientArea;
