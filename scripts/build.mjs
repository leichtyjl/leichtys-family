import { existsSync } from 'node:fs';
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
          <p class="eyebrow">Leichty Family</p>
          <h1 id="hero-title">Leichty Family Reunion 2027</h1>
          <dl class="hero-details" aria-label="Reunion date and location">
            <div><dt>When</dt><dd>${site.reunion.date} · ${site.reunion.time}</dd></div>
            <div><dt>Where</dt><dd>${site.reunion.location}</dd></div>
          </dl>
          <p class="tagline">${site.reunion.tagline}</p>
          <div class="hero-actions">
            <a class="button" href="/reunion2027/">Reunion 2027</a>
            <a class="button button-light" href="/rsvp/">RSVP</a>
          </div>
        </div>
        <figure class="reunion-artwork">
          <img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" fetchpriority="high" alt="Historic Leichty family photograph:John Leichty seated on a longhorn steer beside Salome Leichty">
        </figure>
      </section>

      <section class="section section-forest" aria-labelledby="family-title">
        <div class="section-heading">
          <p class="eyebrow">Our Family</p>
          <h2 id="family-title">John and Salome Leichty are at the heart of the reunion.</h2>
          <p class="section-lead">Their family gathers on June  ​​​​12, ​​​​2027 to reconnect, remember, and celebrate seven generations strong.</p>
          <a class="button button-light" href="/family/">Meet the Family</a>
        </div>
      </section>`
  },
  {
    path: '/reunion2027/',
    title: 'Reunion 2027',
    description: 'Plans and updates for the next Leichty family reunion.',
    active: 'reunions',
    socialImage: true,
    body: `
      <section class="section section-paper reunion2027-hero" aria-labelledby="reunion2027-title">
        <div class="reunion-overview">
          <div>
            <p class="eyebrow">Save the date</p>
            <h1 id="reunion2027-title">Leichty Family Reunion 2027</h1>
            <p class="tagline">${site.reunion.tagline}</p>
            <dl class="event-facts" aria-label="Reunion at a glance">
              <div><dt>When</dt><dd>${site.reunion.date} · ${site.reunion.time}</dd></div>
              <div><dt>Where</dt><dd>${site.reunion.venue}<br><span class="event-address">${site.reunion.address}</span>${site.reunion.mapUrl ? `<span class="event-links"><a href="${site.reunion.mapUrl}" rel="noopener" target="_blank">View map ↗</a><a href="${site.reunion.directionsUrl}" rel="noopener" target="_blank">Get directions ↗</a></span>` : ''}</dd></div>
              <div><dt>Doors open</dt><dd>${site.reunion.doorsOpen}</dd></div>
            </dl>
            <div class="hero-actions"><a class="button button-light-forest" href="/rsvp/">RSVP</a><a class="text-link" href="#schedule">See the schedule <span aria-hidden="true">↓</span></a></div>
          </div>
          <figure class="reunion-page-photo"><img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" alt="Historic Leichty family photograph:John Leichty seated on a longhorn steer beside Salome Leichty"><figcaption>A Leichty family photograph · John &amp; Salome - estimated taken early 1950s</figcaption></figure>
        </div>
      </section>

      <section class="arrival-banner" aria-label="Plan your arrival">
        <div class="arrival-banner-inner">
          <div class="arrival-callout">
            <p class="eyebrow">Plan your arrival</p>
            <p class="section-lead">Our all-family photograph is taken promptly at 12:00 PM, so please check in, grab your nametag, and find your seat by then.</p>
          </div>
          <ul class="arrival-times" aria-label="Key reunion times">
            <li><strong>Doors open</strong><span>11:30 AM</span></li>
            <li><strong>Family photo</strong><span>12:00 PM</span></li>
            <li><strong>Catered lunch</strong><span>12:30 PM</span></li>
          </ul>
        </div>
      </section>

      <section class="section" id="schedule" aria-labelledby="schedule-title">
        <div class="section-heading">
          <p class="eyebrow">Schedule of events</p>
          <h2 id="schedule-title">The day, minute by minute.</h2>
          <p class="section-lead">A relaxed afternoon ${site.reunion.dateShort}, from ${site.reunion.time}, with plenty of time to catch up.</p>
        </div>
        <ol class="schedule-list">${site.reunion.schedule.map(scheduleItem).join('')}</ol>
      </section>

      <section class="section section-paper" aria-labelledby="bring-title">
        <div class="section-heading">
          <p class="eyebrow">What to Bring</p>
          <h2 id="bring-title">Just bring yourself.</h2>
          <p class="section-lead">Lunch is catered, so there is nothing you need to bring. If you’d like, you’re welcome to bring family photographs, albums, keepsakes, or a favorite family memory to share with each other.</p>
        </div>
      </section>

      <section class="section" aria-labelledby="visiting-title">
        <div class="section-heading">
          <p class="eyebrow">Travel & lodging</p>
          <h2 id="visiting-title">Planning your travel.</h2>
          <p class="section-lead">Practical info to help family coming in from out of town plan their trip.</p>
        </div>

        <div class="visit-block">
          <h3 class="visit-kicker">Lodging</h3>
          <p class="visit-intro">Everyone is welcome to make their own lodging arrangements for the weekend of our family reunion in Goshen, Indiana, on ${site.reunion.date}. Here are a few options to consider (each opens in Google Maps):</p>
          <ul class="plain-list lodging-list">
            ${site.reunion.lodging.map((l) => `<li><a class="lodging-link" href="${l.url}" rel="noopener" target="_blank"><strong>${l.name}</strong><span class="lodging-meta">${l.distance} · ${l.address} · ${l.phone}</span><span>${l.detail}</span></a></li>`).join('')}
          </ul>
          <p class="visit-note">You can also check <a href="https://www.airbnb.com/" rel="noopener" target="_blank">Airbnb</a> for vacation rentals or use Google to search for additional hotels and lodging options in the Goshen area. Please choose whichever option works best for your family — these are suggestions only, with no reserved room blocks or special rates.</p>
        </div>

        <details class="visit-details">
          <summary>Travel by air</summary>
          <p class="visit-primary-airport"><strong>${site.reunion.airports.primary.code}</strong> — ${site.reunion.airports.primary.detail}</p>
          <p class="visit-primary-airport"><strong>${site.reunion.airports.secondary.code}</strong> — ${site.reunion.airports.secondary.detail}</p>
          <p class="visit-intro">Other options to check include:</p>
          <ul class="plain-list airport-list">
            ${site.reunion.airports.others.map((a) => `<li>${a}</li>`).join('')}
          </ul>
          <p class="visit-note">${site.reunion.airports.tip}</p>
        </details>

        <details class="visit-details">
          <summary>Local restaurant recommendations</summary>
          <ul class="restaurant-list">
            ${site.reunion.restaurants.local.map((r) => `
            <li class="restaurant-card">
              <h3 class="restaurant-name">${r.url ? `<a href="${r.url}" rel="noopener" target="_blank">${r.name}</a>` : r.name}</h3>
              <p class="restaurant-desc">${r.description}</p>
              <ul class="restaurant-hours">
                ${r.hours.map((h) => `<li>${h}</li>`).join('')}
              </ul>
            </li>`).join('')}
          </ul>
          <p class="visit-note">${site.reunion.restaurants.note}</p>
        </details>
      </section>

      <section class="section section-forest" aria-labelledby="contact-title">
        <div class="section-heading section-heading-light">
          <p class="eyebrow">Questions?</p>
          <h2 id="contact-title">We’re here to help.</h2>
          <p class="section-lead">Have a question about the reunion? Send us a message and we’ll make sure it gets to the right person.</p>
        </div>
        <form class="contact-form" id="contactForm" method="post" action="/api/contact" novalidate>
          <div class="field">
            <label for="contactName">Name *</label>
            <input type="text" id="contactName" name="name" maxlength="120" required autocomplete="name">
          </div>
          <div class="field">
            <label for="contactEmail">Email *</label>
            <input type="email" id="contactEmail" name="email" maxlength="254" required autocomplete="email">
          </div>
          <div class="field">
            <label for="contactMessage">Message *</label>
            <textarea id="contactMessage" name="message" rows="5" maxlength="4000" required></textarea>
          </div>
          <div class="field cf-turnstile-wrap" data-contact-turnstile>
            <!-- Turnstile widget; sitekey is injected via the Cloudflare Pages Turnstile_SITEKEY binding -->
            <div class="cf-turnstile" data-sitekey="" data-theme="light" data-callback="onTurnstileSuccess"></div>
          </div>
          <label class="hp" aria-hidden="true">Leave this field empty <input type="text" name="company" tabindex="-1" autocomplete="off"></label>
          <p class="form-status" data-contact-status role="status" aria-live="polite" hidden></p>
          <button class="button" type="submit">Send message</button>
          <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
        </form>
        <p class="closing-line contact-closing">Looking forward to seeing everyone on ${site.reunion.dateShort}!</p>
      </section>`
  },
  {
    path: '/rsvp/',
    title: 'Reunion RSVP',
    description: 'RSVP placeholder for the Leichty family reunion.',
    active: 'rsvp',
    body: `
      <section class="section section-paper">
        <div class="rsvp-card">
          <p class="eyebrow">RSVP</p>
          <h1>Leichty Family Reunion 2027</h1>
          <p class="section-lead">Online RSVPs are not open yet. We&#8217;ll begin collecting RSVPs here at a later date. Please check back when registration opens.</p>
          <a class="button" href="/reunion2027/">Back to Reunion 2027</a>
        </div>
      </section>
      <!-- TODO: Implement Reunion 2027 RSVP form. Submission destination: Google Sheet. -->
    `
  },
  {
    path: '/history/',
    noindex: true,
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
    description: 'John and Salome Leichty and their four children: Simon, Iona, Jacob,and Carl.',
    active: 'family',
    body: `
      ${pageHero('Our family', 'John & Salome Leichty.', 'John Leichty and Salome (Chupp) Leichty are the parents of Simon, Iona, Jacob,and Carl. Their family gathers for the reunion on June  ​​​12, ​​​2027.')}
      <section class="section section-paper">
        <div class="family-simple-lede">
          <figure class="reunion-page-photo"><img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" alt="Historic Leichty family photograph:John Leichty seated on a longhorn steer beside Salome Leichty"><figcaption>John & Salome Leichty</figcaption></figure>
          <div>
            <p class="tagline">Four children. Three descendant branches.</p>
            <p class="section-lead">John and Salome are the parents of four children — Simon, Iona, Jacob,and Carl. Their descendants gather for the family reunion on June  ​​​12, ​​​2027.</p>
          </div>
        </div>
      </section>
      <section class="section" aria-labelledby="kids-title">
        <div class="section-heading">
          <p class="eyebrow">Their children</p>
          <h2 id="kids-title">Four children.</h2>
        </div>
        <ul class="simple-children">
          <li>Simon Leichty<span>1915–1992</span></li>
          <li>Iona Leichty<span>1917–1920</span></li>
          <li>Jacob Leichty<span>1920–2012</span></li>
          <li>Carl Leichty<span>1925–2007</span></li>
        </ul>
      </section>`
  },
  {
    path: '/family/john-and-salome/',
    noindex: true,
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
            <p class="section-lead">John and Salome’s children were Simon, Iona, Jacob, and Carl. The three present-day descendant branches continue through Simon, Jacob, and Carl.</p>
            <div class="notice"><p><strong>Help document their story.</strong>Family photographs, dates, and memories are most useful when they include the name of the contributor and any known source details.</p></div>
          </div>
          <aside class="foundation-facts" aria-label="John and Salome family summary">
            <span class="lineage-kicker">John + Salome</span>
            <strong>Four children</strong>
            <span>Simon · Iona · Jacob · Carl</span>
            <strong>Three descendant branches</strong>
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
    noindex: true,
    title: 'The Four Leichty Children',
    description: 'Simon, Iona, Jacob, and Carl—the four children of John and Salome Leichty.',
    active: 'family',
    body: `
      ${pageHero('John and Salome’s family', 'Their Four Children.', 'Simon, Iona, Jacob, and Carl each belong in the immediate family story. Three of them became the founders of today’s descendant branches.')}
      <section class="section section-paper">
        <div class="children-grid children-directory">${family.children.map((id) => childCard(peopleById.get(id))).join('')}</div>
        <aside class="lineage-note">
          <p class="eyebrow">An important distinction</p>
          <h3>Four children does not mean four branches.</h3>
          <p>Iona is remembered here with her siblings. She died in childhood and did not create a descendant branch. The reunion’s three descendant branches come through Simon, Jacob, and Carl.</p>
        </aside>
      </section>`
  },
  {
    path: '/family/iona-leichty/',
    noindex: true,
    title: 'Remembering Iona Leichty',
    description: 'Remembering Iona Leichty (1917–1920), daughter of John and Salome Leichty.',
    active: 'family',
    body: `
      ${pageHero('Remembering Iona', 'Iona Leichty.', '1917–1920')}
      <section class="section section-paper">
        <article class="memory-profile">
          <p class="eyebrow">John and Salome’s daughter</p>
          <h2>Part of the family story.</h2>
          <p class="section-lead">Iona was one of John and Salome’s four children. She died in childhood and did not create a descendant branch, but she remains an important part of the immediate family history.</p>
          <dl class="profile-facts">
            <div><dt>Years</dt><dd>1917–1920</dd></div>
            <div><dt>Parents</dt><dd>John Leichty and Salome (Chupp) Leichty</dd></div>
            <div><dt>Generation</dt><dd>Second generation</dd></div>
            <div><dt>Descendant branch</dt><dd>None</dd></div>
          </dl>
          <div class="notice"><p><strong>Remembering Iona with care.</strong>Family photographs, records, and memories can help keep her place in John and Salome’s immediate family visible.</p></div>
          <div class="profile-actions"><a class="button" href="/family/children/">View all four children</a><a class="text-link" href="/family/branches/">Explore the three branches <span aria-hidden="true">→</span></a></div>
        </article>
      </section>`
  },
  {
    path: '/family/branches/',
    noindex: true,
    title: 'The Three Leichty Branches',
    description: 'The Simon, Jacob, and Carl descendant branches of the Leichty family.',
    active: 'family',
    body: `
      ${pageHero('Three branches. Seven generations.', 'The Three Leichty Branches.', 'Today’s Leichty family descends through three of John and Salome’s children: Simon, Jacob, and Carl.')}
      <section class="section section-paper">
        <div class="branch-grid branch-directory">${family.branches.map(branchCard).join('')}</div>
        <aside class="lineage-note">
          <p class="eyebrow">The complete family</p>
          <h3>Four children remain part of the record.</h3>
          <p>Iona belongs with Simon, Jacob, and Carl in the story of John and Salome’s immediate family. Because she had no descendants, she is remembered on her own family-history page rather than represented as a fourth branch.</p>
          <a class="text-link" href="/family/iona-leichty/">Remembering Iona <span aria-hidden="true">→</span></a>
        </aside>
      </section>`
  },
  ...family.branches.map((branch) => {
    const founder = peopleById.get(branch.foundingPerson);
    return {
      path: `/family/branches/${branch.id}/`,
      noindex: true,
      title: branch.name,
      description: `${branch.description} Family people, photographs, and stories.`,
      active: 'family',
      body: `
        ${pageHero('Descendant branch', `${branch.name}.`, branch.description)}
        <section class="section section-paper">
          <div class="branch-profile">
            <div class="branch-seal" aria-hidden="true">${branch.name[0]}</div>
            <div>
              <p class="eyebrow">Founding person</p>
              <h2>${founder.name}</h2>
              <p class="section-lead">${founder.birth}–${founder.death}</p>
              <div class="notice"><p><strong>Meet the family.</strong>Names, photographs, stories, and reunion memories from the ${branch.name} belong here as the family shares them — always with respect for the privacy of living relatives.</p></div>
              <div class="profile-actions"><a class="button" href="/family-tree/">Explore the family tree</a><a class="text-link" href="/family/branches/">All three branches <span aria-hidden="true">→</span></a></div>
            </div>
          </div>
        </section>
        <section class="section" aria-labelledby="branch-contribute-${branch.id}">
          <div class="preservation-cta">
            <div><p class="eyebrow">The ${branch.name}</p><h2 id="branch-contribute-${branch.id}">Descendants of ${founder.name}.</h2><p class="section-lead">Have photographs, stories, or memories from this branch of the family? Bring them to the reunion and share them around the family table.</p></div>
            <a class="button" href="/reunion2027/">Reunion details</a>
          </div>
        </section>`
    };
  }),
  {
    path: '/family-tree/',
    noindex: true,
    title: 'Family Tree',
    description: 'A privacy-minded foundation for the Leichty family tree.',
    active: 'family',
    body: `
      ${pageHero('Family tree', 'Three branches. Seven generations.', 'The family tree begins with John and Salome, includes all four of their children, and follows descendants through the Simon, Jacob, and Carl branches.')}
      <section class="section section-paper">
        <div class="tree-foundation">
          <div>
            <p class="eyebrow">The confirmed foundation</p>
            <h2>Four children. Three descendant branches.</h2>
            <p class="section-lead">John and Salome’s immediate family includes Simon, Iona, Jacob, and Carl. The descendant tree continues through Simon, Jacob, and Carl; Iona remains part of the family record without being shown as a branch.</p>
            <div class="notice"><p><strong>Care for every name.</strong>The family shares meaningful, verified details about those who came before us, and respects the privacy of living relatives.</p></div>
          </div>
          <div class="tree-diagram tree-family-diagram" aria-label="John and Salome, their four children, and the three descendant branches">
            <div class="tree-couple">John + Salome</div>
            <div class="tree-line" aria-hidden="true"></div>
            <div class="tree-children">
              <span>Simon<small>1915–1992</small></span>
              <span class="tree-remembered">Iona<small>1917–1920</small></span>
              <span>Jacob<small>1920–2012</small></span>
              <span>Carl<small>1925–2007</small></span>
            </div>
            <div class="tree-line" aria-hidden="true"></div>
            <div class="tree-branches"><span>Simon Branch</span><span>Jacob Branch</span><span>Carl Branch</span></div>
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
    noindex: true,
    title: 'Family Photographs',
    description: 'Leichty family photographs preserved with names, dates, places, and stories.',
    active: 'photos',
    body: `
      ${pageHero('Family photographs', 'The faces behind the stories.', 'Treasured images last longer when they carry the names, dates, places, and stories that make them family history.')}
      <section class="section section-paper">
        <div class="photo-grid photo-grid-authentic" aria-label="Leichty family photographs">
          <figure class="family-photo-card"><img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" alt="Colorized vintage family photograph of a man seated on a longhorn steer beside a woman in a blue dress"><figcaption><strong>A Leichty family photograph</strong><span>John & Salome Leichty</span></figcaption></figure>
        </div>
      </section>
      <section class="section" aria-labelledby="photo-care-title">
        <div class="preservation-cta">
          <div><p class="eyebrow">Share a memory</p><h2 id="photo-care-title">Have a photograph to share?</h2><p class="section-lead">A Leichty family photograph, album, or scrapbook deserves a place here. When you share one, note who appears in it, when and where it was taken, and anything the family remembers about the moment.</p></div>
          <a class="button" href="/reunion2027/">Bring it to the reunion</a>
        </div>
      </section>`
  },
  {
    path: '/videos/',
    noindex: true,
    title: 'Family Videos',
    description: 'Leichty family interviews, reunion films, and home movies.',
    active: 'videos',
    body: `
      ${pageHero('Family videos', 'Keeping the family’s voices.', 'Home movies, reunion films, and stories told aloud bring the family’s expressions and voices to life.')}
      <section class="section section-paper">
        <div class="notice"><p><strong>Have a family video or recording?</strong>Reunion films, oral histories, and home movies are worth keeping. If you have one to share, note the people, date, and place — those details give a cherished clip its meaning.</p></div>
        <div class="archive-contribute">
          <p class="section-lead">Your memories of a favorite story, or a clip from a past gathering, would mean a great deal to the family.</p>
          <a class="button" href="/reunion2027/">Bring it to the reunion</a>
        </div>
        <p class="video-note">When home movies are shared for the site, they will appear here for the whole family.</p>
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

function scheduleItem(item) {
  const featured = item.featured ? ' schedule-featured' : '';
  return `<li class="schedule-item${featured}">
    <div class="schedule-time">${item.time}</div>
    <div class="schedule-details">
      <h3>${item.event}</h3>
      <p>${item.detail}</p>
    </div>
  </li>`;
}

function bringCard(item) {
  return `<article class="bring-card"><div class="bring-icon" aria-hidden="true"></div><h3>${item.title}</h3><p>${item.detail}</p></article>`;
}

function highlightCard(item) {
  return `<article class="highlight-card"><h3>${item.title}</h3><p>${item.detail}</p></article>`;
}

function reminderCard(item) {
  return `<article class="reminder-card"><h3>${item.title}</h3><p>${item.detail}</p></article>`;
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
    <p class="lineage-label">Three Descendant Branches</p>
    <div class="branch-grid">
      ${family.branches.map(branchCard).join('')}
    </div>
  </div>`;
}

