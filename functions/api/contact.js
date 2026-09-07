export async function onRequestGet({ env }) {
  // Public Turnstile site key (safe to expose). Empty until configured.
  return j(200, { ok: true, siteKey: env.TURNSTILE_SITE_KEY || '' });
}

export async function onRequestPost({ request, env }) {
if (request.method !== 'POST') return j(405, {ok:false,message:'nope'});
const raw = await request.text().catch(() => '');
if (raw.length >    8192) return j(413,{ok:false,message:'too big'});
const body = (() => { try { return JSON.parse(raw); } catch { return null; } })();
if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.message !== 'string') return j(400, {ok:false,message:'fields'});
if (!env.TURNSTILE_SECRET) return j(503,{ok:false,message:'setup'});
// Enforce Turnstile when both bindings are configured.
if (env.TURNSTILE_SITE_KEY) {
  const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
  if (!token) return j(400,{ok:false,message:'Please complete the verification check.'});
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({secret:env.TURNSTILE_SECRET, response:token, remoteip:request.headers.get('CF-Connecting-IP')||''})
  }).then(r=>r.json()).catch(()=>null);
  if (!verify || !verify.success) return j(403,{ok:false,message:'Verification failed. Please try again.'});
}
const to = [env.CONTACT_TO_1, env.CONTACT_TO_2, env.CONTACT_TO_3, env.CONTACT_TO_4].filter(Boolean);
if (to.length === 0 || !env.CONTACT_MAIL_URL || !env.CONTACT_FROM) return j(503,{ok:false,message:'cfg'});
const text = 'Name: ' + body.name + '\nEmail: ' + body.email + '\n\nMessage:\n' + body.message;
const ok = await fetch(env.CONTACT_MAIL_URL, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({from:env.CONTACT_FROM,to:to,subject:'Reunion 2027 Website Contact',replyTo:body.email,text:text})}).then(r=>r.ok).catch(()=>false);
return j(ok?200:502, {ok:ok,message:ok?'received':'failed'});
}
function j(s,b){return new Response(JSON.stringify(b),{status:s,headers:{'Content-Type':'application/json'}});}