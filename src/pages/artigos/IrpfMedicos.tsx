import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const IrpfMedicos = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container max-w-4xl">
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link to="/contabilidade-medica">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Contabilidade Médica
              </Link>
            </Button>
            <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">
              Contabilidade Médica
            </Badge>
            <h1 className="font-display text-3xl font-bold text-primary md:text-5xl">
              IRPF para Médicos: deduções e cuidados
            </h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Conheça as deduções permitidas, o livro-caixa, o Carnê-Leão e como evitar a
              malha fina da Receita Federal.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 text-accent" />
              Imposto de Renda · Leitura de 7 min
            </div>
          </div>
        </section>

        <article className="py-10 md:py-14">
          <div className="container max-w-3xl space-y-6 text-foreground">
            <h2 className="font-display text-2xl font-bold text-primary">
              Por que médicos são alvo da malha fina?
            </h2>
            <p>
              A Receita cruza informações de planos de saúde, hospitais e pacientes (via DMED).
              Inconsistências entre o que o paciente declara como despesa médica e o que o
              profissional informa como receita são <strong>a principal causa de retenção</strong>
              {" "}da declaração de médicos.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary">Carnê-Leão</h2>
            <p>
              Toda receita recebida de pessoa física (consultas particulares, plantões pagos
              por PF) deve ser declarada mensalmente no <strong>Carnê-Leão</strong>, com
              recolhimento de IR pela tabela progressiva (até 27,5%). O atraso gera multa de
              0,33% ao dia, limitada a 20%.
            </p>

            <h2 className="font-display text-2xl font-bold text-primary">
              Livro-Caixa: deduções permitidas
            </h2>
            <p>
              O médico autônomo pode deduzir das receitas as despesas necessárias à atividade,
              reduzindo a base de cálculo do IR:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Aluguel e condomínio do consultório;</li>
              <li>Energia, água, telefone e internet do local de trabalho;</li>
              <li>Salários e encargos de secretária/auxiliares;</li>
              <li>Material de escritório e descartáveis;</li>
              <li>Cursos de aprimoramento, congressos e anuidade do CRM;</li>
              <li>Equipamentos médicos (depreciação) e softwares.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary">
              Deduções na declaração anual
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Dependentes (R$ 2.275,08/ano por dependente);</li>
              <li>Despesas médicas próprias e de dependentes (sem limite);</li>
              <li>Educação (limite anual por pessoa);</li>
              <li>Previdência privada PGBL (até 12% da renda tributável);</li>
              <li>Pensão alimentícia judicial.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-primary">
              Cuidados para não cair na malha
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Emitir recibo/NF para <strong>todo</strong> atendimento;</li>
              <li>Conferir a DMED antes de entregar a declaração;</li>
              <li>Guardar comprovantes por <strong>5 anos</strong>;</li>
              <li>Separar conta bancária pessoal da profissional.</li>
            </ul>

            <div className="mt-10 rounded-xl border bg-primary/5 p-6">
              <h3 className="font-display text-xl font-semibold text-primary">
                Declaração feita por especialistas
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cuidamos do seu IRPF com livro-caixa, Carnê-Leão e cruzamento DMED — você foca
                nos pacientes.
              </p>
              <Button
                asChild
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a
                  href={buildWhatsAppUrl(
                    "Olá! Sou médico e quero ajuda com a Declaração de IRPF.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Falar com especialista
                </a>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
};

export default IrpfMedicos;
