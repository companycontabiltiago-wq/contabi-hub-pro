import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Download, Shield, TrendingUp, Gem } from "lucide-react";
import { jsPDF } from "jspdf";
import { PlanContractDialog } from "@/components/PlanContractDialog";
import { loadBrand } from "@/lib/pdfReport";

export type Plan = {
  code: string;
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  tagline: string;
  taglineNote: string;
  highlight: boolean;
};

export const plans: Plan[] = [
  {
    code: "369",
    name: "369",
    subtitle: "DP E FISCAL",
    price: "369",
    features: [
      "Departamento Pessoal",
      "Folha de Pagamento",
      "Obrigações Trabalhistas",
      "Obrigações Fiscais",
      "Apuração de Impostos",
      "Emissão de Guias",
      "Suporte Contábil",
      "Emissão de até 15 notas fiscais grátis",
    ],
    tagline: "Segurança e Conformidade",
    taglineNote: "Para o seu negócio.",
    highlight: false,
  },
  {
    code: "START",
    name: "START",
    subtitle: "DP, FISCAL E CONSULTORIA",
    price: "569",
    features: [
      "Departamento Pessoal",
      "Folha de Pagamento",
      "Obrigações Trabalhistas",
      "Obrigações Fiscais",
      "Apuração de Impostos",
      "Emissão de Guias",
      "Consultoria Contábil",
      "Planejamento Tributário",
      "Análise de Resultados",
      "Emissão de até 30 notas fiscais grátis",
    ],
    tagline: "Estratégia e Crescimento",
    taglineNote: "Para o seu negócio.",
    highlight: true,
  },
  {
    code: "PREMIUM",
    name: "PREMIUM",
    subtitle: "PESSOAL, FISCAL E CONTÁBIL + CONSULTORIA",
    price: "899",
    features: [
      "Departamento Pessoal",
      "Folha de Pagamento",
      "Obrigações Trabalhistas",
      "Obrigações Fiscais",
      "Apuração de Impostos",
      "Emissão de Guias",
      "Contabilidade Completa",
      "Consultoria Contábil",
      "Planejamento Tributário",
      "Análise de Resultados",
      "Relatórios Gerenciais",
      "Suporte Prioritário",
      "Emissão de notas fiscais por conta do cliente",
    ],
    tagline: "Gestão Completa e Estratégica",
    taglineNote: "Para o sucesso da sua empresa.",
    highlight: false,
  },
];

const planIcons = [Shield, TrendingUp, Gem];

const hexToRgb = (hex: string): [number, number, number] => {
  const m = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(m.substring(i, i + 2), 16)) as [number, number, number];
};

