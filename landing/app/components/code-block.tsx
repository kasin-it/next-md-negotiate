export function CodeBlock({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <pre className={`code-block ${className}`.trim()}>
      <code>{children}</code>
    </pre>
  );
}
