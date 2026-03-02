"use client";

import { useState, useEffect, useRef } from "react";

const COMMAND = `curl -H "Accept: text/markdown" localhost:3000/products/42`;

const RESPONSE_LINES = [
  { text: "HTTP/1.1 200 OK", style: "text-t-green" },
  {
    text: "Content-Type: text/markdown; charset=utf-8",
    style: "text-t-cyan-dim",
  },
  { text: "", style: "" },
  { text: "# Product 42", style: "text-white font-bold" },
  { text: "", style: "" },
  { text: "**Price:** $42.00", style: "text-t-amber" },
  { text: "**Category:** Electronics", style: "text-t-amber" },
  { text: "**In Stock:** Yes", style: "text-t-amber" },
  { text: "", style: "" },
  {
    text: "A premium electronic product with exceptional",
    style: "text-fg-2",
  },
  {
    text: "build quality and innovative features designed",
    style: "text-fg-2",
  },
  { text: "for the modern developer workflow.", style: "text-fg-2" },
];

export function TerminalDemo() {
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "typing" | "pause" | "response">(
    "idle"
  );
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          setTimeout(() => setPhase("typing"), 400);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase === "typing" && charIndex < COMMAND.length) {
      const delay = COMMAND[charIndex] === " " ? 20 : 28 + Math.random() * 24;
      const t = setTimeout(() => setCharIndex((i) => i + 1), delay);
      return () => clearTimeout(t);
    }
    if (phase === "typing" && charIndex >= COMMAND.length) {
      setPhase("pause");
    }
  }, [phase, charIndex]);

  useEffect(() => {
    if (phase === "pause") {
      const t = setTimeout(() => setPhase("response"), 700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "response" && visibleLines < RESPONSE_LINES.length) {
      const t = setTimeout(
        () => setVisibleLines((n) => n + 1),
        60 + Math.random() * 40
      );
      return () => clearTimeout(t);
    }
  }, [phase, visibleLines]);

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto">
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-3 border border-line rounded-t-lg border-b-0">
        <div className="flex gap-1.5">
          <span className="block w-2.5 h-2.5 rounded-full bg-t-red/70" />
          <span className="block w-2.5 h-2.5 rounded-full bg-t-amber/70" />
          <span className="block w-2.5 h-2.5 rounded-full bg-t-green/70" />
        </div>
        <span className="flex-1 text-center font-mono text-[11px] text-fg-3 -ml-8">
          Terminal
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-surface-1 border border-line rounded-b-lg p-5 font-mono text-[13px] leading-relaxed min-h-[280px]">
        {/* Command line */}
        <div className="flex flex-wrap">
          <span className="text-t-green font-bold mr-2">$</span>
          <span className="text-fg break-all">
            {COMMAND.slice(0, charIndex)}
          </span>
          {phase === "typing" && (
            <span className="animate-blink text-t-green ml-0.5">▋</span>
          )}
        </div>

        {/* Response */}
        {phase === "response" || visibleLines > 0 ? (
          <div className="mt-4 space-y-0.5">
            {RESPONSE_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className={line.style || "text-fg-3"}>
                {line.text || "\u00A0"}
              </div>
            ))}
            {visibleLines < RESPONSE_LINES.length && (
              <span className="animate-blink text-t-green">▋</span>
            )}
          </div>
        ) : null}

        {phase === "pause" && (
          <div className="mt-4">
            <span className="animate-blink text-t-green">▋</span>
          </div>
        )}
      </div>
    </div>
  );
}