const gerarArtePDF = () => {
  const brand = loadBrand();
  const [pr, pg, pb] = hexToRgb(brand.primaryColor || "#1B4332");
  const [ar, ag, ab] = hexToRgb(brand.accentColor || "#2DD4A8");

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = 210;
  const pageH = 297;

  // Fundo
  doc.setFillColor(248, 249, 251);
  doc.rect(0, 0, pageW, pageH, "F");

  // Faixa superior branca com título
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, 55, "F");

  // "Ornamento" azul no canto superior direito
  doc.setFillColor(pr, pg, pb);
  doc.triangle(pageW - 70, 0, pageW, 0, pageW, 55, "F");
  doc.setFillColor(ar, ag, ab);
  doc.triangle(pageW - 15, 0, pageW, 0, pageW, 20, "F");

  // Logo (se houver)
  let logoOffset = 15;
  if (brand.logoDataUrl) {
    try {
      const fmt = brand.logoDataUrl.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
      doc.addImage(brand.logoDataUrl, fmt, 15, 15, 22, 22);
      logoOffset = 42;
    } catch {
      /* ignore */
    }
  }

  // Nome empresa
  doc.setTextColor(pr, pg, pb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(brand.companyName.toUpperCase(), logoOffset, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("C O N T Á B I L", logoOffset, 28);

  // Título central
  doc.setTextColor(pr, pg, pb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("PLANOS DE", 80, 25);
  doc.text("ASSESSORIA CONTÁBIL", 80, 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text("Soluções completas para o crescimento", 80, 40);
  doc.text("e a segurança do seu negócio.", 80, 44);

  // Selo canto direito
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("FOCO NO QUE", pageW - 12, 28, { align: "right" });
  doc.text("IMPORTA:", pageW - 12, 32, { align: "right" });
  doc.setTextColor(ar, ag, ab);
  doc.setFontSize(8);
  doc.text("O CRESCIMENTO", pageW - 12, 38, { align: "right" });
  doc.text("DA SUA", pageW - 12, 42, { align: "right" });
  doc.text("EMPRESA!", pageW - 12, 46, { align: "right" });

  // Cards de planos
  const cardW = 58;
  const cardGap = 4;
  const startX = (pageW - (cardW * 3 + cardGap * 2)) / 2;
  const cardY = 62;
  const cardH = 180;

  plans.forEach((plan, i) => {
    const x = startX + i * (cardW + cardGap);

    // Sombra sutil
    doc.setFillColor(230, 230, 235);
    doc.roundedRect(x + 0.6, cardY + 0.6, cardW, cardH, 3, 3, "F");

    // Card branco
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, cardY, cardW, cardH, 3, 3, "F");

    // Header azul do card
    doc.setFillColor(pr, pg, pb);
    doc.roundedRect(x + 3, cardY + 4, cardW - 6, 22, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("PLANO", x + cardW / 2, cardY + 10, { align: "center" });
    doc.setTextColor(ar, ag, ab);
    doc.setFontSize(plan.name.length > 4 ? 14 : 18);
    doc.text(plan.name, x + cardW / 2, cardY + 18, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    const subLines = doc.splitTextToSize(plan.subtitle, cardW - 8);
    doc.text(subLines, x + cardW / 2, cardY + 23, { align: "center" });

    // Faixa "A PARTIR DE"
    let y = cardY + 34;
    doc.setFillColor(ar, ag, ab);
    doc.roundedRect(x + 6, y, cardW - 12, 5, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text("A PARTIR DE", x + cardW / 2, y + 3.5, { align: "center" });

    y += 10;
    doc.setTextColor(pr, pg, pb);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`R$ ${plan.price},00`, x + cardW / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("/MÊS", x + cardW / 2, y + 4, { align: "center" });

    // Linha divisória
    y += 8;
    doc.setDrawColor(220, 220, 225);
    doc.setLineWidth(0.2);
    doc.line(x + 6, y, x + cardW - 6, y);

    // Features
    y += 5;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 55);
    plan.features.forEach((f) => {
      doc.setTextColor(ar, ag, ab);
      doc.setFont("helvetica", "bold");
      doc.text("✓", x + 5, y);
      doc.setTextColor(50, 50, 55);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(f, cardW - 12);
      doc.text(lines, x + 9, y);
      y += 4.5 * lines.length;
    });

    // Tagline no rodapé do card
    const tagY = cardY + cardH - 18;
    doc.setFillColor(pr, pg, pb);
    doc.roundedRect(x + 3, tagY, cardW - 6, 14, 2, 2, "F");
    doc.setTextColor(ar, ag, ab);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    const tagLines = doc.splitTextToSize(plan.tagline.toUpperCase(), cardW - 8);
    doc.text(tagLines, x + cardW / 2, tagY + 5, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.text(plan.taglineNote.toUpperCase(), x + cardW / 2, tagY + 11, { align: "center" });
  });

  // Faixa "Por que escolher"
  const bandY = cardY + cardH + 8;
  doc.setFillColor(pr, pg, pb);
  doc.roundedRect(15, bandY, pageW - 30, 22, 2, 2, "F");
  doc.setTextColor(ar, ag, ab);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("POR QUE ESCOLHER A COMPANY CONTÁBIL?", pageW / 2, bandY + 5, { align: "center" });

  const beneficios = [
    "CONFORMIDADE\nCOM A LEGISLAÇÃO",
    "GESTÃO\nINTELIGENTE",
    "ATENDIMENTO\nPERSONALIZADO",
    "AGILIDADE E\nEFICIÊNCIA",
    "SEGURANÇA E\nCONFIDENCIALIDADE",
  ];
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  const bStep = (pageW - 30) / beneficios.length;
  beneficios.forEach((b, i) => {
    const bx = 15 + bStep * i + bStep / 2;
    doc.text(b, bx, bandY + 13, { align: "center" });
  });

  // Rodapé de contato
  const footY = bandY + 28;
  doc.setTextColor(ar, ag, ab);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Conte com a gente!", 20, footY);
  doc.setTextColor(pr, pg, pb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("FOCO NO QUE IMPORTA:", 20, footY + 5);
  doc.setTextColor(ar, ag, ab);
  doc.text("O CRESCIMENTO DA SUA EMPRESA!", 20, footY + 9);

  doc.setTextColor(pr, pg, pb);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FALE CONOSCO", pageW / 2, footY, { align: "center" });
  doc.setFontSize(11);
  doc.text(brand.phone || "(85) 99915-4055", pageW / 2, footY + 6, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(brand.website || "www.companycontabil.com.br", pageW / 2, footY + 11, {
    align: "center",
  });

  doc.setTextColor(ar, ag, ab);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PARCERIA QUE", pageW - 20, footY + 3, { align: "right" });
  doc.text("GERA RESULTADOS!", pageW - 20, footY + 7, { align: "right" });

  doc.save("Planos_Company_Contabil.pdf");
};

export const Plans = () => {
  const [selected, setSelected] = useState<{ name: string; price: string } | null>(null);
  return (
    <section id="planos" className="bg-gradient-soft py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Planos</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl text-balance">
            Planos de Assessoria Contábil
          </h2>
          <p className="mt-4 text-muted-foreground">
            Soluções completas para o crescimento e a segurança do seu negócio.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={gerarArtePDF}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar catalogo dos planos
          </Button>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = planIcons[i];
            return (
              <Card
                key={plan.name}
                className={`relative flex flex-col p-8 transition-all hover:-translate-y-1 ${
                  plan.highlight
                    ? "border-2 border-accent shadow-elegant scale-100 md:scale-105"
                    : "shadow-card"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-glow">
                    <Sparkles className="h-3 w-3" /> Mais popular
                  </span>
                )}

                <div className="rounded-xl bg-primary px-4 py-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                    Plano
                  </p>
                  <p className="mt-0.5 font-display text-3xl font-bold text-accent">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/90">
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mt-5 rounded-full bg-gradient-accent px-3 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                  A partir de
                </div>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="font-display text-5xl font-bold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">,00 /mês</span>
                </div>

                <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl bg-primary p-4 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
                    {plan.tagline}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-white/80">
                    {plan.taglineNote}
                  </p>
                </div>

                <Button
                  onClick={() => setSelected({ name: plan.name, price: plan.price })}
                  className={`mt-4 w-full ${plan.highlight ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  Contratar agora
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <PlanContractDialog
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        planName={selected?.name ?? ""}
        planPrice={selected?.price}
      />
    </section>
  );
};
