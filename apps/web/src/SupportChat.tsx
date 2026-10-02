import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { t, useLocalization } from "./localization";

type ChatMessage = { role: "user" | "assistant"; content: string };

const quickQuestions = ["Where do you deliver?", "How do I place an order?", "How do I install the app?"] as const;

export default function SupportChat() {
  const { locale } = useLocalization();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, open]);

  async function sendMessage(value = draft) {
    const content = value.trim();
    if (!content || pending) return;
    const conversation = [...messages, { role: "user" as const, content }].slice(-10);
    setMessages(conversation);
    setDraft("");
    setPending(true);
    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        credentials: "omit",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: conversation }),
      });
      const result = await response.json() as { reply?: unknown };
      if (!response.ok || typeof result.reply !== "string" || !result.reply.trim()) throw new Error("Support response unavailable");
      setMessages((current) => [...current, { role: "assistant" as const, content: result.reply as string }].slice(-12));
    } catch {
      setMessages((current) => [...current, { role: "assistant" as const, content: t("I couldn't reach our support assistant just now. Please try again in a moment.") }].slice(-12));
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return <div className="support-widget">
    {open && <section className="support-panel" role="dialog" aria-label={t("uBeer Support")}>
      <header className="support-header">
        <div className="support-avatar" aria-hidden="true"><span>u</span><i>✦</i></div>
        <div className="support-heading"><b>{t("uBeer Support")}</b><small><i/> {t("AI support · powered locally")}</small></div>
        <button className="support-reset" type="button" onClick={() => setMessages([])} aria-label={t("Start a new chat")} title={t("Start a new chat")}>↻</button>
        <button className="support-close" type="button" onClick={() => setOpen(false)} aria-label={t("Close support chat")}>×</button>
      </header>
      <div className="support-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text">
        {messages.length === 0 ? <div className="support-welcome">
          <div className="support-welcome-mark">✳</div>
          <span className="support-eyebrow">{t("A LITTLE HELP, RIGHT HERE")}</span>
          <p>{t("Hi! I’m uBeer’s AI support assistant. Ask me about delivery areas, orders, payments, drivers, or installing the app.")}</p>
          <div className="support-quick-questions">{quickQuestions.map((question) => <button type="button" key={question} disabled={pending} onClick={() => void sendMessage(t(question))}>{t(question)}<span>↗</span></button>)}</div>
        </div> : messages.map((message, index) => <div className={`support-message ${message.role}`} key={`${index}-${message.role}`}>
          {message.role === "assistant" && <span className="support-message-avatar" aria-hidden="true">u</span>}
          <p>{message.content}</p>
        </div>)}
        {pending && <div className="support-message assistant"><span className="support-message-avatar" aria-hidden="true">u</span><div className="support-typing" aria-label={t("Thinking…")}><i/><i/><i/></div></div>}
      </div>
      <form className="support-compose" onSubmit={submit}>
        <textarea rows={1} maxLength={1500} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} placeholder={t("Message uBeer Support…")} aria-label={t("Message uBeer Support…")} disabled={pending}/>
        <button type="submit" disabled={pending || !draft.trim()} aria-label={t("Send message")}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4l-5 16-3-7-8-1Z"/><path d="m12 13 8-9"/></svg></button>
      </form>
      <p className="support-privacy"><span aria-hidden="true">✦</span>{t("Local AI · Don’t share passwords, verification or delivery codes, payment details, or ID documents.")}</p>
    </section>}
    <button className={`support-launcher${open ? " is-open" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? t("Close support chat") : t("Open uBeer AI support chat")} aria-expanded={open}>
      {open ? <span className="support-launcher-close">×</span> : <><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3-.6L4 20l1.6-4.1a7.5 7.5 0 1 1 14.4-4.4Z"/><path d="M9 11h.01M12.5 11h.01M16 11h.01"/></svg><span>{t("Chat with uBeer")}</span><i className="support-launcher-sparkle">✦</i></>}
    </button>
  </div>;
}
