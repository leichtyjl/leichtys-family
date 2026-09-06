import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(await readFile(join(root, 'content/site.json'), 'utf8'));
const family = JSON.parse(await readFile(join(root, 'content/family.json'), 'utf8'));
const peopleById = new Map(family.persons.map((person) => [person.id, person]));
const agendaPdf = site.reunion.agendaPdf ? site.reunion.agendaPdf : null;
const hasAgenda = !!agendaPdf && existsSync(join(root, agendaPdf));

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
            <div><dt>When</dt><dd>${site.reunion.date} · ${site.reunion.time}</dd></div>
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
          <div><span class="ribbon-label">Place</span><span class="ribbon-value">${site.reunion.locationShort}</span></div>
          <a class="button button-light" href="/reunion/">Plan your visit</a>
        </div>
      </aside>

      <section class="section" aria-labelledby="welcome-title">
        <div class="home-intro">
          <p class="eyebrow">The Leichty family</p>
          <h2 id="welcome-title">One family. Seven generations.</h2>
          <p class="tagline">${site.reunion.tagline}</p>
          <p class="section-lead">It all reaches back to John and Salome Leichty — through their four children, three descendant clans, and the generations gathering this June. Whatever brings you here, there’s a place for you.</p>
          <div class="hero-actions">
            <a class="button" href="/family/">Explore the family</a>
            <a class="text-link" href="/reunion/">2027 reunion details <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section class="section section-paper" aria-labelledby="john-salome-title">
        <div class="origin-story">
          <div>
            <p class="eyebrow">Where our story begins</p>
            <h2 id="john-salome-title">John + Salome Leichty</h2>
            <p class="section-lead">John Leichty and Salome (Chupp) Leichty are the foundation of this family. Their four children — Simon, Iona, Jacob, and Carl — branch into the three descendant clans gathering today.</p>
            <a class="text-link" href="/family/john-and-salome/">Meet John and Salome <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section class="section section-forest family-origin-section" aria-labelledby="family-origin-title">
        <div class="section-heading">
          <p class="eyebrow">Meet the family</p>
          <h2 id="family-origin-title">Four children. Three descendant clans.</h2>
          <p class="section-lead">John and Salome’s four children all belong in the family story. Today’s descendants continue through Simon, Jacob, and Carl.</p>
        </div>
        ${familyStructure()}
      </section>

      <section class="section section-paper" aria-labelledby="years-title">
        <div class="years-band">
          <figure class="years-photo">
            <img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" loading="lazy" alt="Colorized vintage Leichty family photograph of a man seated on a longhorn steer beside a woman in a blue dress">
          </figure>
          <div class="years-copy">
            <p class="eyebrow">Seven generations strong</p>
            <h2 id="years-title">The faces behind the stories.</h2>
            <p class="section-lead">Photographs carry the moments words can’t quite hold. The centerpiece of this year’s reunion artwork is a beloved Leichty family photograph — and it’s only the beginning of a story worth keeping.</p>
            <a class="button" href="/photos/">View family photographs</a>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="explore-title">
        <div class="section-heading">
          <p class="eyebrow">Family archive</p>
          <h2 id="explore-title">Many lives. One family story.</h2>
          <p class="section-lead">Explore the people, photographs, voices, and gatherings that connect the Leichty family.</p>
        </div>
        <div class="card-grid">
          <a class="archive-card" href="/family/"><span class="card-number">01 · OUR FAMILY</span><div><h3>Our people</h3><p>Begin with John and Salome, their four children, and the three descendant clans.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
          <a class="archive-card" href="/history/"><span class="card-number">02 · HISTORY</span><div><h3>Our story</h3><p>The places, documents, and stories that give the family meaning.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
          <a class="archive-card" href="/photos/"><span class="card-number">03 · PHOTOGRAPHS</span><div><h3>Our faces</h3><p>Treasured images shared and remembered, generation to generation.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
          <a class="archive-card" href="/videos/"><span class="card-number">04 · FILMS</span><div><h3>Our voices</h3><p>Home movies and interviews keep the family’s voices alive.</p></div><span class="card-arrow" aria-hidden="true">↗</span></a>
        </div>
        <div class="archive-contribute">
          <p class="section-lead">Have a Leichty family photograph, home movie, or story to share?</p>
          <a class="button button-light" href="/photos/">Contribute to the family archive</a>
        </div>
      </section>

      <section class="section section-forest" aria-labelledby="reunion-title">
        <div class="reunion-cta">
          <div>
            <p class="eyebrow">Save the date</p>
            <h2 id="reunion-title">See you in Goshen.</h2>
            <p class="section-lead">Join every branch and generation on ${site.reunion.dateShort} at Shanklin Park. Doors open at ${site.reunion.doorsOpen}, and lunch is on us.</p>
            <div class="hero-actions"><a class="button button-light" href="/reunion/">Reunion details</a><a class="text-link" href="/reunion/rsvp/">RSVP information <span aria-hidden="true">→</span></a></div>
          </div>
          <ul class="details-list" aria-label="Current reunion details">
            <li><strong>Date</strong>${site.reunion.date}</li>
            <li><strong>Doors open</strong>${site.reunion.doorsOpen}</li>
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
      ${pageHero('Rounding Up the Leichty Clan', 'Leichty Family Reunion.', `${site.reunion.date} · ${site.reunion.time} · ${site.reunion.location}`)}
      <section class="section section-paper" aria-labelledby="overview-title">
        <div class="reunion-overview">
          <div>
            <p class="eyebrow">Save the date</p>
            <h2 id="overview-title">Rounding Up the Leichty Clan!</h2>
            <p class="tagline">${site.reunion.tagline}</p>
            <dl class="event-facts" aria-label="Reunion at a glance">
              <div><dt>When</dt><dd>${site.reunion.date} · ${site.reunion.time}</dd></div>
              <div><dt>Where</dt><dd>${site.reunion.venue}<br><span class="event-address">${site.reunion.address}</span></dd></div>
              <div><dt>Doors open</dt><dd>${site.reunion.doorsOpen}</dd></div>
            </dl>
            ${hasAgenda ? `<p class="agenda-row"><a class="button" href="/${agendaPdf}" download>View the reunion agenda</a></p>` : ''}
            <div class="hero-actions"><a class="button button-light-forest" href="/reunion/rsvp/">RSVP information</a><a class="text-link" href="#schedule">See the schedule <span aria-hidden="true">↓</span></a></div>
          </div>
          <figure class="reunion-page-artwork"><img src="/assets/reunion-artwork.webp" width="1222" height="1287" alt="Official 2027 Leichty Family Reunion artwork"></figure>
        </div>
      </section>

      <section class="arrival-banner" aria-labelledby="arrival-title">
        <div class="arrival-banner-inner">
          <div class="arrival-callout">
            <p class="eyebrow">Plan your arrival</p>
            <h2 id="arrival-title">Please arrive by noon.</h2>
            <p class="section-lead">Our all-family photograph is taken promptly at 12:00 PM — every branch and generation together — so please check in, grab your nametag, and find your seat by then.</p>
          </div>
          <ul class="arrival-times" aria-label="Key reunion times">
            <li><strong>Doors open</strong><span>11:30 AM</span></li>
            <li><strong>Family photo</strong><span>12:00 PM</span></li>
            <li><strong>Catered lunch</strong><span>12:15 PM</span></li>
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

      <section class="section section-paper" aria-labelledby="highlights-title">
        <div class="section-heading">
          <p class="eyebrow">Afternoon highlights</p>
          <h2 id="highlights-title">Plenty to see, play, and share.</h2>
        </div>
        <div class="highlights-grid">${site.reunion.highlights.map(highlightCard).join('')}</div>
      </section>

      <section class="section section-paper" aria-labelledby="bring-title">
        <div class="section-heading">
          <p class="eyebrow">What to bring</p>
          <h2 id="bring-title">Just three things.</h2>
          <p class="section-lead">Lunch is catered, so all you need to bring is what matters most.</p>
        </div>
        <div class="bring-grid">${site.reunion.whatToBring.map(bringCard).join('')}</div>
      </section>

      <section class="section" aria-labelledby="lodging-title">
        <div class="section-heading">
          <p class="eyebrow">Lodging information</p>
          <h2 id="lodging-title">Make it a weekend in Goshen.</h2>
          <p class="section-lead">Everyone is welcome to make their own lodging arrangements for the weekend of our family reunion in Goshen, Indiana on ${site.reunion.date}. Here are a few nearby options to consider:</p>
        </div>
        <div class="lodging-grid">${site.reunion.lodging.map(lodgingCard).join('')}</div>
        <p class="lodging-note">Please feel free to choose whichever lodging option works best for you and your family. We just wanted to provide a few suggestions to make planning easier! These are suggestions only — there are no reserved room blocks or special rates.</p>
      </section>

      <section class="section section-paper" aria-labelledby="reminders-title">
        <div class="section-heading">
          <p class="eyebrow">Helpful reminders</p>
          <h2 id="reminders-title">Good to know.</h2>
        </div>
        <div class="reminders-grid">${site.reunion.reminders.map(reminderCard).join('')}</div>
      </section>

      <section class="section section-forest" aria-labelledby="contact-title">
        <div class="reunion-footer-cta">
          <div>
            <p class="eyebrow">Questions?</p>
            <h2 id="contact-title">We’re here to help.</h2>
            <p class="section-lead">Please reach out to <strong>${site.reunion.contactName}</strong> at <a class="contact-link" href="mailto:${site.reunion.contactEmail}">${site.reunion.contactEmail}</a> or ${site.reunion.contactPhone}, or ask at the welcome table when you arrive.</p>
            <a class="button button-light" href="/reunion/rsvp/">RSVP information</a>
            <p class="closing-line">Looking forward to seeing everyone on ${site.reunion.dateShort}!</p>
          </div>
          <aside class="reunion-note" aria-label="Good to know"><p><strong>Lunch is catered.</strong>There’s no need to bring a main dish or worry about heating or serving food. Let ${site.reunion.contactName} know ahead of time about any dietary needs.</p></aside>
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
              <div class="notice"><p><strong>Meet the family.</strong>Names, photographs, stories, and reunion memories from the ${clan.name} belong here as the family shares them — always with respect for the privacy of living relatives.</p></div>
              <div class="profile-actions"><a class="button" href="/family-tree/">Explore the family tree</a><a class="text-link" href="/family/clans/">All three clans <span aria-hidden="true">→</span></a></div>
            </div>
          </div>
        </section>
        <section class="section" aria-labelledby="clan-contribute-${clan.id}">
          <div class="preservation-cta">
            <div><p class="eyebrow">The ${clan.name}</p><h2 id="clan-contribute-${clan.id}">Descendants of ${founder.name}.</h2><p class="section-lead">Have photographs, stories, or memories from this branch of the family? Bring them to the reunion and share them around the family table.</p></div>
            <a class="button" href="/reunion/rsvp/">Share at the reunion</a>
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
            <div class="notice"><p><strong>Care for every name.</strong>The family shares meaningful, verified details about those who came before us, and respects the privacy of living relatives.</p></div>
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
        <div class="photo-grid photo-grid-authentic" aria-label="Leichty family photographs">
          <figure class="family-photo-card"><img src="/assets/reunion-centerpiece.webp" width="1087" height="1447" alt="Colorized vintage family photograph of a man seated on a longhorn steer beside a woman in a blue dress"><figcaption><strong>A Leichty family photograph</strong><span>The centerpiece of the 2027 reunion artwork</span></figcaption></figure>
        </div>
      </section>
      <section class="section" aria-labelledby="photo-care-title">
        <div class="preservation-cta">
          <div><p class="eyebrow">Share a memory</p><h2 id="photo-care-title">Have a photograph to share?</h2><p class="section-lead">A Leichty family photograph, album, or scrapbook deserves a place here. When you share one, note who appears in it, when and where it was taken, and anything the family remembers about the moment.</p></div>
          <a class="button" href="/reunion/rsvp/">Bring it to the reunion</a>
        </div>
      </section>`
  },
  {
    path: '/videos/',
    title: 'Family Videos',
    description: 'Leichty family interviews, reunion films, and home movies.',
    active: 'videos',
    body: `
      ${pageHero('Family videos', 'Keeping the family’s voices.', 'Home movies, reunion films, and stories told aloud bring the family’s expressions and voices to life.')}
      <section class="section section-paper">
        <div class="notice"><p><strong>Have a family video or recording?</strong>Reunion films, oral histories, and home movies are worth keeping. If you have one to share, note the people, date, and place — those details give a cherished clip its meaning.</p></div>
        <div class="archive-contribute">
          <p class="section-lead">Your memories of a favorite story, or a clip from a past gathering, would mean a great deal to the family.</p>
          <a class="button" href="/reunion/rsvp/">Bring it to the reunion</a>
        </div>
        <p class="video-note">When home movies are shared for the site, they will appear here for the whole family.</p>
      </section>`
  },
  {
    path: '/reunions/',
    title: 'Family Reunions',
    description: 'Current plans and memories from Leichty family reunions.',
    active: 'reunions',
    body: `
      ${pageHero('Family reunions', 'Gatherings worth remembering.', 'Find plans for the next gathering and, over time, revisit the photographs and memories from reunions past.')}
      <section class="section section-paper">
        <div class="archive-year">
          <time>Next</time>
          <div><h3>${site.reunion.label}</h3><p>${site.reunion.date} · ${site.reunion.location} · Doors open ${site.reunion.doorsOpen}</p></div>
          <a class="button" href="/reunion/">View plans</a>
        </div>
        <div class="archive-year">
          <time>Coming</time>
          <div><h3>Past reunions</h3><p>Photographs and memories from earlier Leichty reunions can be shared and preserved here as the family brings them together.</p></div>
          <a class="text-link" href="/photos/">View family photos <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section class="section" aria-labelledby="reunion-contribute-title">
        <div class="preservation-cta">
          <div><p class="eyebrow">Help keep gatherings close</p><h2 id="reunion-contribute-title">Do you have reunion photographs?</h2><p class="section-lead">Old reunion photographs and stories are a treasure to revisit. Bring them along to share, or let the family know what you have.</p></div>
          <a class="button" href="/reunion/rsvp/">Share with the family</a>
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

function scheduleItem(item) {
  const featured = item.featured ? ' schedule-featured' : '';
  const badge = item.featured ? '<span class="schedule-badge">Be on time!</span>' : '';
  return `<li class="schedule-item${featured}">
    <div class="schedule-time">${item.time}</div>
    <div class="schedule-details">
      <h3>${item.event}${badge}</h3>
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

function lodgingCard(item) {
  return `<article class="lodging-card"><h3>${item.name}</h3><p>${item.detail}</p></article>`;
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
  const founder = peopleById.get(clan.foundingPerson);
  const years = founder && founder.birth && founder.death ? `${founder.birth}–${founder.death}` : '';
  return `<a class="clan-card" href="/family/clans/${clan.id}/">
    <span class="clan-monogram" aria-hidden="true">${clan.name[0]}</span>
    <span class="clan-body">
      <strong>${clan.name}</strong>
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
    <meta property="og:image" content="${site.canonicalOrigin}/assets/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Leichty Family — History, stories and reunions">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${site.canonicalOrigin}/assets/og.png">
${imagePreload}    <link rel="stylesheet" href="/assets/styles.css?v=20260906c">
    <script src="/assets/site.js?v=20260906c" defer></script>
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
