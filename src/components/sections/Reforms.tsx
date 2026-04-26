import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, ArrowRight } from "lucide-react";

type News = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "tributaria" | "trabalhista" | "previdenciaria";
  created_at: string;
};

const labels = {
  tributaria: "Reforma Tributária",
  trabalhista: "Reforma Trabalhista",
  previdenciaria: "Reforma Previdenciária",
} as const;

// Renderiza markdown simples (#, ##, ###, **bold**, *italic*, listas e parágrafos)
const renderMarkdown = (text: string) => {
  const lines = text.split("\n");
  const blocks: JSX.Element[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const inline = (s: string) => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = s;
    let key = 0;
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/;
    while (true) {
      const m = remaining.match(regex);
      if (!m) { parts.push(remaining); break; }
      const idx = m.index ?? 0;
      if (idx > 0) parts.push(remaining.slice(0, idx));
      if (m[1]) parts.push(<strong key={key++} className="font-semibold text-primary">{m[1]}</strong>);
      else if (m[2]) parts.push(<em key={key++}>{m[2]}</em>);
      remaining = remaining.slice(idx + m[0].length);
    }
    return parts;
  };

  const flushList = () => {
    if (!listType || listBuffer.length === 0) return;
    const Tag = listType;
    blocks.push(
      <Tag key={`list-${blocks.length}`} className={`my-3 ${listType === "ul" ? "list-disc" : "list-decimal"} space-y-1.5 pl-6 text-sm text-foreground/85`}>
        {listBuffer.map((li, i) => <li key={i}>{inline(li)}</li>)}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (!line.trim()) { flushList(); return; }
    if (line.startsWith("### ")) {
      flushList();
      blocks.push(<h4 key={i} className="mt-5 font-display text-base font-semibold text-primary">{inline(line.slice(4))}</h4>);
    } else if (line.startsWith("## ")) {
      flushList();
      blocks.push(<h3 key={i} className="mt-6 font-display text-xl font-bold text-primary">{inline(line.slice(3))}</h3>);
    } else if (line.startsWith("# ")) {
      flushList();
      blocks.push(<h2 key={i} className="mt-6 font-display text-2xl font-bold text-primary">{inline(line.slice(2))}</h2>);
    } else if (/^\s*[-*]\s+/.test(line)) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ""));
    } else if (/^\s*\d+\.\s+/.test(line)) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(line.replace(/^\s*\d+\.\s+/, ""));
    } else {
      flushList();
      blocks.push(<p key={i} className="my-2 text-sm leading-relaxed text-foreground/85">{inline(line)}</p>);
    }
  });
  flushList();
  return blocks;
};

const NewsCard = ({ item, onOpen }: { item: News; onOpen: (n: News) => void }) => (
  <Card className="group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
    <Badge variant="secondary" className="w-fit bg-accent/10 text-accent hover:bg-accent/20">
      {labels[item.category]}
    </Badge>
    <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-primary">{item.title}</h3>
    <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.summary}</p>
    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {new Date(item.created_at).toLocaleDateString("pt-BR")}
      </span>
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="flex items-center gap-1 font-medium text-accent transition-colors hover:text-accent/80"
      >
        Ler mais <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  </Card>
);

export const Reforms = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<News | null>(null);

  useEffect(() => {
    supabase.from("news")
      .select("id,title,summary,content,category,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNews((data as News[]) || []);
        setLoading(false);
      });
  }, []);

  const filter = (cat: News["category"]) => news.filter(n => n.category === cat);

  return (
    <section id="reformas" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Atualizações</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl text-balance">
            Tudo sobre as Reformas em um só lugar
          </h2>
          <p className="mt-4 text-muted-foreground">
            Acompanhe as principais mudanças tributárias, trabalhistas e previdenciárias que impactam seu negócio.
          </p>
        </div>

        <Tabs defaultValue="tributaria" className="mt-12">
          <TabsList className="mx-auto grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="tributaria">Tributária</TabsTrigger>
            <TabsTrigger value="trabalhista">Trabalhista</TabsTrigger>
            <TabsTrigger value="previdenciaria">Previdenciária</TabsTrigger>
          </TabsList>

          {(["tributaria", "trabalhista", "previdenciaria"] as const).map(cat => (
            <TabsContent key={cat} value={cat} className="mt-8">
              {loading ? (
                <p className="text-center text-muted-foreground">Carregando...</p>
              ) : filter(cat).length === 0 ? (
                <p className="text-center text-muted-foreground">Em breve novidades.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filter(cat).map(item => (
                    <NewsCard key={item.id} item={item} onOpen={setSelected} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <Badge variant="secondary" className="w-fit bg-accent/10 text-accent hover:bg-accent/20">
                  {labels[selected.category]}
                </Badge>
                <DialogTitle className="font-display text-2xl text-primary">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(selected.created_at).toLocaleDateString("pt-BR")}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <p className="text-sm font-medium text-foreground/90">{selected.summary}</p>
                <div className="mt-2">{renderMarkdown(selected.content || "")}</div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
