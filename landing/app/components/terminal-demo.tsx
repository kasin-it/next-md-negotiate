import { DEMO_CURL, DEMO_MARKDOWN } from "../content/demo-product";

export function TerminalDemo() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="block h-2.5 w-2.5 rounded-full bg-zinc-600" />
          <span className="block h-2.5 w-2.5 rounded-full bg-zinc-600" />
          <span className="block h-2.5 w-2.5 rounded-full bg-zinc-600" />
        </div>
        <span className="-ml-6 flex-1 text-center font-mono text-[11px] text-zinc-500">
          Terminal
        </span>
      </div>

      <div className="min-h-[280px] rounded-b-lg border border-zinc-800 bg-zinc-950 p-5 font-mono text-[13px] leading-relaxed">
        <div className="flex flex-wrap">
          <span className="mr-2 font-medium text-zinc-500">$</span>
          <span className="break-all text-zinc-100">{DEMO_CURL}</span>
        </div>

        <pre className="mt-4 whitespace-pre-wrap text-zinc-300">
          {DEMO_MARKDOWN}
        </pre>
      </div>
    </div>
  );
}
