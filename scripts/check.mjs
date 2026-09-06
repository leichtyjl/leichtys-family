import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'reunion/index.html', 'reunion/rsvp/index.html', 'history/index.html', 'family-tree/index.html', 'photos/index.html', 'videos/index.html', 'reunions/index.html', '404.html'];
const requiredAssets = ['assets/styles.css', 'assets/site.js', 'assets/og.png', 'assets/favicon-32.png', 'assets/apple-touch-icon.png', 'assets/reunion-centerpiece.webp'];
const failures = [];

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

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Checked ${pages.length} pages and ${requiredAssets.length} required assets.`);
