import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Trash2, ChevronDown, Bot, Download } from "lucide-react";

const RESUME_URL = "https://raw.githubusercontent.com/tylerdurden0x/patilraj-portfolio/main/public/patilrajresume.pdf";
const RESUME_TRIGGER = "%%RESUME_DOWNLOAD%%";

const THINKING_PHRASES = [
  "sifting through Raj's brain…",
  "checking the projects vault…",
  "pulling up the good stuff…",
  "reading between the lines…",
  "connecting the dots…",
  "almost there…",
  "making sure this sounds right…",
  "one sec, worth the wait…",
];

function InfinityCanvas({ width, height, rx, ry, lineW, tailLen, speed, dimOpacity = 1 }) {
  const canvasRef = useRef(null);
  // Use refs so animation loop always sees latest values without restart
  const propsRef = useRef({ lineW, tailLen, speed, dimOpacity });
  useEffect(() => { propsRef.current = { lineW, tailLen, speed, dimOpacity }; }, [lineW, tailLen, speed, dimOpacity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = width / 2;
    const cy = height / 2;
    const N = 400;

    const pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      pts.push([
        cx + rx * Math.cos(t) / denom,
        cy + ry * Math.sin(t) * Math.cos(t) / denom,
      ]);
    }

    let offset = 0;
    let raf;

    function frame() {
      const { lineW, tailLen, speed, dimOpacity } = propsRef.current;
      ctx.clearRect(0, 0, width, height);

      // Dim base
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < N; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
      ctx.strokeStyle = `rgba(255,255,255,${0.1 * dimOpacity})`;
      ctx.lineWidth = lineW;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowBlur = 0;
      ctx.stroke();

      // Travelling glow
      for (let j = 0; j < tailLen; j++) {
        const idx  = (Math.floor(offset) - j + N) % N;
        const nidx = (idx + 1) % N;
        const alpha = Math.pow(1 - j / tailLen, 2) * dimOpacity;

        ctx.beginPath();
        ctx.moveTo(pts[idx][0], pts[idx][1]);
        ctx.lineTo(pts[nidx][0], pts[nidx][1]);
        ctx.lineCap = "round";
        ctx.shadowColor = "white";
        ctx.shadowBlur = j < 4 ? 3 : 0;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = lineW;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      offset = (offset + speed) % N;
      raf = requestAnimationFrame(frame);
    }

    frame();
    return () => cancelAnimationFrame(raf);
  }, [width, height, rx, ry]); // only restart if size changes

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}

function ThinkingIndicator({ loading }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % THINKING_PHRASES.length), 2200);
    return () => clearInterval(id);
  }, [loading]);

  return (
    <div className="text-left">
      <div
        className="inline-flex items-center gap-3 px-3 py-2.5 rounded-2xl ring-1"
        style={{
          background: loading ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)",
          borderColor: loading ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
          transition: "all 0.5s ease",
        }}
      >
        <InfinityCanvas
          width={50}
          height={32}
          rx={18}
          ry={11}
          lineW={loading ? 3 : 1.5}
          tailLen={loading ? 70 : 25}
          speed={loading ? 1.2 : 0.3}
          dimOpacity={loading ? 1 : 0.35}
        />
        <AnimatePresence mode="wait">
          {loading && (
            <motion.span
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-white/60 whitespace-nowrap"
            >
              {THINKING_PHRASES[idx]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(0);
  const scRef = useRef(null);

  useEffect(() => {
    scRef.current?.scrollTo(0, scRef.current.scrollHeight);
  }, [msgs, open, loading]);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const kbHeight = window.innerHeight - window.visualViewport.height;
        setBottomOffset(kbHeight > 100 ? kbHeight : 0);
      }
    };
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  function isResumeRequest(text) {
    return /resume|cv|curriculum vitae|download/i.test(text);
  }

  async function ask() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    const nextMsgs = [...msgs, { role: "user", content: userText }];
    setMsgs(nextMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://portfolio-backend-for-chat-widget.onrender.com/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: nextMsgs,
        }),
      });
      const data = await res.json();
      const replyText = data?.text || "I am a bit busy right now — please try again in a moment! 😊";
      const shouldShowResume = isResumeRequest(userText) || replyText.includes(RESUME_TRIGGER);
      const finalText = replyText.includes(RESUME_TRIGGER)
        ? replyText
        : shouldShowResume
        ? replyText + " " + RESUME_TRIGGER
        : replyText;
      setMsgs((m) => [...m, { role: "assistant", content: finalText }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: "Hmm, I couldn't connect right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMsgs([]);
  }

  function renderMessage(m, i) {
    if (!m || !m.content) return null;
    const hasResume = m.content.includes(RESUME_TRIGGER);
    const cleanText = m.content.replace(RESUME_TRIGGER, "").trim();

    return (
      <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
        <div
          className={`inline-block max-w-[85%] break-words px-3 py-2 rounded-2xl text-sm leading-relaxed
          ${m.role === "user"
            ? "bg-white/15 backdrop-blur ring-1 ring-white/20"
            : "bg-black/40 ring-1 ring-white/10"
          }`}
        >
          {cleanText}
          {hasResume && (
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 ring-1 ring-emerald-400/40 text-emerald-300 text-xs font-medium transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              Download Resume
            </a>
          )}
        </div>
      </div>
    );
  }

  const mobileBottom = bottomOffset > 0 ? `${bottomOffset + 8}px` : "6rem";

  return (
    <>
      <div
        className="fixed z-50 right-3 sm:right-6"
        style={{ bottom: window.innerWidth < 640 ? mobileBottom : "1.5rem" }}
      >
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
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <div className="text-left leading-tight">
                <div className="text-[11px] uppercase tracking-wide opacity-70">Chat with</div>
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
              style={{
                width: "min(92vw, 420px)",
                height: bottomOffset > 0 ? `calc(100vh - ${bottomOffset + 16}px)` : "min(70vh, 520px)",
              }}
              className="bg-neutral-950/90 backdrop-blur-xl text-white
                         ring-1 ring-white/15 rounded-2xl
                         shadow-[0_20px_60px_rgba(0,0,0,.6)]
                         flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <div className="font-medium text-sm">
                    Chat with <span className="font-semibold">Raj Support</span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10"
                  aria-label="Minimize"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                {msgs.length === 0 && (
                  <div className="h-full grid place-items-center text-center text-sm opacity-70 px-4">
                    <div>
                      <Bot className="mx-auto mb-3 h-8 w-8 opacity-80" />
                      <div className="font-medium mb-1">Send a message to start the chat!</div>
                      <div className="text-xs">Ask about Raj's skills, experience, projects, or links.</div>
                    </div>
                  </div>
                )}
                {msgs.map((m, i) => renderMessage(m, i))}

                {/* Always visible — dim idle, bright + text when loading */}
                <ThinkingIndicator loading={loading} />
              </div>

              {/* Composer */}
              <div className="px-3 py-3 bg-white/5 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearChat}
                    className="p-2 rounded-xl hover:bg-white/10 shrink-0"
                    title="Clear chat"
                    aria-label="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && ask()}
                    placeholder="Ask something…"
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/10 ring-1 ring-white/15 placeholder-white/50 text-sm
                               focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    onClick={ask}
                    disabled={loading}
                    className="p-2.5 rounded-xl bg-white/20 hover:bg-white/25 active:scale-95 disabled:opacity-50 shrink-0"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}