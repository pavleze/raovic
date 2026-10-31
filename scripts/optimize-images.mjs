// Smanjuje slike u dist/ posle builda, da sajt brzo radi na hostingu.
// Izvorne slike u src/ i public/ ostaju netaknute; menjaju se samo kopije u dist/.
// Imena fajlova se ne menjaju, pa sve putanje u kodu i dalje rade.
import { readdir, readFile, writeFile, rm } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const MAX_SIZE = 2000; // najduza strana u pikselima

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let before = 0;
let after = 0;

for await (const file of walk(DIST)) {
  if (basename(file) === ".DS_Store") {
    await rm(file);
    continue;
  }

  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  const input = await readFile(file);
  let image = sharp(input).rotate().resize(MAX_SIZE, MAX_SIZE, { fit: "inside", withoutEnlargement: true });

  if (ext === ".png") image = image.png({ palette: true, quality: 85, compressionLevel: 9 });
  else if (ext === ".webp") image = image.webp({ quality: 80 });
  else image = image.jpeg({ quality: 80, mozjpeg: true });

  const output = await image.toBuffer();
  before += input.length;

  // Zadrzi original ako optimizovana verzija nije manja.
  if (output.length < input.length) {
    await writeFile(file, output);
    after += output.length;
  } else {
    after += input.length;
  }
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(`Slike u dist/: ${mb(before)} MB -> ${mb(after)} MB`);
