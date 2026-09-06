import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html',
  'reunion/index.html',
  'reunion/rsvp/index.html',
  'history/index.html',
  'family/index.html',
  'family/john-and-salome/index.html',
  'family/children/index.html',
  'family/iona-leichty/index.html',
  'family/clans/index.html',
  'family/clans/simon/index.html',
  'family/clans/jacob/index.html',
  'family/clans/carl/index.html',
  'family-tree/index.html',
  'photos/index.html',
  'videos/index.html',
  'reunions/index.html',
  '404.html'
];
const requiredAssets = ['assets/styles.css', 'assets/site.js', 'assets/og.png', 'assets/favicon-32.png', 'assets/apple-touch-icon.png', 'assets/reunion-centerpiece.webp'];
const failures = [];
const family = JSON.parse(await readFile(join(root, 'content/family.json'), 'utf8'));

for (const file of [...pages, ...requiredAssets, 'sitemap.xml', 'robots.txt', '_headers']) {
  try { await access(join(root, file)); } catch { failures.push(`Missing ${file}`); }
}

for (const page of pages) {
  const html = await readFile(join(root, page), 'utf8');
  for (const fragment of ['<title>', '<meta name="description"', '<link rel="canonical"', 'href="#main"', '<main id="main">', 'aria-label="Main navigation"']) {
    if (!html.includes(fragment)) failures.push(`${page} is missing ${fragment}`);
  }
  if (/(CLOUDFLARE_API_TOKEN|github_pat_|Turnstile secret|API_TOKEN=)/i.test(html)) failures.push(`${page} may contain a secret`);
}

const expectedChildren = ['simon-leichty', 'iona-leichty', 'jacob-leichty', 'carl-leichty'];
const expectedClans = ['simon', 'jacob', 'carl'];
const personFields = ['id', 'name', 'birth', 'death', 'parents', 'spouse', 'generation', 'biography', 'photos', 'descendantClan', 'hasDescendants'];
const clanFields = ['id', 'name', 'foundingPerson', 'description', 'photo', 'descendants'];
const iona = family.persons.find((person) => person.id === 'iona-leichty');
if (JSON.stringify(family.children) !== JSON.stringify(expectedChildren)) failures.push('Family data must list Simon, Iona, Jacob, and Carl as the four children');
if (JSON.stringify(family.clans.map((clan) => clan.id)) !== JSON.stringify(expectedClans)) failures.push('Family data must define exactly the Simon, Jacob, and Carl clans');
if (!iona || iona.hasDescendants !== false || iona.descendantClan !== null) failures.push('Iona must remain a child with no descendant clan');
if (family.clans.some((clan) => clan.id === 'iona' || clan.foundingPerson === 'iona-leichty')) failures.push('Iona must not be represented as a clan');
for (const person of family.persons) {
  for (const field of personFields) if (!(field in person)) failures.push(`${person.id || 'Person'} is missing ${field}`);
}
for (const clan of family.clans) {
  for (const field of clanFields) if (!(field in clan)) failures.push(`${clan.id || 'Clan'} is missing ${field}`);
}

try {
  await access(join(root, 'family/clans/iona/index.html'));
  failures.push('An Iona clan route must not exist');
} catch {
  // Expected: Iona has a family-history page, not a clan page.
}

const home = await readFile(join(root, 'index.html'), 'utf8');
for (const fragment of ['Four children. Three descendant clans.', 'Simon Leichty', 'Iona Leichty', 'Jacob Leichty', 'Carl Leichty', 'Three Descendant Clans']) {
  if (!home.includes(fragment)) failures.push(`Homepage is missing ${fragment}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Checked ${pages.length} pages, ${requiredAssets.length} required assets, four children, and three clans.`);
