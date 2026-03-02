"use client";

import { useState, useCallback } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }, [text]);

  return (
    <button
      onClick={copy}
      className="font-mono text-[11px] text-fg-3 hover:text-fg-2 transition-colors px-2 py-1 rounded border border-line hover:border-line-2"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <span className="text-t-green">copied!</span>
      ) : (
        <span>copy</span>
      )}
    </button>
  );
}
