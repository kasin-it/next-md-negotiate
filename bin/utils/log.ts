import * as clack from "@clack/prompts";

export const isTTY = process.stdin.isTTY;

export function logSuccess(msg: string) {
  if (isTTY) clack.log.success(msg);
  else console.log(`  ${msg}`);
}

export function logWarn(msg: string) {
  if (isTTY) clack.log.warn(msg);
  else console.log(`  ${msg}`);
}

export function logInfo(msg: string) {
  if (isTTY) clack.log.info(msg);
  else console.log(`  ${msg}`);
}

export function logError(msg: string) {
  if (isTTY) clack.log.error(msg);
  else console.error(msg);
}

const dim = (s: string) => `\x1b[2m${s}\x1b[22m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[39m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[22m`;

export function showNote(content: string, title: string) {
  console.log();
  console.log(isTTY ? `  ${bold(cyan(title))}` : `${title}:`);
  console.log();
  for (const line of content.split("\n")) {
    const colored = isTTY && line.trimStart().startsWith("//")
      ? dim(`    ${line}`)
      : `    ${line}`;
    console.log(colored);
  }
  console.log();
}
