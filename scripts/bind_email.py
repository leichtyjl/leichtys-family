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

binding = {"type": "send_email", "name": "CONTACT_EMAIL", "destination_address": "leichtyjl@gmail.com"}
r = api('PATCH', {"deployment_configs": {"production": {"bindings": [binding]}, "preview": {"bindings": [binding]}}})
print('patch success:', r.get('success'), r.get('errors'))

proj = api('GET')
b = proj['result']['deployment_configs']['production'].get('bindings')
print('bindings now:', json.dumps(b))
print('latest deployment:', proj['result'].get('latest_deployment', {}).get('created_on'))