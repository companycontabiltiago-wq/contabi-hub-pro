import { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, MessageCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  chatId: string;
  initialMessages?: UIMessage[];
  onMessagesChange?: (messages: UIMessage[]) => void;
  authenticated?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
  suggestions?: string[];
};

export const ChatConversation = ({
  chatId,
  initialMessages = [],
  onMessagesChange,
  authenticated = false,
  emptyTitle = "Olá! Eu sou o Tiago 👋",
  emptyHint = "Assistente virtual da Company Contábil. Como posso ajudar hoje?",
  suggestions = [],
}: Props) => {
  const transportRef = useRef<DefaultChatTransport<UIMessage>>();
  if (!transportRef.current) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    transportRef.current = new DefaultChatTransport({
      api: url,
      fetch: async (input, init) => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const headers = new Headers(init?.headers);
        headers.set("Authorization", `Bearer ${token}`);
        headers.set("apikey", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
        return fetch(input, { ...init, headers });
      },
    });
  }

  const { messages, sendMessage, status, error } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: transportRef.current,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const draftRef = useRef("");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatId, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSend = (text: string) => {
    const value = text.trim();
    if (!value || isBusy) return;
    sendMessage({ text: value });
    draftRef.current = "";
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="mx-auto max-w-md py-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3 className="font-display text-lg font-semibold text-primary">{emptyTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
            {suggestions.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-foreground/80 transition hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {status === "submitted" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Tiago está pensando…
          </div>
        )}
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Ocorreu um erro: {error.message}. Tente novamente.
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(draftRef.current);
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            ref={inputRef}
            placeholder={authenticated ? "Pergunte sobre seus documentos, planos, tributos…" : "Digite sua dúvida contábil…"}
            className="min-h-[44px] resize-none"
            rows={1}
            defaultValue=""
            onChange={(e) => (draftRef.current = e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(draftRef.current);
              }
            }}
          />
          <Button type="submit" disabled={isBusy} size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: UIMessage }) => {
  const isUser = message.role === "user";
  const textParts = message.parts.filter((p): p is { type: "text"; text: string } => p.type === "text");
  const toolParts = message.parts.filter((p) => p.type.startsWith("tool-"));

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        {textParts.map((p, i) => (
          <div key={i} className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-accent underline">
                    {children}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ),
              }}
            >
              {p.text}
            </ReactMarkdown>
          </div>
        ))}
        {toolParts.map((p, i) => (
          <ToolCallBadge key={i} part={p as { type: string; state?: string }} />
        ))}
      </div>
    </div>
  );
};

const ToolCallBadge = ({ part }: { part: { type: string; state?: string; output?: unknown } }) => {
  const name = part.type.replace(/^tool-/, "").replace(/_/g, " ");
  const done = part.state === "output-available";
  const output = (part as { output?: { url?: string } }).output;
  return (
    <div className="mt-2 rounded-md border border-border bg-background/60 px-2 py-1 text-xs text-muted-foreground">
      {done ? "✓" : "…"} {name}
      {done && output?.url && (
        <a href={output.url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 font-semibold text-accent underline">
          Abrir WhatsApp <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};
