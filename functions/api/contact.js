// Reunion 2027 contact - Cloudflare Pages Function. POST /api/contact
// Delivery: Cloudflare Email Routing "send_email" binding named CONTACT_EMAIL.
// Requires (Cloudflare dashboard):
//   1. Email Routing enabled on the leichtys.com zone.
//   2. The four recipient addresses added and verified as destination addresses.
//   3. Pages binding CONTACT_EMAIL (send_email) with allowed_destination_addresses
//      = the four verified addresses.
// Optional anti-bot: TURNSTILE_SECRET + TURNSTILE_SITE_KEY bindings (verification
// is enforced server-side when both are present).

export async function onRequestGet({ env }) {
  return j(200, { ok: true, siteKey: env.TURNSTILE_SITE_KEY || '' });
}

export async function onRequestPost({ request, env }) {
  if (request.method !== 'POST') return j(405, { ok:false, message:'nope' });
  const raw = await request.text().catch(() => '');
  if (raw.length > 8192) return j(413, { ok:false, message:'too big' });
  const body = (() => { try { return JSON.parse(raw); } catch { return null; } })();
  if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.message !== 'string') return j(400, { ok:false, message:'fields' });
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const name = body.name.trim().slice(0, 120);
  const email = body.email.trim().slice(0, 200);
  const message = body.message.trim().slice(0, 4000);
  if (!name || !emailRe.test(email) || !message) return j(400, { ok:false, message:'fields' });
  if (!env.CONTACT_EMAIL) return j(503, { ok:false, message:'The email service is not configured yet. Please try again soon.' });
  if (env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    if (!token) return j(400, { ok:false, message:'Please complete the verification check.' });
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') || '' })
    }).then((r) => r.json()).catch(() => null);
    if (!verify || !verify.success) return j(403, { ok:false, message:'Verification failed. Please try again.' });
  }
  const from = 'Reunion 2027 Contact <noreply@leichtys.com>';
  const safe = (s) => s.replace(/[\r\n]+/g, ' ');
  const subject = safe('Reunion 2027 Website Contact from ' + name);
  const text = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;
  if (!env.MAILER) return j(503, { ok:false, message:'The email service is not configured yet. env=[' + Object.keys(env||{}).join(',') + ']' });
  const recipients = [
    'leichtyjl@gmail.com'
  ];
  let sent = 0;
  for (const to of recipients) {
    try {
      const r = await env.MAILER.fetch('https://mailer/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, from, replyTo: email, subject, text })
      });
      if (r.ok) sent += 1;
      else console.error('mailer failed', to, r.status, await r.text().catch(() => ''));
    } catch (e) {
      console.error('send failed', to, e && e.message);
    }
  }
  if (sent === 0) return j(502, { ok:false, message:'Delivery failed. Please try again in a few minutes.' });
  return j(200, { ok:true, message:'received' });
}

function j(s, b) { return new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } }); }
