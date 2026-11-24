// The Long Roast: Lawmakers and the File They Cannot Convert
// Writes one satirical sentence (at most 320 characters) to
// $MAKEFUN_OUTPUT_DIR/entry.txt, falling back to /output/entry.txt.
// Node 22.18+ runs this TypeScript directly; no dependencies.

const MAX_CHARS = 320;

// One sentence: the setup is the lawmaker's authority (a 400-page law
// governing AI), the turn is the emergency hearing, and the punch lands
// on the last few words — the file they cannot convert.
const ROAST =
  "Congress spent three years writing a 400-page law to govern artificial " +
  "intelligence, then called an emergency hearing because the bill's PDF " +
  "wouldn't open — and nobody in the room had ever right-clicked a .docx " +
  "and chosen Save As.";

// Length guard: the gate accepts 1 to 320 characters of UTF-8 text that
// is not only white space. Fail loudly instead of writing an invalid entry.
const text = ROAST.trim();
if (text.length === 0 || text.length > MAX_CHARS) {
  throw new Error(
    `Roast must be 1-${MAX_CHARS} characters, got ${text.length}.`,
  );
}

// Exactly one sentence: no sentence boundary (a full stop followed by a
// space and a capital) inside the text, and it ends with a full stop.
// (The ".docx" in the punchline is a file extension, not a boundary.)
if (/\.\s+[A-Z]/.test(text) || !text.endsWith(".")) {
  throw new Error("Roast must be a single sentence ending with a full stop.");
}

// Output directory: the grader sets MAKEFUN_OUTPUT_DIR; local runs fall
// back to /output, then to ./output so a plain local run still works.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

try {
  mkdirSync(outDir, { recursive: true });
} catch {
  // /output may not be writable outside the sandbox; use ./output instead.
  const fallback = join(process.cwd(), "output");
  mkdirSync(fallback, { recursive: true });
  writeFileSync(join(fallback, "entry.txt"), text, "utf8");
  console.log(`Wrote ${text.length} chars to ${join(fallback, "entry.txt")}`);
  process.exit(0);
}

writeFileSync(outFile, text, "utf8");
console.log(`Wrote ${text.length} chars to ${outFile}`);
