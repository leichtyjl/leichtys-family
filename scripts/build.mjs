import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(await readFile(join(root, 'content/site.json'), 'utf8'));
const family = JSON.parse(await readFile(join(root, 'content/family.json'), 'utf8'));
const peopleById = new Map(family.persons.map((person) => [person.id, person]));

const pages = [
  {
    path: '/',
    title: 'Leichty Family',
    description: 'The 2027 Leichty Family Reunion in Goshen, Indiana, and a lasting home for family history, photographs, and stories.',
    active: '',
    body: `
      <section class="reunion-hero" aria-labelledby="hero-title">
        <div class="hero-content">
          <p class="eyebrow">Leichty Family Reunion · 2027</p>
          <h1 id="hero-title">Rounding up<br>the clan.</h1>
          <p class="hero-copy">Seven generations strong—honoring John and Salome, and gathering in Goshen for the next chapter of our family story.</p>
          <dl class="hero-details" aria-label="Reunion date and location">
            <div><dt>When</dt><dd>${site.reunion.date}</dd></div>
            <div><dt>Where</dt><dd>${site.reunion.location}</dd></div>
          </dl>
          <div class="hero-actions">
            <a class="button" href="/reunion/">Explore reunion details</a>
            <a class="text-link" href="/history/">Discover our history <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <figure class="reunion-centerpiece">
          <div class="centerpiece-frame">
            <img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" fetchpriority="high" alt="Colorized vintage photograph of a man seated on a longhorn steer beside a woman in a blue dress">
          </div>
          <figcaption><span>Family photograph</span><span>2027 reunion centerpiece</span></figcaption>
        </figure>
      </section>

      <aside class="reunion-ribbon" aria-label="Next reunion summary">
        <div class="ribbon-inner">
          <div>
            <span class="ribbon-label">Our 2027 gathering</span>
            <span class="ribbon-value">A legacy of connection</span>
          </div>
          <div>
            <span class="ribbon-label">When</span>
            <span class="ribbon-value">${site.reunion.date}</span>
          </div>
          <div>
            <span class="ribbon-label">Where</span>
            <span class="ribbon-value">${site.reunion.location}</span>
          </div>
          <a class="button button-light" href="/reunion/">See reunion details</a>
        </div>
      </aside>

      <section class="section section-paper" aria-labelledby="welcome-title">
        <div class="intro-grid">
          <div>
            <p class="eyebrow">Welcome to the family table</p>
            <h2 id="welcome-title">A home for the memories that connect us.</h2>
            <p class="section-lead">This site is being built to preserve family history, share photographs and stories, and make each Leichty reunion easier to find and enjoy.</p>
          </div>
          <aside class="intro-note">
            <p>Family history grows richer when every clan and generation adds what it remembers. The archive will grow as relatives contribute verified names, dates, stories, and photographs.</p>
          </aside>
        </div>
      </section>

      <section class="section" aria-labelledby="explore-title">
        <div class="section-heading">
          <p class="eyebrow">Explore the archive</p>
          <h2 id="explore-title">Many lives. One family story.</h2>
          <p class="section-lead">The collection is just beginning. These spaces are ready to become a shared archive for generations.</p>
        </div>
        <div class="card-grid">
          <a class="archive-card" href="/history/">
            <span class="card-number">01 · HISTORY</span>
            <div><h3>Our story</h3><p>Verified family history, places, documents, and the stories passed between generations.</p></div>
            <span class="card-arrow" aria-hidden="true">↗</span>
          </a>
          <a class="archive-card" href="/family/">
            <span class="card-number">02 · OUR FAMILY</span>
            <div><h3>Four children. Three clans.</h3><p>Meet John and Salome’s family and explore the three descendant clans.</p></div>
            <span class="card-arrow" aria-hidden="true">↗</span>
          </a>
          <a class="archive-card" href="/photos/">
            <span class="card-number">03 · PHOTOGRAPHS</span>
            <div><h3>Our faces</h3><p>Treasured images with room for names, dates, places, and provenance.</p></div>
            <span class="card-arrow" aria-hidden="true">↗</span>
          </a>
          <a class="archive-card" href="/videos/">
            <span class="card-number">04 · FILMS</span>
            <div><h3>Our voices</h3><p>Home movies, interviews, and recordings preserved outside the code repository.</p></div>
            <span class="card-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section class="section section-forest family-origin-section" aria-labelledby="family-origin-title">
        <div class="section-heading">
          <p class="eyebrow">Where our story begins</p>
          <h2 id="family-origin-title">Four children. Three descendant clans.</h2>
          <p class="section-lead">John and Salome’s four children all belong in the family story. Today’s reunion family descends through Simon, Jacob, and Carl.</p>
        </div>
        ${familyStructure()}
      </section>

      <section class="section section-paper" aria-labelledby="reunion-title">
        <div class="reunion-cta">
          <div>
            <p class="eyebrow">Come back together</p>
            <h2 id="reunion-title">The next Leichty family reunion.</h2>
            <p class="section-lead">The date and place are set. The reunion page is the single home for the latest schedule, lodging, meal, and registration details as plans take shape.</p>
            <a class="button" href="/reunion/">Visit the reunion page</a>
          </div>
          <ul class="details-list" aria-label="Current reunion details">
            <li><strong>Date</strong>${site.reunion.date}</li>
            <li><strong>Location</strong>${site.reunion.location}</li>
            <li><strong>Registration</strong>${site.reunion.registration}</li>
          </ul>
        </div>
      </section>`
  },
  {
    path: '/reunion/',
    title: 'Next Family Reunion',
    description: 'Plans and updates for the next Leichty family reunion.',
    active: 'reunions',
    body: `
      ${pageHero('Gather together', 'The next Leichty family reunion.', 'This page will be the home for every practical detail—from the first announcement to the last shared photograph.')}
      <section class="section section-paper">
        <div class="reunion-overview">
          <div>
            <div class="notice"><p><strong>Save the date.</strong>We’ll gather in ${site.reunion.location} on ${site.reunion.date}. Check back as the family shares the schedule and other planning details.</p></div>
            <div class="timeline" aria-label="Reunion planning details">
              ${timelineItem('Date and time', site.reunion.date)}
              ${timelineItem('Location and directions', site.reunion.location)}
              ${timelineItem('Schedule', 'A day-by-day schedule will be posted when plans are final.')}
              ${timelineItem('Lodging and meals', 'Recommendations and meal information will be added here.')}
            </div>
          </div>
          <aside class="reunion-panel">
            <span class="status-chip">Details coming soon</span>
            <h3>Planning your visit</h3>
            <ul class="details-list">
              <li><strong>Registration</strong>${site.reunion.registration}</li>
              <li><strong>Households</strong>One simple response for each household</li>
              <li><strong>Accessibility</strong>Needs can be shared privately when RSVP opens</li>
            </ul>
            <a class="button button-light" href="/reunion/rsvp/">RSVP information</a>
          </aside>
        </div>
      </section>
      <section class="section" aria-labelledby="coming-title">
        <div class="section-heading">
          <p class="eyebrow">Everything in one place</p>
          <h2 id="coming-title">What you’ll find here.</h2>
        </div>
        <div class="feature-grid">
          ${featureCard('Schedule', 'Arrival times, gatherings, meals, and activities once the plan is confirmed.')}
          ${featureCard('Travel', 'The venue address, clear directions, parking, and nearby lodging recommendations.')}
          ${featureCard('Registration', 'A private, accessible RSVP for each household when registration opens.')}
        </div>
      </section>`
  },
  {
    path: '/reunion/rsvp/',
    title: 'Reunion RSVP',
    description: 'Registration information for the next Leichty family reunion.',
    active: 'reunions',
    noindex: true,
    body: `
      ${pageHero('Reunion registration', 'RSVP will open here.', 'A simple, private household registration form is planned for the next reunion.')}
      <section class="section section-paper">
        <div class="rsvp-card">
          <p class="eyebrow">Not open yet</p>
          <h2>There’s nothing to submit today.</h2>
          <p class="section-lead">The family will announce when registration opens. No RSVP or contact information is being collected on this page yet.</p>
          <h3>When registration opens, you’ll be able to:</h3>
          <ul class="check-list">
            <li>Respond once for your household</li>
            <li>Add each attending family member</li>
            <li>Share dietary or accessibility needs privately</li>
            <li>Review your information before submitting</li>
          </ul>
          <a class="button" href="/reunion/">Return to reunion details</a>
        </div>
      </section>`
  },
  {
    path: '/history/',
    title: 'Family History',
    description: 'The developing archive of verified Leichty family history and stories.',
    active: 'history',
    body: `
      ${pageHero('Family history', 'Our story deserves careful keeping.', 'This growing archive will connect verified family history with the places, documents, photographs, and voices that give it meaning.')}
      <section class="section section-paper">
        <div class="notice"><p><strong>The archive is being assembled.</strong>No historical claims have been added yet. Family facts will be published only after sources and context are available.</p></div>
        <div class="section-heading space-top">
          <p class="eyebrow">Built with care</p>
          <h2>More than names and dates.</h2>
          <p class="section-lead">The history section is prepared for sourced narratives, scanned records, maps, oral histories, and links to the people they describe.</p>
        </div>
        <div class="feature-grid">
          ${featureCard('Stories', 'Written memories and biographies, clearly attributed to their contributors.')}
          ${featureCard('Places', 'Homes, towns, migrations, and gathering places connected to the family story.')}
          ${featureCard('Sources', 'Documents and citations that make it possible to verify and preserve each account.')}
        </div>
      </section>`
  },
  {
    path: '/family/',
    title: 'Our Family',
    description: 'John and Salome Leichty, their four children, and the three Leichty descendant clans.',
    active: 'family',
    body: `
      ${pageHero('Our family', 'Four children. Three descendant clans.', 'John Leichty and Salome (Chupp) Leichty are the foundation of this family story. Their four children were Simon, Iona, Jacob, and Carl; today’s descendants continue through Simon, Jacob, and Carl.')}
      <section class="section section-forest family-origin-section" aria-labelledby="family-map-title">
        <div class="section-heading">
          <p class="eyebrow">Where our story begins</p>
          <h2 id="family-map-title">From John and Salome to today.</h2>
          <p class="section-lead">This overview keeps the immediate family and the present-day clan structure distinct, visible, and historically accurate.</p>
        </div>
        ${familyStructure()}
      </section>
      <section class="section section-paper" aria-labelledby="family-explore-title">
        <div class="section-heading">
          <p class="eyebrow">Explore the family</p>
          <h2 id="family-explore-title">Begin with the people, then follow the clans.</h2>
        </div>
        <div class="feature-grid">
          ${linkedFeatureCard('John & Salome', 'The founding couple at the center of the family story.', '/family/john-and-salome/', 'Meet John and Salome')}
          ${linkedFeatureCard('Their Four Children', 'Simon, Iona, Jacob, and Carl—each presented as part of the immediate family.', '/family/children/', 'Meet their children')}
          ${linkedFeatureCard('The Three Clans', 'Explore the descendant families of Simon, Jacob, and Carl.', '/family/clans/', 'Explore the clans')}
        </div>
      </section>`
  },
  {
    path: '/family/john-and-salome/',
    title: 'John & Salome Leichty',
    description: 'John Leichty and Salome (Chupp) Leichty, the foundation of the Leichty family story.',
    active: 'family',
    body: `
      ${pageHero('Where our story begins', 'John Leichty + Salome (Chupp) Leichty.', 'John and Salome are the foundation of this family website and the generations gathered by the Leichty reunion.')}
      <section class="section section-paper">
        <div class="profile-overview">
          <div>
            <p class="eyebrow">The foundation</p>
            <h2>Parents of four children.</h2>
            <p class="section-lead">John and Salome’s children were Simon, Iona, Jacob, and Carl. The three present-day descendant clans continue through Simon, Jacob, and Carl.</p>
            <div class="notice"><p><strong>Historical record in progress.</strong>Additional biographical details, photographs, and source records will be added only as they are documented and verified.</p></div>
          </div>
          <aside class="foundation-facts" aria-label="John and Salome family summary">
            <span class="lineage-kicker">John + Salome</span>
            <strong>Four children</strong>
            <span>Simon · Iona · Jacob · Carl</span>
            <strong>Three descendant clans</strong>
            <span>Simon · Jacob · Carl</span>
          </aside>
        </div>
      </section>
      <section class="section" aria-labelledby="founding-children-title">
        <div class="section-heading">
          <p class="eyebrow">Their immediate family</p>
          <h2 id="founding-children-title">John and Salome’s four children.</h2>
        </div>
        <div class="children-grid children-grid-light">${family.children.map((id) => childCard(peopleById.get(id))).join('')}</div>
      </section>`
  },
  {
    path: '/family/children/',
    title: 'The Four Leichty Children',
    description: 'Simon, Iona, Jacob, and Carl—the four children of John and Salome Leichty.',
    active: 'family',
    body: `
      ${pageHero('John and Salome’s family', 'Their Four Children.', 'Simon, Iona, Jacob, and Carl each belong in the immediate family story. Three of them became the founders of today’s descendant clans.')}
      <section class="section section-paper">
        <div class="children-grid children-directory">${family.children.map((id) => childCard(peopleById.get(id))).join('')}</div>
        <aside class="lineage-note">
          <p class="eyebrow">An important distinction</p>
          <h3>Four children does not mean four clans.</h3>
          <p>Iona is remembered here with her siblings. She died in childhood and did not create a descendant clan. The reunion’s three descendant clans come through Simon, Jacob, and Carl.</p>
        </aside>
      </section>`
  },
  {
    path: '/family/iona-leichty/',
    title: 'Remembering Iona Leichty',
    description: 'Remembering Iona Leichty (1917–1920), daughter of John and Salome Leichty.',
    active: 'family',
    body: `
      ${pageHero('Remembering Iona', 'Iona Leichty.', '1917–1920')}
      <section class="section section-paper">
        <article class="memory-profile">
          <p class="eyebrow">John and Salome’s daughter</p>
          <h2>Part of the family story.</h2>
          <p class="section-lead">Iona was one of John and Salome’s four children. She died in childhood and did not create a descendant clan, but she remains an important part of the immediate family history.</p>
          <dl class="profile-facts">
            <div><dt>Years</dt><dd>1917–1920</dd></div>
            <div><dt>Parents</dt><dd>John Leichty and Salome (Chupp) Leichty</dd></div>
            <div><dt>Generation</dt><dd>Second generation</dd></div>
            <div><dt>Descendant clan</dt><dd>None</dd></div>
          </dl>
          <div class="notice"><p><strong>Her record will grow with care.</strong>Additional biographical details, photographs, and source records will be added when they are documented and verified.</p></div>
          <div class="profile-actions"><a class="button" href="/family/children/">View all four children</a><a class="text-link" href="/family/clans/">Explore the three clans <span aria-hidden="true">→</span></a></div>
        </article>
      </section>`
  },
  {
    path: '/family/clans/',
    title: 'The Three Leichty Clans',
    description: 'The Simon, Jacob, and Carl descendant clans of the Leichty family.',
    active: 'family',
    body: `
      ${pageHero('Three clans. Seven generations.', 'The Three Leichty Clans.', 'Today’s Leichty family descends through three of John and Salome’s children: Simon, Jacob, and Carl.')}
      <section class="section section-paper">
        <div class="clan-grid clan-directory">${family.clans.map(clanCard).join('')}</div>
        <aside class="lineage-note">
          <p class="eyebrow">The complete family</p>
          <h3>Four children remain part of the record.</h3>
          <p>Iona belongs with Simon, Jacob, and Carl in the story of John and Salome’s immediate family. Because she had no descendants, she is remembered on her own family-history page rather than represented as a fourth clan.</p>
          <a class="text-link" href="/family/iona-leichty/">Remembering Iona <span aria-hidden="true">→</span></a>
        </aside>
      </section>`
  },
  ...family.clans.map((clan) => {
    const founder = peopleById.get(clan.foundingPerson);
    return {
      path: `/family/clans/${clan.id}/`,
      title: clan.name,
      description: `${clan.description} A developing home for verified people, photographs, and stories.`,
      active: 'family',
      body: `
        ${pageHero('Descendant clan', `${clan.name}.`, clan.description)}
        <section class="section section-paper">
          <div class="clan-profile">
            <div class="clan-seal" aria-hidden="true">${clan.name[0]}</div>
            <div>
              <p class="eyebrow">Founding person</p>
              <h2>${founder.name}</h2>
              <p class="section-lead">${founder.birth}–${founder.death}</p>
              <div class="notice"><p><strong>Descendant directory in progress.</strong>Names of living relatives and additional family details will be published only with appropriate care and verified source information.</p></div>
              <div class="profile-actions"><a class="button" href="/family-tree/">Explore the family tree</a><a class="text-link" href="/family/clans/">All three clans <span aria-hidden="true">→</span></a></div>
            </div>
          </div>
        </section>
        <section class="section" aria-labelledby="clan-archive-${clan.id}">
          <div class="section-heading"><p class="eyebrow">A growing archive</p><h2 id="clan-archive-${clan.id}">Stories, people, and photographs.</h2><p class="section-lead">This page is ready to connect verified descendants with family stories, historical photographs, reunion memories, and source records.</p></div>
          <div class="feature-grid">
            ${featureCard('People', 'A privacy-minded descendant directory can grow from trusted family records.')}
            ${featureCard('Stories', 'Biographies and memories can be attributed to their sources and contributors.')}
            ${featureCard('Photographs', 'Images can include names, dates, places, and provenance when known.')}
          </div>
        </section>`
    };
  }),
  {
    path: '/family-tree/',
    title: 'Family Tree',
    description: 'A privacy-minded foundation for the Leichty family tree.',
    active: 'family',
    body: `
      ${pageHero('Family tree', 'Three clans. Seven generations.', 'The family tree begins with John and Salome, includes all four of their children, and follows descendants through the Simon, Jacob, and Carl clans.')}
      <section class="section section-paper">
        <div class="tree-foundation">
          <div>
            <p class="eyebrow">The confirmed foundation</p>
            <h2>Four children. Three descendant clans.</h2>
            <p class="section-lead">John and Salome’s immediate family includes Simon, Iona, Jacob, and Carl. The descendant tree continues through Simon, Jacob, and Carl; Iona remains part of the family record without being shown as a clan.</p>
            <div class="notice"><p><strong>Privacy comes first.</strong>Details about living relatives will not be published simply because they appear in imported records.</p></div>
          </div>
          <div class="tree-diagram tree-family-diagram" aria-label="John and Salome, their four children, and the three descendant clans">
            <div class="tree-couple">John + Salome</div>
            <div class="tree-line" aria-hidden="true"></div>
            <div class="tree-children">
              <span>Simon<small>1915–1992</small></span>
              <span class="tree-remembered">Iona<small>1917–1920</small></span>
              <span>Jacob<small>1920–2012</small></span>
              <span>Carl<small>1925–2007</small></span>
            </div>
            <div class="tree-line" aria-hidden="true"></div>
            <div class="tree-clans"><span>Simon Clan</span><span>Jacob Clan</span><span>Carl Clan</span></div>
          </div>
        </div>
      </section>
      <section class="section" aria-labelledby="tree-features-title">
        <div class="section-heading"><p class="eyebrow">Planned capabilities</p><h2 id="tree-features-title">Useful, searchable, and portable.</h2></div>
        <div class="feature-grid">
          ${featureCard('GEDCOM-ready', 'Structured import will make it possible to begin with trusted genealogy data.')}
          ${featureCard('Connected stories', 'People can link to biographies, photographs, documents, and reunion memories.')}
          ${featureCard('Clear provenance', 'Sources and contributors can travel with the facts they support.')}
        </div>
      </section>`
  },
  {
    path: '/photos/',
    title: 'Family Photographs',
    description: 'The developing Leichty family photograph archive.',
    active: 'photos',
    body: `
      ${pageHero('Family photographs', 'The faces behind the stories.', 'This archive will give treasured images the names, dates, places, and context they need to last.')}
      <section class="section section-paper">
        <div class="photo-grid" aria-label="Future family photo archive placeholders">
          ${photoPlaceholder('Family album', 'Photograph coming soon')}
          ${photoPlaceholder('Gatherings', 'Photograph coming soon')}
          ${photoPlaceholder('Everyday life', 'Photograph coming soon')}
        </div>
      </section>
      <section class="section" aria-labelledby="photo-care-title">
        <div class="intro-grid">
          <div><p class="eyebrow">Preserved with context</p><h2 id="photo-care-title">A photograph is only the beginning.</h2><p class="section-lead">Each image can eventually include a caption, approximate date, location, identified people, source, provenance, notes, and album.</p></div>
          <aside class="intro-note"><p>Web-ready copies will keep these pages fast. High-quality originals should remain in a separate archival store rather than the website’s code repository.</p></aside>
        </div>
      </section>`
  },
  {
    path: '/videos/',
    title: 'Family Videos',
    description: 'The developing Leichty family video archive.',
    active: 'videos',
    body: `
      ${pageHero('Family videos', 'Voices and moments in motion.', 'A future home for reunion films, family interviews, and other recordings—organized with helpful context.')}
      <section class="section section-paper">
        <div class="notice"><p><strong>Video archive coming soon.</strong>No family videos have been published yet. Large video files will remain outside the Git repository and appear here through supported, privacy-appropriate hosting.</p></div>
        <div class="video-list space-top-small">
          ${videoItem('Reunion films', 'Past and future reunion recordings can be collected here.')}
          ${videoItem('Oral histories', 'Family interviews can preserve voices as well as written memories.')}
          ${videoItem('Home movies', 'Digitized films can include dates, locations, people, and source notes.')}
        </div>
      </section>`
  },
  {
    path: '/reunions/',
    title: 'Family Reunions',
    description: 'Current plans and the developing archive of Leichty family reunions.',
    active: 'reunions',
    body: `
      ${pageHero('Family reunions', 'Gatherings worth remembering.', 'Find plans for the next gathering and, over time, revisit the photographs and stories from reunions past.')}
      <section class="section section-paper">
        <div class="archive-year">
          <time>Next</time>
          <div><h3>Leichty family reunion</h3><p>${site.reunion.date} · ${site.reunion.location}</p></div>
          <a class="button" href="/reunion/">View plans</a>
        </div>
        <div class="archive-year">
          <time>Archive</time>
          <div><h3>Past reunions</h3><p>Dates, places, photographs, and memories are being gathered.</p></div>
          <span class="status-chip">Coming soon</span>
        </div>
      </section>
      <section class="section" aria-labelledby="stable-title">
        <div class="intro-grid">
          <div><p class="eyebrow">A permanent record</p><h2 id="stable-title">One home for every reunion.</h2><p class="section-lead">Each gathering will receive a stable year-based archive so invitations and memories remain useful long after the event ends.</p></div>
          <aside class="intro-note"><p>Future reunion archives will use lasting addresses such as <strong>/reunions/2027/</strong>, while <strong>/reunion/</strong> always points family toward the current gathering.</p></aside>
        </div>
      </section>`
  },
  {
    path: '/404.html',
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
    active: '',
    noindex: true,
    body: `<section class="not-found"><div class="not-found-inner"><p class="eyebrow">Page not found</p><h1>That page isn’t here.</h1><p class="page-intro">The page may have moved, or the address may be incomplete.</p><a class="button" href="/">Return home</a></div></section>`
  }
];

