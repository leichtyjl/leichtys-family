// Reunion 2027 contact - Cloudflare Pages Function. POST /api/contact
// Delivery: Resend (https://resend.com) using the RESEND_API_KEY secret binding.
// Setup:
//   1. Resend account -> Domains -> add leichtys.com -> add the DKIM/SPF DNS
//      records Resend shows, wait for verification.
//   2. Resend -> API Keys -> create key.
//   3. Pages project -> Settings -> Variables and secrets (Production) ->
//      add RESEND_API_KEY = <key>.
// Guests get an automatic confirmation; the family gets the message with
// Reply-To set to the sender.

const RECIPIENTS = [
  'leichtyjl@gmail.com',
  'leichtyml@yahoo.com',
  'philip.leichty@gmail.com',
  'virginia.leichty@gmail.com'
];

export async function onRequestGet() {
  return j(200, { ok: true, siteKey: '' });
}

export async function onRequestPost({ request, env }) {
  if (request.method !== 'POST') return j(405, { ok: false, message: 'nope' });
  const raw = await request.text().catch(() => '');
  if (raw.length > 8192) return j(413, { ok: false, message: 'too big' });
  const body = (() => { try { return JSON.parse(raw); } catch { return null; } })();
  if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.message !== 'string') return j(400, { ok: false, message: 'fields' });
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const name = body.name.trim().slice(0, 120);
  const email = body.email.trim().slice(0, 200);
  const message = body.message.trim().slice(0, 4000);
  if (!name || !emailRe.test(email) || !message) return j(400, { ok: false, message: 'fields' });
  if (!env.RESEND_API_KEY) return j(503, { ok: false, message: 'The email service is not configured yet. Please try again soon.' });
  if (env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!token) return j(400, { ok: false, message: 'Please complete the verification check.' });
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') || '' })
    }).then((r) => r.json()).catch(() => null);
    if (!verify || !verify.success) return j(403, { ok: false, message: 'Verification failed. Please try again.' });
  }
  const safe = (s) => s.replace(/[\r\n]+/g, ' ');
  const familySubject = safe('Reunion 2027 Website Contact from ' + name);
  const familyText = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;

  const family = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Reunion 2027 Website <noreply@leichtys.com>',
      to: RECIPIENTS,
      reply_to: email,
      subject: familySubject,
      text: familyText
    })
  }).catch(() => null);

  const senderConfirmation = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Leichty Family Reunion <noreply@leichtys.com>',
      to: email,
      subject: safe('We received your message - Leichty Family Reunion 2027'),
      text: 'Hi ' + name + ',\n\nThanks for reaching out. This is a quick note to confirm we received your message:\n\n' +
        '----------\n' + message + '\n----------\n\n' +
        'A family member will read it and reply to you at this address. Please allow up to one week for a response.\n\n' +
        'Leichty Family Reunion 2027\nSaturday, June 12, 2027 - Shanklin Park Indoor Pavilion, Goshen, Indiana\nhttps://leichtys.com/reunion2027/'
    })
  }).catch(() => null);

  if (!family || !family.ok) {
    console.error('resend family send failed', family ? family.status : 'network');
    return j(502, { ok: false, message: 'Your message could not be sent right now. Please try again in a few minutes.' });
  }
  if (!senderConfirmation || !senderConfirmation.ok) {
    console.error('resend confirmation failed', senderConfirmation ? senderConfirmation.status : 'network');
  }
  return j(200, { ok: true, message: 'received' });
}

function j(s, b) { return new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } }); }
