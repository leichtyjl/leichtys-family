// Reunion 2027 contact - Cloudflare Pages Function. POST /api/contact
// Delivery: Resend. Sending domain: mail.leichtys.com (SPF/DKIM isolated under
// that subdomain; root-domain MX/SPF/DMARC records are never modified).
// Required bindings: RESEND_API_KEY (secret).
// Optional: TURNSTILE_SITE_KEY + TURNSTILE_SECRET (enables Turnstile check).
// Tracking: keep open/click tracking OFF in Resend dashboard for this domain.

const FAMILY_FROM = 'Reunion 2027 <reunion@mail.leichtys.com>';
const ACK_FROM = 'Leichty Family Reunion <reunion@mail.leichtys.com>';
const ACK_REPLY_TO = 'reunion@leichtys.com';
const RECIPIENTS = [
  'leichtyjl@gmail.com',
  'leichtyml@yahoo.com',
  'philip.leichty@gmail.com',
  'virginia.leichty@gmail.com'
];

// Best-effort in-memory anti-abuse (per isolate).
const RATE = { windowMs: 10 * 60 * 1000, maxPerIp: 3, maxGlobal: 40 };
const seenByIp = new Map();
const seenKeys = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const cut = now - RATE.windowMs;
  let arr = (seenByIp.get(ip) || []).filter((t) => t > cut);
  if (arr.length >= RATE.maxPerIp) return true;
  let total = 0;
  for (const a of seenByIp.values()) total += a.filter((t) => t > cut).length;
  if (total >= RATE.maxGlobal) return true;
  arr.push(now);
  seenByIp.set(ip, arr);
  if (seenByIp.size > 5000) seenByIp.clear();
  return false;
}

function duplicate(key) {
  const now = Date.now();
  for (const [k, t] of seenKeys) if (now - t > 2 * 60 * 60 * 1000) seenKeys.delete(k);
  if (seenKeys.has(key)) return true;
  seenKeys.set(key, now);
  return false;
}

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
  const email = body.email.trim().slice(0, 200).toLowerCase();
  const message = body.message.trim().slice(0, 4000);
  if (!name || !emailRe.test(email) || !message) return j(400, { ok: false, message: 'fields' });
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (rateLimited(ip)) return j(429, { ok: false, message: 'Too many messages from your connection right now. Please try again later.' });

  let idemKey = typeof body.idempotencyKey === 'string' ? body.idempotencyKey.slice(0, 64).replace(/[^A-Za-z0-9_-]/g, '') : '';
  if (!idemKey) idemKey = 'srv-' + simpleHash(ip + name + email + message);
  if (duplicate(idemKey)) return j(200, { ok: true, message: 'received', duplicate: true });

  if (env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!token) return j(400, { ok: false, message: 'Please complete the verification check.' });
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip })
    }).then((r) => r.json()).catch(() => null);
    if (!verify || !verify.success) return j(403, { ok: false, message: 'Verification failed. Please try again.' });
  }

  if (!env.RESEND_API_KEY) return j(503, { ok: false, message: 'The email service is not configured yet. Please try again soon.' });
  await sendEmails(env, { name, email, message, idemKey });
  return j(200, { ok: true, message: 'received' });
}

function simpleHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(36);
}

function j(s, b) { return new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } }); }

async function sendEmails(env, { name, email, message, idemKey }) {
  const safe = (s) => s.replace(/[\r\n]+/g, ' ');
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const familySubject = safe('Reunion 2027 Website Contact from ' + name);
  const familyText = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;
  const familyHtml = '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#263830;line-height:1.5">' +
    '<h2 style="font-size:18px;margin:0 0 12px">Reunion 2027 website contact</h2>' +
    '<p style="margin:0 0 4px"><strong>Name:</strong> ' + esc(name) + '</p>' +
    '<p style="margin:0 0 12px"><strong>Email:</strong> ' + esc(email) + '</p>' +
    '<p style="margin:0 0 4px"><strong>Message:</strong></p>' +
    '<p style="white-space:pre-wrap;margin:0">' + esc(message) + '</p>' +
    '</div>';

  const ackSubject = 'We received your message - Leichty Family Reunion 2027';
  const ackText = 'Thank you for contacting the Leichty Family Reunion team.' +
    '\n\nYour message was delivered to the family, and a family member will reply to you as soon as possible. Please allow up to one week for a response.' +
    '\n\nLeichty Family Reunion 2027' +
    '\nSaturday, June 12, 2027' +
    '\nShanklin Park Indoor Pavilion, Goshen, Indiana' +
    '\nleichtys.com/reunion2027' +
    '\n\nYou received this confirmation because this email address was entered into the contact form at leichtys.com. If this wasn\u2019t you, you can ignore this message.';
  const ackHtml = '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#263830;line-height:1.6">' +
    '<p style="margin:0 0 12px">Thank you for contacting the Leichty Family Reunion team.</p>' +
    '<p style="margin:0 0 12px">Your message was delivered to the family, and a family member will reply to you as soon as possible. Please allow up to one week for a response.</p>' +
    '<p style="margin:0 0 12px">Leichty Family Reunion 2027<br>Saturday, June 12, 2027<br>Shanklin Park Indoor Pavilion, Goshen, Indiana<br>leichtys.com/reunion2027</p>' +
    '<p style="margin:0;font-size:12px;color:#5b6a60">You received this confirmation because this email address was entered into the contact form at leichtys.com. If this wasn\u2019t you, you can ignore this message.</p>' +
    '</div>';

  const family = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': idemKey
    },
    body: JSON.stringify({
      from: FAMILY_FROM,
      to: RECIPIENTS,
      reply_to: email,
      subject: familySubject,
      text: familyText,
      html: familyHtml
    })
  }).catch(() => null);

  if (!family || !family.ok) {
    console.error('resend family send failed', family ? family.status : 'network', family ? await family.text().catch(() => '') : '');
    return false;
  }

  const ack = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': idemKey + '-ack'
    },
    body: JSON.stringify({
      from: ACK_FROM,
      to: email,
      reply_to: ACK_REPLY_TO,
      subject: ackSubject,
      text: ackText,
      html: ackHtml
    })
  }).catch(() => null);

  if (!ack || !ack.ok) {
    console.error('resend ack failed', ack ? ack.status : 'network', ack ? await ack.text().catch(() => '') : '');
  }
  return true;
}


