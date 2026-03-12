import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Trash2, ChevronDown, Bot } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scRef = useRef(null);

  useEffect(() => {
    scRef.current?.scrollTo(0, scRef.current.scrollHeight);
  }, [msgs, open]);

  async function ask() {
    if (!input.trim() || loading) return;
    const nextMsgs = [...msgs, { role: "user", content: input.trim() }];
    setMsgs(nextMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://portfolio-backend-for-chat-widget.onrender.com/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: nextMsgs[nextMsgs.length - 1].content,
          history: nextMsgs,
        }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.text }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Hmm, I couldn't connect right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMsgs([]);
  }

  return (
    <div className="fixed z-50 right-4 sm:right-6 bottom-20 md:bottom-6">
      <AnimatePresence initial={false}>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 px-4 py-3 rounded-2xl
                       bg-neutral-900/70 backdrop-blur-xl text-white
                       ring-1 ring-white/15 shadow-[0_10px_30px_rgba(0,0,0,.45)]"
            aria-label="Open chat"
          >
            {/* green live dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <div className="text-left leading-tight">
              <div className="text-[11px] uppercase tracking-wide opacity-70">
                Chat with
              </div>
              <div className="text-sm font-semibold">Raj Support</div>
            </div>
            <MessageCircle className="ml-1 h-5 w-5 opacity-80 group-hover:opacity-100" />
          </motion.button>
        )}

        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="w-[88vw] max-w-[420px] h-[520px]
                       bg-neutral-950/70 backdrop-blur-xl text-white
                       ring-1 ring-white/15 rounded-2xl
                       shadow-[0_20px_60px_rgba(0,0,0,.6)]
                       flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <div className="font-medium">
                  Chat with <span className="font-semibold">Raj Support</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10"
                aria-label="Minimize"
                title="Minimize"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.length === 0 && (
                <div className="h-full grid place-items-center text-center text-sm opacity-70">
                  <div>
                    <Bot className="mx-auto mb-3 h-8 w-8 opacity-80" />
                    <div className="font-medium mb-1">
                      Send a message to start the chat!
                    </div>
                    <div>
                      Ask about Raj’s skills, experience, projects, or links.
                    </div>
                  </div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={`inline-block max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                    ${
                      m.role === "user"
                        ? "bg-white/15 backdrop-blur ring-1 ring-white/20"
                        : "bg-black/40 ring-1 ring-white/10"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left">
                  <div className="inline-block px-3 py-2 rounded-2xl text-sm bg-black/40 ring-1 ring-white/10 animate-pulse">
                    typing…
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="px-3 py-3 bg-white/5 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-xl hover:bg-white/10"
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && ask()}
                  placeholder="Ask something…"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 ring-1 ring-white/15 placeholder-white/50
                             focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={ask}
                  disabled={loading}
                  className="p-3 rounded-xl bg-white/20 hover:bg-white/25 active:scale-95 disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
