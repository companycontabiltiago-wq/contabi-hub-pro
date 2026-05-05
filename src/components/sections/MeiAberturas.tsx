import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Building2, FileCheck2, Rocket, ArrowRight } from "lucide-react";
import { gerarRelatorioPDF } from "@/lib/pdfReport";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import meiImg from "@/assets/mei-illustration.jpg";
import docsImg from "@/assets/documentos-migracao.jpg";

const docsMigracao = [
  "Contrato Social e última alteração consolidada",
  "Cartão CNPJ atualizado",
  "Inscrição Estadual e Municipal (quando houver)",
  "Procuração eletrônica e-CAC (com a contabilidade atual)",
  "Acessos: Simples Nacional, eSocial, Conectividade Social, Prefeitura",
  "Últimas DCTFWeb, DEFIS, ECF, ECD e SPED Fiscal/Contribuições (5 anos)",
  "Folhas de pagamento, holerites e GFIP/eSocial dos últimos 12 meses",
  "Balanços e balancetes dos últimos 3 exercícios",
  "Notas fiscais de entrada e saída do exercício corrente (XML)",
  "Extratos bancários conciliados do exercício corrente",
  "Livro Caixa e controles auxiliares (estoque, contas a pagar/receber)",
  "Contratos com clientes, fornecedores e parcelamentos vigentes (Refis, Pert)",
  "Certidões negativas (Federal, Estadual, Municipal, FGTS e Trabalhista)",
];

const docsAbertura = [
  "RG e CPF de todos os sócios (ou CNH)",
  "Comprovante de residência atualizado de cada sócio",
  "Certidão de casamento (se casado) com pacto antenupcial, se houver",
  "Título de eleitor e/ou comprovante da última declaração de IRPF",
  "Definição da atividade (CNAE) principal e secundárias",
  "Endereço da sede com IPTU e número de inscrição imobiliária",
  "Cópia do contrato de locação ou escritura do imóvel",
  "Capital social e percentual de participação de cada sócio",
  "Definição do nome empresarial e nome fantasia",
  "Definição do regime tributário (Simples, Presumido ou Real)",
  "Pró-labore previsto para os sócios administradores",
  "Alvará de funcionamento e licenças específicas (Vigilância, Bombeiros, etc.)",
];

const downloadMigracao = () =>
  gerarRelatorioPDF({
    title: "Documentos para Migração de Contabilidade",
    subtitle: "Checklist completo",
    fileName: `Checklist_Migracao_Contabilidade_${Date.now()}.pdf`,
    sections: [
      {
        title: "Documentos societários e cadastrais",
        rows: docsMigracao.slice(0, 5).map((d) => ({ label: d, value: "☐" })),
      },
      {
        title: "Obrigações acessórias e fiscais",
        rows: docsMigracao.slice(5, 10).map((d) => ({ label: d, value: "☐" })),
      },
      {
        title: "Contratos, certidões e financeiro",
        rows: [
          ...docsMigracao.slice(10).map((d) => ({ label: d, value: "☐" })),
          { note: "A migração ocorre sem custo adicional. Nossa equipe assina a procuração eletrônica e organiza toda a transição com a contabilidade anterior." },
        ],
      },
    ],
  });

const downloadAbertura = () =>
  gerarRelatorioPDF({
    title: "Documentos para Abertura de Empresa",
    subtitle: "Checklist de constituição de CNPJ",
    fileName: `Checklist_Abertura_Empresa_${Date.now()}.pdf`,
    sections: [
      {
        title: "Documentos pessoais dos sócios",
        rows: docsAbertura.slice(0, 4).map((d) => ({ label: d, value: "☐" })),
      },
      {
        title: "Definições da empresa",
        rows: docsAbertura.slice(4, 10).map((d) => ({ label: d, value: "☐" })),
      },
      {
        title: "Endereço, licenças e operação",
        rows: [
          ...docsAbertura.slice(10).map((d) => ({ label: d, value: "☐" })),
          { note: "Cuidamos de todo o processo: viabilidade, Junta Comercial, Receita Federal, Prefeitura e enquadramento tributário." },
        ],
      },
    ],
  });

export const MeiAberturas = () => {
  return (
    <section id="mei-aberturas" className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Aberturas, MEI e Migração
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl text-balance">
            Comece, formalize ou migre sua empresa com segurança
          </h2>
          <p className="mt-4 text-muted-foreground">
            Baixe os checklists oficiais, conheça o serviço de abertura de MEI e
            entenda as diferenças entre MEI, ME, EPP e Demais empresas.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 — Migração */}
          <Card className="flex flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold text-primary">
              Migração de Contabilidade
            </h3>
            <p className="text-sm text-muted-foreground">
              Já tem contador? Baixe o checklist com tudo o que precisamos para
              migrar sua empresa sem custos e sem dor de cabeça.
            </p>
            <Button onClick={downloadMigracao} className="mt-6 w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar checklist (PDF)
            </Button>
          </Card>

          {/* Card 2 — Abertura */}
          <Card className="flex flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold text-primary">
              Abertura de Empresa
            </h3>
            <p className="text-sm text-muted-foreground">
              Vai constituir um CNPJ? Baixe a relação de documentos e definições
              necessárias para abrir sua empresa com segurança.
            </p>
            <Button onClick={downloadAbertura} className="mt-6 w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Baixar checklist (PDF)
            </Button>
          </Card>

          {/* Card 3 — MEI */}
          <Card className="flex flex-col p-7 transition-all hover:-translate-y-1 hover:shadow-elegant border-accent/30 bg-accent/5">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold text-primary">
              Abertura de MEI
            </h3>
            <p className="text-sm text-muted-foreground">
              Formalize-se como Microempreendedor Individual em até 24h. Conheça
              as obrigações, limites e tudo que você precisa saber.
            </p>
            <Button asChild className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/mei">
                Saiba mais
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>

        {/* Banner inferior */}
        <div className="mt-14 grid items-center gap-8 rounded-2xl border border-border bg-gradient-soft p-6 md:grid-cols-2 md:p-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-primary md:text-3xl">
              Não sabe se você é MEI, ME ou EPP?
            </h3>
            <p className="mt-3 text-muted-foreground">
              Cada porte tem limites de faturamento, número de funcionários e
              obrigações fiscais diferentes. Entenda agora qual é o ideal para o
              seu momento — e quando é hora de mudar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/mei#comparativo">
                  Ver comparativo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a
                  href={buildWhatsAppUrl(
                    "Olá! Gostaria de tirar dúvidas sobre o porte da minha empresa (MEI, ME, EPP).",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com a Company
                </a>
              </Button>
            </div>
          </div>
          <img
            src={docsImg}
            alt="Checklists e documentos para abertura e migração de empresa"
            loading="lazy"
            width={1024}
            height={512}
            className="rounded-xl shadow-elegant"
          />
        </div>
      </div>
    </section>
  );
};