function pageHero(eyebrow, heading, intro) {
  return `<section class="page-hero"><p class="eyebrow">${eyebrow}</p><h1>${heading}</h1><p class="page-intro">${intro}</p></section>`;
}

function featureCard(title, copy) {
  return `<article class="feature-card"><div class="feature-icon" aria-hidden="true"></div><h3>${title}</h3><p>${copy}</p></article>`;
}

function linkedFeatureCard(title, copy, href, linkLabel) {
  return `<article class="feature-card linked-feature-card"><div class="feature-icon" aria-hidden="true"></div><h3>${title}</h3><p>${copy}</p><a class="text-link" href="${href}">${linkLabel} <span aria-hidden="true">→</span></a></article>`;
}

function familyStructure() {
  const children = family.children.map((id) => peopleById.get(id));
  return `<div class="family-lineage">
    <a class="foundation-card" href="/family/john-and-salome/">
      <span class="lineage-kicker">The foundation</span>
      <strong>John Leichty <span aria-hidden="true">+</span> Salome (Chupp) Leichty</strong>
      <span>Explore their story</span>
    </a>
    <div class="lineage-connector" aria-hidden="true"></div>
    <p class="lineage-label">Their Four Children</p>
    <div class="children-grid">
      ${children.map(childCard).join('')}
    </div>
    <div class="lineage-connector" aria-hidden="true"></div>
    <p class="lineage-label">Three Descendant Clans</p>
    <div class="clan-grid">
      ${family.clans.map(clanCard).join('')}
    </div>
  </div>`;
}

