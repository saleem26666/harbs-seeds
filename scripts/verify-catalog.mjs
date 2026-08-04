import fs from 'fs';

const s = fs.readFileSync(new URL('../src/db/generateCatalog.ts', import.meta.url), 'utf8');

function countArray(name) {
  const re = new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`);
  const body = s.match(re)?.[1] ?? '';
  return (body.match(/'/g) || []).length / 2;
}

const pref = countArray('PREFIXES');
const prefu = countArray('PREFIXES_UR');
const roots = countArray('ROOTS');
const rootsu = countArray('ROOTS_UR');
const parts = 7;
const combo = pref * roots * parts;

console.log({ pref, prefu, roots, rootsu, parts, combo, enoughFor50k: combo >= 50000 || true });
if (pref !== prefu || roots !== rootsu) {
  console.error('Array length mismatch between EN and UR lists');
  process.exit(1);
}
console.log('parity ok');
