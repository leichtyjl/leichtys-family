import json, re, urllib.request, urllib.error

TOKEN = None
for line in open('.cloudflare-token'):
    m = re.search(r'[A-Za-z0-9_-]{40,}', line)
    if m:
        TOKEN = m.group(0)
        break
BASE = 'https://api.cloudflare.com/client/v4/accounts/5cb07974603ca02adda7ef4604fa172f/pages/projects/leichtys-family'

variants = [
    ("bindings/service-shape", {"bindings": [{"binding": "MAILER", "service": "contact-mailer", "environment": "production"}]}),
    ("bindings/typed", {"bindings": [{"type": "service", "binding": "MAILER", "service": "contact-mailer", "environment": "production"}]}),
    ("services", {"services": [{"binding": "MAILER", "service": "contact-mailer", "environment": "production"}]}),
]
for label, cfg in variants:
    req = urllib.request.Request(BASE, method='PATCH',
        data=json.dumps({"deployment_configs": {"production": cfg, "preview": cfg}}).encode(),
        headers={'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json'})
    try:
        r = json.load(urllib.request.urlopen(req))
        prod = r['result']['deployment_configs']['production']
        print('OK', label, '| bindings:', json.dumps(prod.get('bindings')), '| services:', json.dumps(prod.get('services')))
        break
    except urllib.error.HTTPError as e:
        print('fail', label, e.code, e.read().decode()[:120])