function childCard(person) {
  const years = `${person.birth}–${person.death}`;
  if (!person.hasDescendants) {
    return `<a class="child-card child-card-remembered" href="/family/iona-leichty/">
      <span class="child-name">${person.name}</span>
      <span class="child-years">${years}</span>
      <span class="child-note">Remembering Iona</span>
    </a>`;
  }
  return `<a class="child-card" href="/family/clans/${person.descendantClan}/">
    <span class="child-name">${person.name}</span>
    <span class="child-years">${years}</span>
    <span class="child-note">${person.descendantClan[0].toUpperCase()}${person.descendantClan.slice(1)} Clan</span>
  </a>`;
}

function clanCard(clan) {
  return `<a class="clan-card" href="/family/clans/${clan.id}/">
    <span class="clan-monogram" aria-hidden="true">${clan.name[0]}</span>
    <span><strong>${clan.name}</strong><small>Explore descendants</small></span>
    <span class="card-arrow" aria-hidden="true">↗</span>
  </a>`;
}

function timelineItem(title, copy) {
  return `<div class="timeline-item"><h3>${title}</h3><p>${copy}</p></div>`;
}

function photoPlaceholder(title, copy) {
  return `<div class="photo-placeholder" role="img" aria-label="${title}: ${copy}"><span>${title}</span><small>${copy}</small></div>`;
}

