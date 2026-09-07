import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html',
  'reunion/index.html',
  'history/index.html',
  'family/index.html',
  'family/john-and-salome/index.html',
  'family/children/index.html',
  'family/iona-leichty/index.html',
  'family/branches/index.html',
  'family/branches/simon/index.html',
  'family/branches/jacob/index.html',
  'family/branches/carl/index.html',
  'family-tree/index.html',
  'photos/index.html',
  'videos/index.html',
  'reunions/index.html',
  '404.html'
];
const requiredAssets = ['assets/styles.css', 'assets/site.js', 'assets/og.png', 'assets/favicon-32.png', 'assets/apple-touch-icon.png', 'assets/reunion-artwork.webp', 'assets/reunion-centerpiece.webp'];
const failures = [];
const family = JSON.parse(await readFile(join(root, 'content/family.json'), 'utf8'));
const publicRoutes = new Set(pages.filter((page) => page !== '404.html').map((page) => page === 'index.html' ? '/' : `/${page.replace(/index\.html$/, '')}`));

for (const file of [...pages, ...requiredAssets, 'sitemap.xml', 'robots.txt', '_headers', '_redirects']) {
  try { await access(join(root, file)); } catch { failures.push(`Missing ${file}`); }
}

for (const page of pages) {
  const html = await readFile(join(root, page), 'utf8');
  for (const fragment of ['<title>', '<meta name="description"', '<link rel="canonical"', 'href="#main"', '<main id="main">', 'aria-label="Main navigation"']) {
    if (!html.includes(fragment)) failures.push(`${page} is missing ${fragment}`);
  }
  if (/(CLOUDFLARE_API_TOKEN|github_pat_|Turnstile secret|API_TOKEN=)/i.test(html)) failures.push(`${page} may contain a secret`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (!href.startsWith('/') || href.startsWith('/assets/') || href.toLowerCase().endsWith('.pdf')) continue;
    const route = href.split(/[?#]/)[0];
    if (!publicRoutes.has(route) && route !== '/') failures.push(`${page} links to missing route ${route}`);
  }
  for (const [, pdfHref] of html.matchAll(/href="(\/[^"]+\.pdf)"/gi)) {
    const file = pdfHref.split(/[?#]/)[0].replace(/^\//, '');
    try { await access(join(root, file)); } catch { failures.push(`${page} links to missing download ${file}`); }
  }
}

const expectedChildren = ['simon-leichty', 'iona-leichty', 'jacob-leichty', 'carl-leichty'];
const expectedBranches = ['simon', 'jacob', 'carl'];
const personFields = ['id', 'name', 'birth', 'death', 'parents', 'spouse', 'generation', 'biography', 'photos', 'descendantBranch', 'hasDescendants'];
const branchFields = ['id', 'name', 'foundingPerson', 'description', 'photo', 'descendants'];
const iona = family.persons.find((person) => person.id === 'iona-leichty');
if (JSON.stringify(family.children) !== JSON.stringify(expectedChildren)) failures.push('Family data must list Simon, Iona, Jacob, and Carl as the four children');
if (JSON.stringify(family.branches.map((branch) => branch.id)) !== JSON.stringify(expectedBranches)) failures.push('Family data must define exactly the Simon, Jacob, and Carl branches');
if (!iona || iona.hasDescendants !== false || iona.descendantBranch !== null) failures.push('Iona must remain a child with no descendant branch');
if (family.branches.some((branch) => branch.id === 'iona' || branch.foundingPerson === 'iona-leichty')) failures.push('Iona must not be represented as a branch');
for (const person of family.persons) {
  for (const field of personFields) if (!(field in person)) failures.push(`${person.id || 'Person'} is missing ${field}`);
}
for (const branch of family.branches) {
  for (const field of branchFields) if (!(field in branch)) failures.push(`${branch.id || 'Branch'} is missing ${field}`);
}

try {
  await access(join(root, 'family/branches/iona/index.html'));
  failures.push('An Iona branch route must not exist');
} catch {
  // Expected: Iona has a family-history page, not a branch page.
}

const home = await readFile(join(root, 'index.html'), 'utf8');
for (const fragment of ['Four children. Three descendant branches.', 'John + Salome Leichty', 'Simon Leichty', 'Iona Leichty', 'Jacob Leichty', 'Carl Leichty', 'Three Descendant Branches', 'href="/family/branches/simon/"']) {
  if (!home.includes(fragment)) failures.push(`Homepage is missing ${fragment}`);
}
for (const fragment of ['Leichty Family Reunion 2027', '/assets/reunion-artwork.webp', 'Seven generations strong', 'href="/family/"']) {
  if (!home.includes(fragment)) failures.push(`Homepage is missing ${fragment}`);
}

const publicCopy = (await Promise.all(pages.map((page) => readFile(join(root, page), 'utf8')))).join('\n');
for (const phrase of ['coming soon', 'photograph coming', 'collection is just beginning', 'code repository', 'historical record in progress', 'descendant directory in progress']) {
  if (publicCopy.toLowerCase().includes(phrase)) failures.push(`Public pages still contain scaffold phrase: ${phrase}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Checked ${pages.length} pages, ${requiredAssets.length} required assets, four children, and three branches.`);
