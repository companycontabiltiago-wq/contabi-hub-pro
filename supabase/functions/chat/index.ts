import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { convertToModelMessages, streamText, tool, stepCountIs, type UIMessage } from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_PUBLISHABLE_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const WHATSAPP_NUMBER = "5585999154055";

const SYSTEM_PROMPT = `Você é a "Ana", assistente virtual da Company Contábil — escritório de contabilidade em Fortaleza-CE especializado em MEI, Simples Nacional, PJ Médico, IRPF e consultoria empresarial.

TOM: cordial, direto, em português brasileiro. Nunca invente números, prazos, alíquotas ou promessas. Quando não souber, ofereça encaminhar para o time humano via WhatsApp.

CONHECIMENTO DA EMPRESA:
- Planos mensais:
  • Contábil (R$ 369/mês): DP e Fiscal.
  • Empresarial (R$ 569/mês): DP, Fiscal e Consultoria.
  • Premium (R$ 899/mês): Pessoal, Fiscal, Contábil + Consultoria estratégica.
- Serviços gratuitos no site: simulador de regime tributário, cálculo de custo de funcionário, gerador de recibo de vale-transporte.
- Áreas de destaque: contabilidade médica (PJ Médico, empresa inativa, IRPF médicos), abertura de MEI e empresas.
- Contato humano: WhatsApp ${WHATSAPP_NUMBER}.

DIRETRIZES:
- Se o usuário demonstrar interesse em contratar um plano, use a ferramenta "registrar_lead" para registrar o contato.
- Se pedir para falar com um humano, ou a dúvida for complexa/urgente (fiscalização, multa, demissão específica), use "gerar_link_whatsapp" e ofereça o link.
- Se o usuário estiver autenticado (contexto informado) e perguntar sobre documentos dele, use "listar_meus_documentos".
- Respostas curtas e escaneáveis. Use listas quando fizer sentido. Formatação Markdown.`;

interface AuthContext {
  userId: string | null;
  email: string | null;
  companyName: string | null;
}

async function getAuthContext(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return { userId: null, email: null, companyName: null };
  const token = authHeader.replace("Bearer ", "");
  if (token === SUPABASE_PUBLISHABLE_KEY) return { userId: null, email: null, companyName: null };
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return { userId: null, email: null, companyName: null };
    const { data: profile } = await sb.from("profiles").select("company_name").eq("id", user.id).maybeSingle();
    return { userId: user.id, email: user.email ?? null, companyName: profile?.company_name ?? null };
  } catch {
    return { userId: null, email: null, companyName: null };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY não configurado" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();
    const auth = await getAuthContext(req);

    const contextLine = auth.userId
      ? `\n\nCONTEXTO DO USUÁRIO: autenticado como ${auth.email}${auth.companyName ? ` (empresa: ${auth.companyName})` : ""}.`
      : `\n\nCONTEXTO DO USUÁRIO: visitante anônimo do site (não autenticado).`;

    const gateway = createLovableAiGatewayProvider(LOVABLE_API_KEY);

    const tools = {
      registrar_lead: tool({
        description: "Registra um lead interessado em contratar um plano. Use quando o usuário demonstrar interesse claro em contratação.",
        inputSchema: z.object({
          contact_name: z.string().describe("Nome do contato"),
          email: z.string().email().describe("E-mail"),
          phone: z.string().describe("Telefone/WhatsApp com DDD"),
          plan_name: z.string().describe("Plano de interesse: Contábil, Empresarial, Premium ou 'A definir'"),
          company_name: z.string().optional(),
          notes: z.string().optional().describe("Contexto da conversa/necessidade"),
        }),
        execute: async (input) => {
          const admin = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? SUPABASE_PUBLISHABLE_KEY);
          const { error } = await admin.from("plan_leads").insert({
            contact_name: input.contact_name,
            email: input.email,
            phone: input.phone,
            plan_name: input.plan_name,
            company_name: input.company_name ?? null,
            notes: input.notes ?? null,
            preferred_contact: "whatsapp",
          });
          if (error) return { ok: false, error: error.message };
          return { ok: true, mensagem: "Lead registrado. Nosso time entrará em contato em até 1 dia útil." };
        },
      }),
      gerar_link_whatsapp: tool({
        description: "Gera um link do WhatsApp para o cliente falar com o atendimento humano da Company Contábil.",
        inputSchema: z.object({
          mensagem_inicial: z.string().describe("Mensagem sugerida que será pré-preenchida no WhatsApp"),
        }),
        execute: async ({ mensagem_inicial }) => {
          const text = encodeURIComponent(mensagem_inicial);
          return { url: `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, numero: WHATSAPP_NUMBER };
        },
      }),
      listar_meus_documentos: tool({
        description: "Lista os documentos do cliente autenticado. Requer autenticação — não use para visitantes anônimos.",
        inputSchema: z.object({
          categoria: z.string().optional().describe("Filtrar por categoria opcional"),
        }),
        execute: async ({ categoria }) => {
          if (!auth.userId) return { ok: false, mensagem: "O usuário não está autenticado." };
          const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            global: { headers: { Authorization: req.headers.get("Authorization")! } },
          });
          let q = sb.from("client_documents").select("file_name, category, created_at").eq("owner_id", auth.userId).order("created_at", { ascending: false }).limit(20);
          if (categoria) q = q.eq("category", categoria as never);
          const { data, error } = await q;
          if (error) return { ok: false, error: error.message };
          return { ok: true, total: data?.length ?? 0, documentos: data ?? [] };
        },
      }),
    };

    const result = streamText({
      model: gateway("google/gemini-2.5-flash"),
      system: SYSTEM_PROMPT + contextLine,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(50),
    });

    return result.toUIMessageStreamResponse({ headers: corsHeaders });
  } catch (err) {
    console.error("chat error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