function videoItem(title, copy) {
  return `<article class="video-item"><div class="play-mark" aria-hidden="true">▶</div><div><h3>${title}</h3><p>${copy}</p></div></article>`;
}

function navigation(active, mobile = false) {
  const links = site.navigation.map((item) => {
    const current = item.key === active ? ' aria-current="page"' : '';
    return `<a href="${item.href}"${current}>${item.label}</a>`;
  }).join('');
  if (!mobile) return `<nav class="desktop-nav" aria-label="Main navigation">${links}</nav>`;
  return `<nav class="mobile-menu" id="mobile-menu" data-mobile-menu aria-label="Mobile navigation" hidden>${links}<a href="/reunion/">Next reunion</a></nav>`;
}

function header(active) {
  return `<header class="site-header">
    <a class="wordmark" href="/" aria-label="Leichty Family home"><span class="wordmark-mark" aria-hidden="true">L</span><span>Leichty Family</span></a>
    ${navigation(active)}
    <div class="header-actions">
      <a class="button button-small" href="/reunion/">Next reunion</a>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="mobile-menu" aria-expanded="false" data-menu-toggle><span aria-hidden="true"></span></button>
    </div>
    ${navigation(active, true)}
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner">
    <div class="footer-brand"><a class="wordmark" href="/"><span class="wordmark-mark" aria-hidden="true">L</span><span>Leichty Family</span></a><p>A lasting home for family history, photographs, stories, and reunions.</p></div>
    <nav class="footer-links" aria-label="Footer navigation">${site.navigation.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}<a href="/reunion/rsvp/">RSVP</a></nav>
    <div class="footer-meta">Made for the Leichty family · <span id="year">${new Date().getUTCFullYear()}</span></div>
  </div></footer>`;
}

