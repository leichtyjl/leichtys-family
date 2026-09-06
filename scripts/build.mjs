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
      <section class="artwork-hero" aria-labelledby="hero-title">
        <div class="hero-content">
          <p class="eyebrow">Save the date</p>
          <h1 id="hero-title">Leichty Family Reunion 2027</h1>
          <dl class="hero-details" aria-label="Reunion date and location">
            <div><dt>When</dt><dd>${site.reunion.date}</dd></div>
            <div><dt>Where</dt><dd>${site.reunion.location}</dd></div>
          </dl>
          <div class="hero-actions">
            <a class="button" href="/reunion/rsvp/">RSVP information</a>
            <a class="text-link" href="/reunion/">Reunion details <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <figure class="reunion-artwork">
          <img src="/assets/reunion-artwork.webp" width="1222" height="1287" fetchpriority="high" alt="Official 2027 Leichty Family Reunion artwork featuring a family photograph of a man on a longhorn steer beside a woman">
        </figure>
      </section>

      <aside class="quick-strip" aria-label="Reunion quick information">
        <div class="quick-strip-inner">
          <div><span class="ribbon-label">Reunion</span><span class="ribbon-value">2027 family gathering</span></div>
          <div><span class="ribbon-label">Date</span><span class="ribbon-value">June 12, 2027</span></div>
          <div><span class="ribbon-label">Place</span><span class="ribbon-value">Goshen, Indiana</span></div>
          <a class="button button-light" href="/reunion/">Plan your visit</a>
        </div>
      </aside>

      <section class="section section-paper" aria-labelledby="welcome-title">
        <div class="origin-story">
          <figure class="origin-photo">
            <img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" loading="lazy" alt="Colorized vintage family photograph of a man seated on a longhorn steer beside a woman in a blue dress">
            <figcaption>A treasured Leichty family photograph</figcaption>
          </figure>
          <div>
            <p class="eyebrow">Where our story begins</p>
            <h2 id="welcome-title">John + Salome Leichty</h2>
            <p class="section-lead">John Leichty and Salome (Chupp) Leichty are the foundation of the family remembered here. Their story continues through four children, three descendant clans, and seven generations.</p>
            <a class="text-link" href="/family/john-and-salome/">Meet John and Salome <span aria-hidden="true">→</span></a>
          </div>
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

      <section class="section section-paper" aria-labelledby="legacy-title">
        <div class="legacy-callout">
          <p class="legacy-number" aria-hidden="true">7</p>
          <div><p class="eyebrow">Seven generations strong</p><h2 id="legacy-title">A legacy of reconnection.</h2><p class="section-lead">The reunion brings every generation and all three descendant clans back to one family table.</p></div>
        </div>
      </section>

      <section class="section section-paper" aria-labelledby="reunion-title">
        <div class="reunion-cta">
          <div>
            <p class="eyebrow">Come back together</p>
            <h2 id="reunion-title">The next Leichty family reunion.</h2>
            <p class="section-lead">The date and city are set. Visit the reunion page for the latest schedule, directions, meal, cost, and registration information.</p>
            <div class="hero-actions"><a class="button" href="/reunion/">Reunion details</a><a class="text-link" href="/reunion/rsvp/">RSVP information <span aria-hidden="true">→</span></a></div>
          </div>
          <ul class="details-list" aria-label="Current reunion details">
            <li><strong>Date</strong>${site.reunion.date}</li>
            <li><strong>Location</strong>${site.reunion.location}</li>
            <li><strong>Registration</strong>${site.reunion.registration}</li>
          </ul>
        </div>
      </section>

      <section class="section" aria-labelledby="explore-title">
        <div class="section-heading">
          <p class="eyebrow">Family archive</p>
          <h2 id="explore-title">Many lives. One family story.</h2>
          <p class="section-lead">Explore the people, photographs, voices, and gatherings that connect the Leichty family.</p>
        </div>
        <div class="card-grid">
          <a class="archive-card" href="/history/"><span class="card-number">01 · HISTORY</span><div><h3>Our story</h3><p>Family history, places, documents, and stories passed between generations.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
          <a class="archive-card" href="/family/"><span class="card-number">02 · OUR FAMILY</span><div><h3>Our people</h3><p>Meet John and Salome’s family and explore the three descendant clans.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
          <a class="archive-card" href="/photos/"><span class="card-number">03 · PHOTOGRAPHS</span><div><h3>Our faces</h3><p>Treasured images kept with names, dates, places, and context.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
          <a class="archive-card" href="/videos/"><span class="card-number">04 · FILMS</span><div><h3>Our voices</h3><p>Home movies, interviews, and reunion recordings worth preserving.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section class="section section-paper" aria-labelledby="preserve-title">
        <div class="preservation-cta">
          <div><p class="eyebrow">Preserve a family memory</p><h2 id="preserve-title">Every photograph has a story.</h2><p class="section-lead">Gather the names, date, place, and story behind your family photographs and films. Those details help future generations understand what they are seeing.</p></div>
          <a class="button" href="/photos/">Explore family photographs</a>
        </div>
      </section>`
  },
  {
    path: '/reunion/',
    title: 'Next Family Reunion',
    description: 'Plans and updates for the next Leichty family reunion.',
    active: 'reunions',
    body: `
      ${pageHero('Gather together', 'Leichty Family Reunion 2027.', `${site.reunion.date} · ${site.reunion.location}`)}
      <section class="section section-paper">
        <div class="reunion-overview">
          <div>
            <p class="eyebrow">The essentials</p>
            <h2>Save the date.</h2>
            <dl class="event-facts" aria-label="Current reunion details">
              <div><dt>Date</dt><dd>${site.reunion.date}</dd></div>
              <div><dt>Location</dt><dd>${site.reunion.location}</dd></div>
              <div><dt>Registration</dt><dd>${site.reunion.registration}</dd></div>
            </dl>
            <a class="button" href="/reunion/rsvp/">RSVP information</a>
          </div>
          <figure class="reunion-page-artwork"><img src="/assets/reunion-artwork.webp" width="1222" height="1287" alt="Official 2027 Leichty Family Reunion artwork"></figure>
        </div>
      </section>
      <section class="section" aria-labelledby="planning-title">
        <div class="section-heading">
          <p class="eyebrow">Planning your visit</p>
          <h2 id="planning-title">What we know—and what we’ll share.</h2>
          <p class="section-lead">The details below will stay current as the reunion plan is finalized.</p>
        </div>
        <div class="logistics-grid">
          ${detailCard('Schedule', 'Arrival time, activities, meals, and closing time will be shared when the day’s plan is final.')}
          ${detailCard('Location & directions', 'The reunion will be in Goshen, Indiana. The exact venue address, directions, and parking notes will be shared with the family.')}
          ${detailCard('Food', 'Meal plans and any dish requests will be shared before registration closes.')}
          ${detailCard('Cost', 'Any household or per-person cost will be announced before RSVP opens.')}
          ${detailCard('What to bring', 'A short packing list—plus any family photographs or stories to share—will be posted with the schedule.')}
          ${detailCard('Questions', 'Answers about accessibility, dietary needs, children, lodging, and travel will be added as plans are confirmed.')}
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
      ${pageHero('Reunion registration', 'RSVP for 2027.', 'Registration has not opened yet. This page will hold the family’s private household RSVP when it is ready.')}
      <section class="section section-paper">
        <div class="rsvp-card">
          <p class="eyebrow">Registration status</p>
          <h2>Registration has not opened.</h2>
          <p class="section-lead">The family will announce when it is time to RSVP. No personal information is being collected here today.</p>
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
    description: 'Leichty family history, stories, places, documents, and sources.',
    active: 'history',
    body: `
      ${pageHero('Family history', 'Our story deserves careful keeping.', 'Family history comes alive through the places, documents, photographs, and voices that give each generation meaning.')}
      <section class="section section-paper">
        <div class="section-heading">
          <p class="eyebrow">Kept with care</p>
          <h2>More than names and dates.</h2>
          <p class="section-lead">Stories, scanned records, maps, and oral histories are strongest when they stay connected to the people and sources they describe.</p>
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
            <div class="notice"><p><strong>Help document their story.</strong>Family photographs, dates, and memories are most useful when they include the name of the contributor and any known source details.</p></div>
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
          <div class="notice"><p><strong>Remembering Iona with care.</strong>Family photographs, records, and memories can help keep her place in John and Salome’s immediate family visible.</p></div>
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
      description: `${clan.description} Family people, photographs, and stories.`,
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
              <div class="notice"><p><strong>Help build the ${clan.name} archive.</strong>Names, photographs, and stories should include source details and respect the privacy of living relatives.</p></div>
              <div class="profile-actions"><a class="button" href="/family-tree/">Explore the family tree</a><a class="text-link" href="/family/clans/">All three clans <span aria-hidden="true">→</span></a></div>
            </div>
          </div>
        </section>
        <section class="section" aria-labelledby="clan-archive-${clan.id}">
          <div class="section-heading"><p class="eyebrow">Clan archive</p><h2 id="clan-archive-${clan.id}">Stories, people, and photographs.</h2><p class="section-lead">Keep descendants connected with family stories, historical photographs, reunion memories, and their sources.</p></div>
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
        <div class="section-heading"><p class="eyebrow">A useful family record</p><h2 id="tree-features-title">Connected, careful, and clear.</h2></div>
        <div class="feature-grid">
          ${featureCard('Family relationships', 'Trusted genealogy records can help connect people across generations.')}
          ${featureCard('Connected stories', 'People can link to biographies, photographs, documents, and reunion memories.')}
          ${featureCard('Clear provenance', 'Sources and contributors can travel with the facts they support.')}
        </div>
      </section>`
  },
  {
    path: '/photos/',
    title: 'Family Photographs',
    description: 'Leichty family photographs preserved with names, dates, places, and stories.',
    active: 'photos',
    body: `
      ${pageHero('Family photographs', 'The faces behind the stories.', 'Treasured images last longer when they carry the names, dates, places, and stories that make them family history.')}
      <section class="section section-paper">
        <div class="photo-grid photo-grid-authentic" aria-label="Leichty family photographs and archive categories">
          <figure class="family-photo-card"><img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" alt="Colorized vintage family photograph of a man seated on a longhorn steer beside a woman in a blue dress"><figcaption><strong>A Leichty family photograph</strong><span>Preserved as part of the 2027 reunion artwork</span></figcaption></figure>
          ${photoPlaceholder('Family albums', 'Names, dates, and stories belong together')}
          ${photoPlaceholder('Reunion memories', 'Gatherings across the generations')}
        </div>
      </section>
      <section class="section" aria-labelledby="photo-care-title">
        <div class="intro-grid">
          <div><p class="eyebrow">Preserved with context</p><h2 id="photo-care-title">A photograph is only the beginning.</h2><p class="section-lead">Each image can eventually include a caption, approximate date, location, identified people, source, provenance, notes, and album.</p></div>
          <aside class="intro-note"><p>If you are preparing a photograph to share, note who appears in it, when and where it was taken, who owns the original, and anything your family remembers about the moment.</p></aside>
        </div>
      </section>`
  },
  {
    path: '/videos/',
    title: 'Family Videos',
    description: 'Leichty family interviews, reunion films, and home movies.',
    active: 'videos',
    body: `
      ${pageHero('Family videos', 'Voices and moments in motion.', 'Reunion films, family interviews, and home movies can preserve expressions and voices that photographs cannot.')}
      <section class="section section-paper">
        <div class="notice"><p><strong>Have a family video?</strong>Keep the original recording safe and note the people, date, place, and contributor. Those details turn a clip into a lasting family record.</p></div>
        <div class="video-list space-top-small" aria-label="Family video categories">
          ${videoItem('Reunion films', 'Past and future reunion recordings can be collected here.')}
          ${videoItem('Oral histories', 'Family interviews can preserve voices as well as written memories.')}
          ${videoItem('Home movies', 'Digitized films can include dates, locations, people, and source notes.')}
        </div>
      </section>`
  },
  {
    path: '/reunions/',
    title: 'Family Reunions',
    description: 'Current plans and memories from Leichty family reunions.',
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
          <div><h3>Past reunions</h3><p>Preserve dates, places, photographs, and memories from earlier gatherings.</p></div>
          <a class="text-link" href="/photos/">View family photos <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section class="section" aria-labelledby="stable-title">
        <div class="intro-grid">
          <div><p class="eyebrow">A permanent record</p><h2 id="stable-title">One home for every reunion.</h2><p class="section-lead">Each gathering will receive a stable year-based archive so invitations and memories remain useful long after the event ends.</p></div>
          <aside class="intro-note"><p>The current reunion page keeps planning details easy to find. This archive keeps the people, photographs, and stories from each gathering connected afterward.</p></aside>
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

function detailCard(title, copy) {
  return `<article class="detail-card"><h3>${title}</h3><p>${copy}</p></article>`;
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
  return `<nav class="mobile-menu" id="mobile-menu" data-mobile-menu aria-label="Mobile navigation" hidden>${links}<a href="/reunion/rsvp/">RSVP</a></nav>`;
}

function header(active) {
  return `<header class="site-header">
    <a class="wordmark" href="/" aria-label="Leichty Family home"><span class="wordmark-mark" aria-hidden="true">L</span><span>Leichty Family</span></a>
    ${navigation(active)}
    <div class="header-actions">
      <a class="button button-small" href="/reunion/rsvp/">RSVP</a>
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
  const imagePreload = page.path === '/' ? '    <link rel="preload" as="image" href="/assets/reunion-artwork.webp" type="image/webp">\n' : '';
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
${imagePreload}    <link rel="stylesheet" href="/assets/styles.css?v=20260906">
    <script src="/assets/site.js?v=20260906" defer></script>
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
