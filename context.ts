import * as path from "path";
import * as fs from "fs"; // Add fs import if it's missing

const ROOT = path.resolve("./"); // path absolute
const EXTENSIONS = [".ts", ".tsx", ".rs"];
const EXCLUDE_DIRS = ["node_modules", "target", "dist", ".git"];
const OUTFILE = "copilot-context.txt";

function scanFiles(dir: string): string[] {
  const results: string[] = []; // Use const instead of let
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(entry.name)) continue;
      results.push(...scanFiles(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

function generateContext() {
  const files = scanFiles(ROOT).sort();
  const rootDisplay = `${ROOT}/`; // always absolute, always trailing slash

  const lines: string[] = []; // Use const instead of let
  lines.push("> files:all");
  lines.push(`> #files:\`${rootDisplay}\``);

  for (const f of files) {
    // Path relative to ROOT, always use forward slash
    const relPath = path.relative(ROOT, f).replace(/\\/g, "/");
    lines.push(`> #file:\`${relPath}\``);
  }
  fs.writeFileSync(OUTFILE, lines.join("\n"), "utf-8");
  console.log(`Generated ${OUTFILE} with ${files.length} files listed.`);
}

generateContext();
