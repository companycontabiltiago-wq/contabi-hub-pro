# Company Contábil — Website e Plataforma de Clientes

Sistema completo de site institucional, área do cliente, assistente virtual (Tiago) e ferramentas de contabilidade online para o escritório **Company Contábil** (Fortaleza-CE).

---

## Visão geral

Este projeto é uma aplicação React 18 + Vite 5 + TypeScript 5 + Tailwind CSS v3 + shadcn/ui. Ele funciona como um site de conversão (landing page) e como uma plataforma privada onde clientes autenticados podem trocar documentos com a contabilidade.

Tecnologias principais:

- **Frontend:** React 18, React Router DOM, TanStack Query, shadcn/ui, Tailwind CSS, Lucide React, jspdf, Recharts
- **Backend:** Lovable Cloud (Supabase) — banco de dados PostgreSQL, Auth, Storage, Edge Functions
- **IA:** Lovable AI Gateway (`google/gemini-2.5-flash`) via edge function `chat`
- **PDFs:** jspdf + custom `pdfReport.ts` com personalização de marca

---

## Estrutura de pastas

```
├── public/                      # Assets públicos (favicon, imagens de notícias, etc.)
├── src/
│   ├── assets/                  # Imagens do projeto (logo, hero, ilustrações)
│   ├── components/
│   │   ├── assistant/           # Chatbot Tiago (widget público e assistente do cliente)
│   │   ├── sections/            # Seções da landing page
│   │   └── ui/                  # Componentes shadcn/ui (alert, button, dialog, input, etc.)
│   ├── hooks/                   # Hooks customizados (mobile, toast)
│   ├── integrations/supabase/   # Cliente Supabase e tipos gerados (não editar manualmente)
│   ├── lib/                     # Utilitários (pdfReport, utils, whatsapp)
│   ├── pages/                   # Páginas das rotas (SPA)
│   └── test/                    # Setup e testes de exemplo (Vitest)
├── supabase/
│   ├── config.toml              # Configuração do projeto (auto-gerado)
│   ├── functions/               # Edge Functions
│   │   ├── _shared/ai-gateway.ts
│   │   └── chat/index.ts        # Função do assistente Tiago
│   └── migrations/              # Migrations SQL do banco de dados
├── index.html                   # HTML de entrada (meta tags SEO/Open Graph)
├── tailwind.config.ts           # Configuração do Tailwind + tokens de design
├── vite.config.ts               # Configuração do Vite e aliases
└── package.json
```

---

## Funcionalidades principais

### Site institucional

- Landing page com Hero, planos de serviço, serviços gratuitos, notícias, FAQ e CTA
- Páginas de artigos especializados:
  - Contabilidade Médica (`/contabilidade-medica`)
  - PJ Médico (`/contabilidade-medica/pj-medico`)
  - Empresa Inativa (`/contabilidade-medica/empresa-inativa`)
  - IRPF Médicos (`/contabilidade-medica/irpf-medicos`)
  - MEI e aberturas (`/mei`)

### Serviços gratuitos (calculadoras e geradores)

- Simulador de regimes tributários (Simples Nacional, Lucro Presumido, Lucro Real, ICMS por UF)
- Custo total com funcionário (inclui FGTS + 40% provisão, vale-transporte, vale-refeição, regime tributário)
- Calculadora de Pró-labore
- Calculadora de INSS
- Calculadora de RPA (Recibo de Pagamento Autônomo) com PDF de recibo
- Recibo de Vale-Transporte
- Recibo de Vale-Alimentação

### Área do cliente

- Login por e-mail/senha e recuperação de senha
- Seleção de perfil na plataforma: "Gestão Contábil" (admin) ou "Cliente"
- Cliente envia/recebe documentos organizados por pasta (Contábil, Fiscal, Pessoal, etc.)
- Painel administrativo para contabilidade visualizar clientes e baixar documentos
- Assistente Tiago integrado à área do cliente (histórico de conversas persistido)

### Assistente virtual Tiago

- Widget flutuante no site (`Fale com o Tiago`)
- Responde sobre planos, serviços, IRPF, MEI, contabilidade médica
- Ferramentas/tools:
  - `registrar_lead` — registra interesse em contratar planos
  - `gerar_link_whatsapp` — encaminha para atendimento humano
  - `listar_meus_documentos` — lista documentos do cliente autenticado

### Notícias