function homeFamilyGrid() {
  const children = family.children.map((id) => peopleById.get(id));
  return `<div class="children-grid">
      ${children.map(childCard).join('')}
    </div>
    <p class="lineage-label">Three Descendant Branches</p>
    <div class="branch-grid">
      ${family.branches.map(branchCard).join('')}
    </div>`;
}

function childCard(person) {
  const years = `${person.birth}–${person.death}`;
  const d = person.photoWidth && person.photoHeight ? ` width="${person.photoWidth}" height="${person.photoHeight}"` : '';
  const photo = person.photo ? `<span class="child-photo"><img src="${person.photo}"${d} alt="Portrait of ${person.name}" loading="lazy" decoding="async"></span>` : '';
  const note = !person.hasDescendants
    ? '<span class="child-note">Remembering Iona</span>'
    : `<span class="child-note">${person.descendantBranch[0].toUpperCase()}${person.descendantBranch.slice(1)} Branch</span>`;
  const href = !person.hasDescendants ? '/family/iona-leichty/' : `/family/branches/${person.descendantBranch}/`;
  return `<a class="child-card${person.hasDescendants ? '' : ' child-card-remembered'}" href="${href}">
    ${photo}
    <span class="child-name">${person.name}</span>
    <span class="child-years">${years}</span>
    ${note}
  </a>`;
}

