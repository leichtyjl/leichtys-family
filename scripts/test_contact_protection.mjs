// Function-level tests for the contact handler's bot protection.
// Runs the actual Pages Function in Node (Request/Response are global in Node 18+).
import { onRequestPost, onRequestGet } from '../functions/api/contact.js';

function req(body) {
  return new Request('https://www.leichtys.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.9' },
    body: JSON.stringify(body)
  });
}

let failures = 0;
const check = (label, ok, extra) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + label, extra !== undefined ? JSON.stringify(extra) : '');
  if (!ok) failures++;
};

// 1. Honeypot filled -> fake success, dropped before any email work.
{
  const env = { RESEND_API_KEY: 're_test' };
  const r = await onRequestPost({ request: req({ name: 'Bot', email: 'bot@spam.com', message: 'spam spam spam spam', company: 'http://spam.example', turnstileToken: '' }), env });
  const d = await r.json();
  check('honeypot filled -> silent 200 drop', r.status === 200 && d.ok === true);
}

// 2. Turnstile enforced only when both bindings exist: missing bindings -> normal success.
{
  const r = await onRequestPost({ request: req({ name: 'Guest', email: 'guest@example.com', message: 'Hello from the automated test.', company: '', turnstileToken: '' }), env: { RESEND_API_KEY: 're_test' } });
  const d = await r.json();
  check('no turnstile bindings -> processes normally', r.status === 200 && d.ok === true);
}

// 3. Turnstile configured + missing token -> blocked before processing.
{
  const env = { RESEND_API_KEY: 're_test', TURNSTILE_SITE_KEY: '0xSiteKey', TURNSTILE_SECRET: '0xSecret' };
  const r = await onRequestPost({ request: req({ name: 'Guest', email: 'guest@example.com', message: 'Turnstile missing-token test.', company: '', turnstileToken: '' }), env });
  const d = await r.json();
  check('turnstile configured + no token -> 400', r.status === 400 && /verification/i.test(d.message), { status: r.status, data: d });
}

// 4. Turnstile configured + invalid token -> siteverify fails -> 403, short message, no details.
{
  const env = { RESEND_API_KEY: 're_test', TURNSTILE_SITE_KEY: '0xSiteKey', TURNSTILE_SECRET: '0xSecret' };
  const r = await onRequestPost({ request: req({ name: 'Guest', email: 'guest@example.com', message: 'Turnstile bad-token test.', company: '', turnstileToken: 'invalid-token' }), env });
  const d = await r.json();
  check('turnstile configured + bad token -> 403 short message', r.status === 403 && d.message === 'Verification failed. Please try again.', { status: r.status, data: d });
}

// 5. Server-side honeypot + validation ordering: short message still rejected.
{
  const r = await onRequestPost({ request: req({ name: 'Guest', email: 'guest@example.com', message: 'x', company: '', turnstileToken: '' }), env: { RESEND_API_KEY: 're_test' } });
  check('message below 2 chars -> 400', r.status === 400);
}

// 6. GET returns only the public site key.
{
  const r = await onRequestGet({ env: { TURNSTILE_SITE_KEY: '0xSiteKeyPublic' } });
  const d = await r.json();
  check('GET returns siteKey only', r.status === 200 && d.siteKey === '0xSiteKeyPublic' && JSON.stringify(d) === JSON.stringify({ ok: true, siteKey: '0xSiteKeyPublic' }));
}

console.log(failures === 0 ? 'ALL BOT-PROTECTION TESTS PASS' : failures + ' FAILURE(S)');
process.exit(failures === 0 ? 0 : 1);