- Seção dinâmica alimentada pela tabela `news` no Supabase
- Artigos sobre Reforma Tributária, Simples Nacional, Portal Nacional do ISS, Pronampe, Desenrola Brasil, MEI e contabilidade médica

---

## Instalação local

```bash
# 1. Clone ou extraia o projeto
unzip company-contabil-backup.zip -d company-contabil
cd company-contabil

# 2. Instale as dependências (bun é o gerenciador original)
bun install
# ou, se preferir npm:
npm install

# 3. Configure as variáveis de ambiente
# O arquivo .env já vem com as chaves publicáveis do Lovable Cloud.
# Se precisar recriar, crie .env na raiz:
VITE_SUPABASE_URL=https://lpevynuehyuubipukqih.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=lpevynuehyuubipukqih

# 4. Rode o servidor de desenvolvimento
bun dev
# ou
npm run dev

# Acesse http://localhost:8080
```

---

## Variáveis de ambiente

As variáveis são consumidas automaticamente pelo `src/integrations/supabase/client.ts` (gerado pelo Lovable).

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon/public key (usada no frontend) |
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto (exibido no console) |

**Atenção:** `SUPABASE_SERVICE_ROLE_KEY` e senha do banco **não estão disponíveis** no Lovable Cloud e não devem ser expostas no frontend.

---

## Supabase — banco de dados e regras

O schema principal é criado pelas migrations em `supabase/migrations/`. Principais tabelas:

- `profiles` — perfis de usuários (clientes e admins)
- `user_roles` — papéis de acesso (`admin`, `cliente`)
- `plan_leads` — leads capturados via site/assistente
- `news` — artigos/notícias exibidos no site
- `chat_threads` / `chat_messages` — histórico de conversas do Tiago
- `client_documents` — metadados dos documentos enviados pelos clientes
- Buckets de Storage para documentos dos clientes (RLS ativo)

### Segurança

- Todas as tabelas possuem **Row Level Security (RLS)** ativo.
- A função `public.has_role()` é `SECURITY DEFINER` e usada nas políticas.
- Buckets de storage possuem RLS para separar documentos de cada cliente.
- O bucket público de documentos **não permite listagem anônima** (`anon` não tem `SELECT` no bucket).

---

## Edge Functions

As funções serverless ficam em `supabase/functions/`:

| Função | Arquivo | Descrição |
|--------|---------|-----------|
| `chat` | `supabase/functions/chat/index.ts` | Assistente Tiago com streaming e tools |
| `ai-gateway` | `supabase/functions/_shared/ai-gateway.ts` | Provider compatível com OpenAI para Lovable AI Gateway |

Para deploy local ou em outro projeto:

```bash
supabase functions deploy chat
```

A edge function `chat` exige a variável `LOVABLE_API_KEY` no Supabase (gerenciada pelo Lovable Cloud).

---

## Testes

```bash
bun test
# ou
npm run test
```

O projeto usa **Vitest** com configuração em `vitest.config.ts`.

---

## Build e deploy

```bash
# Build de produção
bun run build
# ou
npm run build

# O resultado fica em dist/ e pode ser hospedado em qualquer CDN
```

O projeto está publicado na Lovable e sincronizado com a URL pública configurada. Para publicar manualmente, use a ferramenta de publish do Lovable ou conecte a um repositório GitHub e faça deploy via Vercel/Netlify.

---

## Personalização de marca

O site permite personalizar o cabeçalho e rodapé dos PDFs gerados pelas calculadoras:

1. Clique no botão de configurações de marca (disponível nos serviços gratuitos).
2. Faça upload do logo, nome da empresa, telefone, e-mail e site.
3. As informações são salvas no `localStorage` e aplicadas em todos os PDFs.

---

## Contato e suporte

- WhatsApp: (85) 99915-4055
- E-mail: COMPANYCONTABIL.TIAGO@GMAIL.COM
- Escritório: Fortaleza-CE

---

## Notas para desenvolvedores

- Não edite manualmente `src/integrations/supabase/client.ts` e `types.ts` — eles são gerados automaticamente.
- Não modifique `supabase/config.toml` para trocar configurações de projeto.
- Ao criar novas tabelas no `public`, sempre adicione `GRANT` e `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` na mesma migration.
- Mantenha roles de usuário na tabela `user_roles`, nunca no campo `profile` ou `users`.
