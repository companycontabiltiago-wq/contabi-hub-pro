import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, ArrowRight } from "lucide-react";

type News = {
  id: string;
  title: string;
  summary: string;
  category: "tributaria" | "trabalhista" | "previdenciaria";
  created_at: string;
};

const labels = {
  tributaria: "Reforma Tributária",
  trabalhista: "Reforma Trabalhista",
  previdenciaria: "Reforma Previdenciária",
} as const;

export const Reforms = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("news")
      .select("id,title,summary,category,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNews((data as News[]) || []);
        setLoading(false);
      });
  }, []);

  const filter = (cat: News["category"]) => news.filter(n => n.category === cat);

  const NewsCard = ({ item }: { item: News }) => (
    <Card className="group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
      <Badge variant="secondary" className="w-fit bg-accent/10 text-accent hover:bg-accent/20">{labels[item.category]}</Badge>
      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-primary">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.summary}</p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />
          {new Date(item.created_at).toLocaleDateString("pt-BR")}
        </span>
        <span className="flex items-center gap-1 font-medium text-accent">Ler mais <ArrowRight className="h-3 w-3" /></span>
      </div>
    </Card>
  );

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
                  {filter(cat).map(item => <NewsCard key={item.id} item={item} />)}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
