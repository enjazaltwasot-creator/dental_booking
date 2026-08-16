import { useState } from "react";
import { MessageCircleMore, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";

const STARTER_MESSAGE = "هلا بك في مساعد إيفان. أقدر أساعدك باختيار الفرع أو التخصص المناسب، وأوجّهك لخطوات الحجز.";
const QUICK_PROMPTS = ["أبي أحجز موعد", "وين فروعكم؟", "وش التخصصات المتاحة؟"];
const SESSION_STORAGE_KEY = "evan-assistant-session";

function getAssistantSessionKey() {
  const fallback = () => `website-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  try {
    const current = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (current) return current;
    const next = fallback();
    window.localStorage.setItem(SESSION_STORAGE_KEY, next);
    return next;
  } catch {
    return fallback();
  }
}

export default function EvanAssistant() {
  const [open, setOpen] = useState(false);
  const [sessionKey] = useState(getAssistantSessionKey);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: STARTER_MESSAGE },
  ]);

  const chat = trpc.assistant.chat.useMutation({
    onSuccess: data => {
      setMessages(previous => [...previous, { role: "assistant", content: data.reply }]);
    },
    onError: () => {
      setMessages(previous => [
        ...previous,
        { role: "assistant", content: "أعتذر، تعذر عليّ الرد الآن. تقدر تبدأ من صفحة [حجز موعد](/booking) أو تحاول بعد قليل." },
      ]);
      toast.error("تعذر تشغيل المساعد حالياً");
    },
  });

  const sendMessage = (content: string) => {
    const nextMessages = [...messages, { role: "user" as const, content }].slice(-10);
    setMessages(nextMessages);
    chat.mutate({
      sessionKey,
      messages: nextMessages.map(message => ({
        role: message.role === "assistant" ? "assistant" as const : "user" as const,
        content: message.content,
      })),
    });
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-3 sm:bottom-6 sm:left-6" dir="rtl">
      {open && (
        <section className="w-[calc(100vw-2.5rem)] max-w-[420px] overflow-hidden rounded-3xl border border-primary/15 bg-white shadow-2xl shadow-primary/20">
          <header className="flex items-center justify-between bg-primary px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-white/15"><Sparkles className="size-5 text-orange-200" /></span>
              <div>
                <h2 className="text-sm font-extrabold">مساعد إيفان الذكي</h2>
                <p className="mt-0.5 text-xs text-white/70">للفروع والتخصصات والحجز</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="إغلاق المساعد" className="grid size-9 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"><X className="size-5" /></button>
          </header>
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 border-b border-border bg-secondary/35 px-4 py-3">
              {QUICK_PROMPTS.map(prompt => (
                <button key={prompt} type="button" disabled={chat.isPending} onClick={() => sendMessage(prompt)} className="rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50">
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <AIChatBox
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={chat.isPending}
            height="440px"
            placeholder="اكتب سؤالك هنا..."
            className="rounded-none border-0 shadow-none"
          />
          <p className="border-t border-border bg-secondary/25 px-4 py-2 text-center text-[10px] leading-4 text-muted-foreground">لا يقدم المساعد تشخيصاً طبياً. التقييم الطبي يكون لدى الطبيب المختص.</p>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label={open ? "إغلاق مساعد إيفان" : "فتح مساعد إيفان"}
        className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-sm font-extrabold text-accent-foreground shadow-lg shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]"
      >
        <MessageCircleMore className="size-5" />
        {open ? "إغلاق المساعد" : "مساعد إيفان"}
      </button>
    </div>
  );
}
