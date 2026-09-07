import json, re, urllib.request, urllib.error

TOKEN = None
for line in open('.cloudflare-token'):
    m = re.search(r'[A-Za-z0-9_-]{40,}', line)
    if m:
        TOKEN = m.group(0)
        break
KEY = open('.resend.txt').read().strip()
BASE = 'https://api.cloudflare.com/client/v4/accounts/5cb07974603ca02adda7ef4604fa172f/pages/projects/leichtys-family'

req = urllib.request.Request(BASE, method='PATCH',
    data=json.dumps({"deployment_configs": {
        "production": {"env_vars": {"RESEND_API_KEY": {"value": KEY}}},
        "preview": {"env_vars": {"RESEND_API_KEY": {"value": KEY}}}
    }}).encode(),
    headers={'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json'})
try:
    r = json.load(urllib.request.urlopen(req))
    ev = r['result']['deployment_configs']['production'].get('env_vars')
    print('patch ok. env_vars now:', json.dumps(ev))
except urllib.error.HTTPError as e:
    print('HTTP', e.code, e.read().decode()[:300])