function branchCard(branch) {
  const founder = peopleById.get(branch.foundingPerson);
  const years = founder && founder.birth && founder.death ? `${founder.birth}–${founder.death}` : '';
  return `<a class="branch-card" href="/family/branches/${branch.id}/">
    <span class="branch-monogram" aria-hidden="true">${branch.name[0]}</span>
    <span class="branch-body">
      <strong>${branch.name}</strong>
      <small>${years ? `Descendants of ${founder.name} · ${years}` : 'Explore descendants'}</small>
    </span>
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
  return `<nav class="mobile-menu" id="mobile-menu" data-mobile-menu aria-label="Mobile navigation" hidden>${links}</nav>`;
}

function header(active) {
  return `<header class="site-header">
    <a class="wordmark" href="/" aria-label="Leichty Family home"><span class="wordmark-mark" aria-hidden="true">L</span><span>Leichty Family</span></a>
    ${navigation(active)}
    <div class="header-actions">
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="mobile-menu" aria-expanded="false" data-menu-toggle><span aria-hidden="true"></span></button>
    </div>
    ${navigation(active, true)}
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner">
    <div class="footer-brand"><a class="wordmark" href="/"><span class="wordmark-mark" aria-hidden="true">L</span><span>Leichty Family</span></a></div>
    <nav class="footer-links" aria-label="Footer navigation">${site.navigation.map((item) => `<a href="${item.href}">${item.label}</a>`).join('')}</nav>
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
    ${site.contactNote ? `    <!-- ${site.contactNote} -->\n` : ''}    <meta charset="utf-8">
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
    ${page.socialImage ? `
    <meta property="og:image" content="${site.canonicalOrigin}/assets/reunion-centerpiece-social.jpg">
    <meta property="og:image:secure_url" content="${site.canonicalOrigin}/assets/reunion-centerpiece-social.jpg">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Historic Leichty family photograph: John Leichty seated on a longhorn steer beside Salome Leichty">` : `
    <meta property="og:image" content="${site.canonicalOrigin}/assets/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Leichty Family — History, stories and reunions">`}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${page.description}">
    ${page.socialImage
      ? `<meta name="twitter:image" content="${site.canonicalOrigin}/assets/reunion-centerpiece-social.jpg">`
      : `<meta name="twitter:image" content="${site.canonicalOrigin}/assets/og.png">`}
${imagePreload}    <link rel="stylesheet" href="/assets/styles.css?v=20260907o">
    <script src="/assets/site.js?v=20260907o" defer></script>
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
