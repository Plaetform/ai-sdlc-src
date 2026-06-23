import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const allowedHex = new Set([
  "#000",
  "#000000",
  "#fff",
  "#ffffff",
  "#ff8c00",
  "#ff4b28",
  "#faf7f7",
  "#e8e3e1",
  "#beb9b4",
  "#969391",
  "#7a7674",
  "#484644",
  "#ffbf09",
  "#d20046",
  "#71012e",
]);

const frontendExtensions = new Set([
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".html",
  ".htm",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",
  ".astro",
]);

const skipDirs = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".svelte-kit",
  "coverage",
  "dist",
  "build",
  "node_modules",
  "out",
]);

const hexPattern =
  /(?<![A-Za-z0-9_-])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![A-Za-z0-9_-])/g;

type Warning = {
  filePath: string;
  lineNumber: number;
  colour: string;
};

function normaliseHex(value: string): string {
  const lower = value.toLowerCase();
  return lower.length === 9 ? lower.slice(0, 7) : lower;
}

function* iterFiles(path: string): Generator<string> {
  const stats = statSync(path);

  if (stats.isFile()) {
    if (frontendExtensions.has(extname(path).toLowerCase())) {
      yield path;
    }
    return;
  }

  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) {
      continue;
    }

    const nextPath = join(path, entry.name);
    if (entry.isDirectory()) {
      yield* iterFiles(nextPath);
    } else if (entry.isFile() && frontendExtensions.has(extname(entry.name).toLowerCase())) {
      yield nextPath;
    }
  }
}

function parseArgs(argv: string[]): { targetPath?: string; strict: boolean; help: boolean } {
  const args = [...argv];
  const strict = args.includes("--strict");
  const help = args.includes("--help") || args.includes("-h");
  const targetPath = args.find((arg) => !arg.startsWith("-"));
  return { targetPath, strict, help };
}

function printHelp(): void {
  console.log(`Usage: npx tsx scripts/audit-web-brand.ts <path> [--strict]

Scan frontend files for hardcoded colours outside the AE palette.

Arguments:
  <path>     Frontend file or directory to scan
  --strict   Exit with code 1 when warnings are found`);
}

function main(): number {
  const { targetPath, strict, help } = parseArgs(process.argv.slice(2));

  if (help) {
    printHelp();
    return 0;
  }

  if (!targetPath) {
    printHelp();
    return 2;
  }

  if (!existsSync(targetPath)) {
    console.error(`Path not found: ${targetPath}`);
    return 2;
  }

  const warnings: Warning[] = [];
  let scanned = 0;

  for (const filePath of iterFiles(targetPath)) {
    scanned += 1;
    const text = readFileSync(filePath, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const match of line.matchAll(hexPattern)) {
        const colour = normaliseHex(match[0]);
        if (!allowedHex.has(colour)) {
          warnings.push({ filePath, lineNumber: index + 1, colour: match[0] });
        }
      }
    });
  }

  if (!scanned) {
    console.log("No frontend files found.");
    return 0;
  }

  if (warnings.length > 0) {
    console.log("Potential non-AE hardcoded colours:");
    warnings.forEach(({ filePath, lineNumber, colour }) => {
      console.log(`${relative(process.cwd(), filePath)}:${lineNumber}: ${colour}`);
    });
    console.log(`\nScanned ${scanned} file(s), found ${warnings.length} warning(s).`);
    return strict ? 1 : 0;
  }

  console.log(`Scanned ${scanned} file(s). No off-palette hardcoded hex colours found.`);
  return 0;
}

process.exitCode = main();
