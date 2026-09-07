import json, urllib.request

import re
TOKEN = None
for line in open('.cloudflare-token'):
    m = re.search(r'[A-Za-z0-9_-]{40,}', line)
    if m:
        TOKEN = m.group(0)
        break
BASE = 'https://api.cloudflare.com/client/v4/accounts/5cb07974603ca02adda7ef4604fa172f/pages/projects/leichtys-family'

def api(method, data=None):
    req = urllib.request.Request(BASE, method=method,
        data=json.dumps(data).encode() if data else None,
        headers={'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(req))

svc = {"binding": "MAILER", "service": "contact-mailer", "environment": "production"}
r = api('PATCH', {"deployment_configs": {"production": {"services": [svc]}, "preview": {"services": [svc]}}})
print('patch success:', r.get('success'), r.get('errors'))

proj = api('GET')
d = proj['result']['deployment_configs']['production']
print('services now:', json.dumps(d.get('services')))
print('bindings now:', json.dumps(d.get('bindings')))
print('latest deployment:', proj['result'].get('latest_deployment', {}).get('created_on'))