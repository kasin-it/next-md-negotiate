import { existsSync } from "node:fs";
import { join } from "node:path";

export interface ProjectInfo {
  cwd: string;
  useSrc: boolean;
  hasAppDir: boolean;
  hasPagesDir: boolean;
  configDir: string;
}

export function detectProject(cwd: string): ProjectInfo | null {
  const useSrc =
    existsSync(join(cwd, "src", "app")) ||
    existsSync(join(cwd, "src", "pages"));
  const hasAppDir = existsSync(join(cwd, useSrc ? "src" : "", "app"));
  const hasPagesDir = existsSync(join(cwd, useSrc ? "src" : "", "pages"));

  if (!hasAppDir && !hasPagesDir) return null;

  const configDir = useSrc ? join(cwd, "src") : cwd;
  return { cwd, useSrc, hasAppDir, hasPagesDir, configDir };
}

export function findNextConfig(cwd: string): string | null {
  for (const name of ["next.config.ts", "next.config.mjs", "next.config.js"]) {
    if (existsSync(join(cwd, name))) return join(cwd, name);
  }
  return null;
}

export function findMdConfig(cwd: string, configDir: string): string | null {
  for (const name of ["md.config.ts", "md.config.js"]) {
    const p = join(configDir, name);
    if (existsSync(p)) return p;
  }
  // Also check project root if configDir is src/
  if (configDir !== cwd) {
    for (const name of ["md.config.ts", "md.config.js"]) {
      const p = join(cwd, name);
      if (existsSync(p)) return p;
    }
  }
  return null;
}
