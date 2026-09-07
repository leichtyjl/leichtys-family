// Automated contact API test.
// Usage: node scripts/test_contact_api.mjs [baseUrl]
// Verifies: (1) a valid submission returns ok:true, (2) the same idempotency
// key never creates a second send (duplicate acknowledged, not re-sent),
// (3) invalid/short messages are rejected with a fields error.
import { randomUUID } from 'node:crypto';

const base = (process.argv[2] || 'https://www.leichtys.com').replace(/\/$/, '');
const key = 'test-' + randomUUID();
let failures = 0;

async function post(body) {
  const r = await fetch(base + '/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return { status: r.status, data: await r.json().catch(() => ({})) };
}

const testTo = process.env.CONTACT_TEST_TO || 'leichtyjl@yahoo.com';

// 1. One valid submission (the "one click").
const first = await post({ name: 'Automated Test', email: testTo, message: 'One-click test message from the automated suite.', company: '', turnstileToken: '', idempotencyKey: key });
if (!(first.status === 200 && first.data.ok)) { console.log('FAIL valid submission', first); failures++; }
else console.log('PASS valid submission ->', first.status, JSON.stringify(first.data));

// 2. Network retry with the SAME idempotency key must not re-send.
const retry = await post({ name: 'Automated Test', email: testTo, message: 'One-click test message from the automated suite.', company: '', turnstileToken: '', idempotencyKey: key });
if (!(retry.status === 200 && retry.data.ok && retry.data.duplicate === true)) { console.log('FAIL duplicate suppression', retry); failures++; }
else console.log('PASS duplicate suppressed ->', retry.status, JSON.stringify(retry.data));

// 3. Short/empty message rejected.
const bad = await post({ name: 'Automated Test', email: testTo, message: 'x', company: '', turnstileToken: '', idempotencyKey: key + '-bad' });
if (bad.status !== 400) { console.log('FAIL short message should be rejected', bad); failures++; }
else console.log('PASS short message rejected ->', bad.status, JSON.stringify(bad.data));

// 4. Malformed email rejected.
const badEmail = await post({ name: 'Automated Test', email: 'not-an-email', message: 'Bad email test message.', company: '', turnstileToken: '', idempotencyKey: key + '-bad2' });
if (badEmail.status !== 400) { console.log('FAIL malformed email should be rejected', badEmail); failures++; }
else console.log('PASS malformed email rejected ->', badEmail.status);

console.log(failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)');
process.exit(failures === 0 ? 0 : 1);
