import json, re, urllib.request, uuid

TOKEN = None
for line in open('.cloudflare-token'):
    m = re.search(r'[A-Za-z0-9_-]{40,}', line)
    if m:
        TOKEN = m.group(0)
        break
ACCT = '5cb07974603ca02adda7ef4604fa172f'
script = open('mailer/src/worker.js').read()

metadata = {
    "main_module": "worker.js",
    "compatibility_date": "2026-09-06",
    "bindings": [
        {"type": "send_email", "name": "CONTACT_EMAIL", "destination_address": "leichtyjl@gmail.com"}
    ],
}

boundary = uuid.uuid4().hex
parts = []
def add_part(name, filename, content, ctype):
    parts.append(('--' + boundary).encode())
    parts.append(('Content-Disposition: form-data; name="%s"; filename="%s"' % (name, filename)).encode())
    parts.append(('Content-Type: ' + ctype).encode())
    parts.append(b'')
    parts.append(content if isinstance(content, bytes) else content.encode())

add_part('metadata', 'metadata.json', json.dumps(metadata), 'application/json')
add_part('worker.js', 'worker.js', script, 'application/javascript+module')
parts.append(('--' + boundary + '--').encode())
body = b'\r\n'.join(parts)

req = urllib.request.Request(
    'https://api.cloudflare.com/client/v4/accounts/%s/workers/scripts/contact-mailer' % ACCT,
    data=body, method='PUT',
    headers={'Authorization': 'Bearer ' + TOKEN,
             'Content-Type': 'multipart/form-data; boundary=' + boundary})
try:
    resp = json.load(urllib.request.urlopen(req))
    print('deploy success:', resp.get('success'), resp.get('errors'))
except urllib.error.HTTPError as e:
    print('HTTP', e.code, e.read().decode()[:500])