import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { ChatConversation } from "./ChatConversation";
import type { UIMessage } from "ai";

type ThreadRow = { id: string; title: string; updated_at: string };
type MessageRow = { id: string; role: string; content: string; created_at: string };

const toUIMessage = (row: MessageRow): UIMessage => ({
  id: row.id,
  role: row.role as UIMessage["role"],
  parts: [{ type: "text", text: row.content }],
});

export const ClientAssistant = ({ userId }: { userId: string }) => {
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThreads = async () => {
    const { data, error } = await supabase
      .from("chat_threads")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (error) return toast.error(error.message);
    setThreads(data ?? []);
    if (data && data.length > 0 && !activeId) setActiveId(data[0].id);
    setLoading(false);
  };

  const loadMessages = async (threadId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("thread_id", threadId)
      .order("created_at");
    if (error) return toast.error(error.message);
    setMessages((data ?? []).map(toUIMessage));
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
    else setMessages([]);
  }, [activeId]);

  const newThread = async () => {
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({ user_id: userId, title: "Nova conversa" })
      .select("id, title, updated_at")
      .single();
    if (error) return toast.error(error.message);
    setThreads((prev) => [data, ...prev]);
    setActiveId(data.id);
    setMessages([]);
  };

  const deleteThread = async (id: string) => {
    if (!confirm("Excluir esta conversa?")) return;
    const { error } = await supabase.from("chat_threads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    const remaining = threads.filter((t) => t.id !== id);
    setThreads(remaining);
    if (id === activeId) setActiveId(remaining[0]?.id ?? null);
  };

  const handleMessagesChange = async (next: UIMessage[]) => {
    if (!activeId) return;
    // Persist any new messages not yet in DB
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const newOnes = next.filter((m) => !existingIds.has(m.id));
      if (newOnes.length > 0) {
        void (async () => {
          for (const m of newOnes) {
            const text = m.parts
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("\n");
            if (!text.trim()) continue;
            await supabase.from("chat_messages").insert({
              thread_id: activeId,
              role: m.role,
              content: text,
            });
          }
          // Update thread title from first user message if still default
          const firstUser = next.find((m) => m.role === "user");
          if (firstUser) {
            const title = (firstUser.parts.find((p) => p.type === "text") as { text?: string } | undefined)?.text?.slice(0, 60);
            if (title) {
              await supabase.from("chat_threads").update({ title }).eq("id", activeId).eq("title", "Nova conversa");
              setThreads((prev) => prev.map((t) => (t.id === activeId && t.title === "Nova conversa" ? { ...t, title } : t)));
            }
          }
        })();
      }
      return next;
    });
  };

  const active = useMemo(() => threads.find((t) => t.id === activeId), [threads, activeId]);

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="grid h-[calc(100vh-14rem)] grid-cols-1 gap-4 md:grid-cols-[240px_1fr]">
      <aside className="flex flex-col rounded-lg border border-border bg-background">
        <div className="border-b border-border p-3">
          <Button onClick={newThread} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Nova conversa
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {threads.length === 0 && (
            <p className="p-2 text-center text-xs text-muted-foreground">Nenhuma conversa ainda.</p>
          )}
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition ${
                t.id === activeId ? "bg-accent/10 text-accent" : "text-foreground/80 hover:bg-muted"
              }`}
            >
              <button onClick={() => setActiveId(t.id)} className="flex flex-1 items-center gap-2 truncate text-left">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{t.title}</span>
              </button>
              <button onClick={() => deleteThread(t.id)} className="opacity-0 transition group-hover:opacity-100" aria-label="Remover">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-background">
        {active ? (
          <ChatConversation
            key={active.id}
            chatId={active.id}
            initialMessages={messages}
            onMessagesChange={handleMessagesChange}
            authenticated
            suggestions={[
              "Quais documentos vocês precisam neste mês?",
              "Me explique meu último recibo enviado",
              "Quero falar com o time no WhatsApp",
            ]}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Clique em "Nova conversa" para começar.
          </div>
        )}
      </section>
    </div>
  );
};
