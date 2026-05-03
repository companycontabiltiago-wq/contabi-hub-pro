import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Stethoscope, Building2, FileText } from "lucide-react";

const artigos = [
  {
    icon: Stethoscope,
    titulo: "PJ Médico: vale a pena abrir uma empresa?",
    resumo:
      "Entenda como a constituição de uma Pessoa Jurídica pode reduzir significativamente a carga tributária do médico, comparando o IRPF (até 27,5%) com o regime do Simples Nacional ou Lucro Presumido.",
    href: "/contabilidade-medica/pj-medico",
  },
  {
    icon: Building2,
    titulo: "Empresa Inativa: o que fazer?",
    resumo:
      "Mesmo sem faturamento, sua empresa precisa cumprir obrigações acessórias. Saiba como manter a regularidade, evitar multas e decidir entre manter inativa ou encerrar o CNPJ.",
    href: "/contabilidade-medica/empresa-inativa",
  },
  {
    icon: FileText,
    titulo: "IRPF para Médicos: deduções e cuidados",
    resumo:
      "Despesas com cursos, equipamentos, livro-caixa e o famoso Carnê-Leão. Conheça as principais deduções permitidas e como evitar cair na malha fina da Receita Federal.",
    href: "/contabilidade-medica/irpf-medicos",
  },
];

const PAGE_TITLE =
  "Contabilidade Médica | PJ Médico, Empresa Inativa e IRPF | Company Contábil";
const PAGE_DESCRIPTION =
  "Contabilidade especializada para médicos: abertura de PJ Médico, obrigações de empresa inativa e declaração de IRPF com deduções e Carnê-Leão. Reduza impostos com segurança.";
const PAGE_KEYWORDS =
  "contabilidade médica, PJ médico, contador para médicos, empresa inativa, IRPF médicos, carnê-leão, livro-caixa, simples nacional médicos";
const PAGE_URL = "https://www.companycontabil.com.br/contabilidade-medica";
const PAGE_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f2645e76-5c82-4a52-800e-776ee84d44df/id-preview-202d2cda--7ef9e1cd-7663-496b-940d-8752a5b04149.lovable.app-1777001883869.png";

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    if (selector.startsWith("link")) {
      el = document.createElement("link");
      (el as HTMLLinkElement).rel = "canonical";
    } else {
      el = document.createElement("meta");
      const match = selector.match(/\[(name|property)="([^"]+)"\]/);
      if (match) el.setAttribute(match[1], match[2]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const ContabilidadeMedica = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    setMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    setMeta('meta[name="keywords"]', "content", PAGE_KEYWORDS);
    setMeta('meta[name="author"]', "content", "Company Contábil");
    setMeta('link[rel="canonical"]', "href", PAGE_URL);

    setMeta('meta[property="og:type"]', "content", "article");
    setMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    setMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    setMeta('meta[property="og:url"]', "content", PAGE_URL);
    setMeta('meta[property="og:image"]', "content", PAGE_IMAGE);
    setMeta('meta[property="og:site_name"]', "content", "Company Contábil");
    setMeta('meta[property="og:locale"]', "content", "pt_BR");

    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    setMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    setMeta('meta[name="twitter:image"]', "content", PAGE_IMAGE);

    const ldId = "ld-contabilidade-medica";
    let ld = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement("script");
      ld.id = ldId;
      ld.type = "application/ld+json";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      inLanguage: "pt-BR",
      publisher: {
        "@type": "Organization",
        name: "Company Contábil",
      },
      hasPart: artigos.map((a) => ({
        "@type": "Article",
        headline: a.titulo,
        description: a.resumo,
        url: `https://www.companycontabil.com.br${a.href}`,
      })),
    });

    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">
                Contabilidade Médica
              </Badge>
              <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">
                Conteúdo especializado para profissionais da saúde
              </h1>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Artigos e guias práticos sobre PJ Médico, obrigações de empresas inativas e
                Imposto de Renda para médicos.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artigos.map(({ icon: Icon, titulo, resumo, href }) => (
                <Card
                  key={titulo}
                  className="group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-elegant"
                >
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-primary to-primary/70">
                    <Icon className="h-16 w-16 text-primary-foreground/90" />
                  </div>
                  <CardContent className="flex flex-1 flex-col p-6">
                    <Badge className="mb-3 w-fit bg-accent text-accent-foreground hover:bg-accent">
                      Contabilidade Médica
                    </Badge>
                    <h2 className="mb-3 font-display text-xl font-semibold text-primary">
                      {titulo}
                    </h2>
                    <p className="mb-6 flex-1 text-sm text-muted-foreground">{resumo}</p>
                    <Button asChild variant="link" className="w-fit p-0 text-accent hover:text-accent/80">
                      <Link to={href}>
                        Leia a matéria completa
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link to="/">← Voltar para a Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ContabilidadeMedica;