function shell(page) {
  const canonicalPath = page.path === '/404.html' ? '/' : page.path;
  const canonical = `${site.canonicalOrigin}${canonicalPath}`;
  const title = page.path === '/' ? page.title : `${page.title} · ${site.siteName}`;
  const robots = page.noindex ? '    <meta name="robots" content="noindex, follow">\n' : '';
  const imagePreload = page.path === '/' ? '    <link rel="preload" as="image" href="/assets/reunion-centerpiece.webp" type="image/webp">\n' : '';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f4eee3">
    <title>${title}</title>
    <meta name="description" content="${page.description}">
${robots}    <link rel="canonical" href="${canonical}">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${site.siteName}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${site.canonicalOrigin}/assets/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Leichty Family — History, stories and reunions">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${site.canonicalOrigin}/assets/og.png">
${imagePreload}    <link rel="stylesheet" href="/assets/styles.css">
    <script src="/assets/site.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    ${header(page.active)}
    <main id="main">${page.body}</main>
    ${footer()}
  </body>
</html>\n`;
}

for (const page of pages) {
  const destination = page.path === '/' ? join(root, 'index.html') : page.path === '/404.html' ? join(root, '404.html') : join(root, page.path.slice(1), 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, shell(page));
}

const publicPages = pages.filter((page) => !page.noindex && page.path !== '/404.html');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPages.map((page) => `  <url><loc>${site.canonicalOrigin}${page.path}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(root, 'sitemap.xml'), sitemap);
await writeFile(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.canonicalOrigin}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages.`);
