export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-fg">
      {children}
    </code>
  );
}
