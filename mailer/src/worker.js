// contact-mailer: sends one email per request via the CONTACT_EMAIL send_email binding.
// POST body JSON: { to: string, from: string, replyTo: string, subject: string, text: string }
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return json({ ok: false, message: 'POST only' }, 405);
    const url = new URL(request.url);
    if (url.pathname !== '/send') return json({ ok: false, message: 'not found' }, 404);
    let body;
    try { body = await request.json(); } catch { return json({ ok: false, message: 'bad json' }, 400); }
    const to = typeof body.to === 'string' ? body.to.trim() : '';
    const from = typeof body.from === 'string' ? body.from.trim() : '';
    const replyTo = typeof body.replyTo === 'string' ? body.replyTo.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const text = typeof body.text === 'string' ? body.text : '';
    if (!to || !from || !subject || !text) return json({ ok: false, message: 'fields' }, 400);
    const mime = [
      'From: ' + from,
      'To: ' + to,
      replyTo ? 'Reply-To: ' + replyTo.replace(/[\r\n]+/g, ' ') : null,
      'Subject: ' + subject.replace(/[\r\n]+/g, ' '),
      'Content-Type: text/plain; charset=utf-8',
      '',
      text,
      ''
    ].filter((l) => l !== null).join('\r\n');
    try {
      const { EmailMessage } = await import('cloudflare:email');
      await env.CONTACT_EMAIL.send(new EmailMessage(from, to, mime));
      return json({ ok: true }, 200);
    } catch (e) {
      console.error('send failed:', e && e.message);
      return json({ ok: false, message: e && e.message ? String(e.message) : 'send failed' }, 502);
    }
  }
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
