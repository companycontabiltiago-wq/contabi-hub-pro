import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatConversation } from "./ChatConversation";
import type { UIMessage } from "ai";

type Thread = { id: string; title: string; updatedAt: number; messages: UIMessage[] };
const STORAGE_KEY = "company-contabil.assistant.threads.v1";

const loadThreads = (): Thread[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Thread[];
  } catch {
    return [];
  }
};

const saveThreads = (threads: Thread[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    /* ignore */
  }
};

export const SiteChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    const existing = loadThreads();
    if (existing.length === 0) {
      const t: Thread = { id: crypto.randomUUID(), title: "Nova conversa", updatedAt: Date.now(), messages: [] };
      setThreads([t]);
      setActiveId(t.id);
      saveThreads([t]);
    } else {
      setThreads(existing);
      setActiveId(existing[0].id);
    }
  }, []);

  const active = useMemo(() => threads.find((t) => t.id === activeId) ?? null, [threads, activeId]);

  const handleMessagesChange = (messages: UIMessage[]) => {
    if (!active) return;
    setThreads((prev) => {
      const next = prev.map((t) => {
        if (t.id !== active.id) return t;
        const firstUser = messages.find((m) => m.role === "user");
        const title = firstUser
          ? (firstUser.parts.find((p) => p.type === "text") as { text?: string } | undefined)?.text?.slice(0, 40) ?? t.title
          : t.title;
        return { ...t, messages, title: title || "Nova conversa", updatedAt: Date.now() };
      });
      saveThreads(next);
      return next;
    });
  };

  const newThread = () => {
    const t: Thread = { id: crypto.randomUUID(), title: "Nova conversa", updatedAt: Date.now(), messages: [] };
    const next = [t, ...threads];
    setThreads(next);
    setActiveId(t.id);
    saveThreads(next);
  };

  const deleteThread = (id: string) => {
    const next = threads.filter((t) => t.id !== id);
    if (next.length === 0) {
      const t: Thread = { id: crypto.randomUUID(), title: "Nova conversa", updatedAt: Date.now(), messages: [] };
      next.push(t);
      setActiveId(t.id);
    } else if (id === activeId) {
      setActiveId(next[0].id);
    }
    setThreads(next);
    saveThreads(next);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-accent-foreground shadow-lg transition hover:scale-105 hover:bg-accent/90"
          aria-label="Abrir assistente"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Fale com o Tiago</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[600px] max-h-[calc(100vh-2rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <p className="font-display font-semibold">Ana · Assistente</p>
              <p className="text-xs opacity-80">Company Contábil</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={newThread} className="h-8 w-8 text-primary-foreground hover:bg-white/10" title="Nova conversa">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8 text-primary-foreground hover:bg-white/10" title="Fechar">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {threads.length > 1 && (
            <div className="max-h-24 overflow-y-auto border-b border-border bg-muted/40 px-2 py-1">
              {threads.map((t) => (
                <div key={t.id} className={`group flex items-center gap-1 rounded px-2 py-1 text-xs ${t.id === activeId ? "bg-accent/20 text-accent font-semibold" : "text-muted-foreground"}`}>
                  <button onClick={() => setActiveId(t.id)} className="flex-1 truncate text-left">
                    {t.title}
                  </button>
                  <button onClick={() => deleteThread(t.id)} className="opacity-0 transition group-hover:opacity-100" aria-label="Remover conversa">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {active && (
            <ChatConversation
              key={active.id}
              chatId={active.id}
              initialMessages={active.messages}
              onMessagesChange={handleMessagesChange}
              suggestions={[
                "Quero abrir um MEI, por onde começo?",
                "Diferença entre Simples Nacional e Lucro Presumido",
                "Quanto custa o plano Empresarial?",
                "Falar com um humano no WhatsApp",
              ]}
            />
          )}
        </div>
      )}
    </>
  );
};
