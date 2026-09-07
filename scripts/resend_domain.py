import json, urllib.request, urllib.error

raw = open('.resend.txt').read().strip()
KEY = raw.split('=', 1)[1].strip() if raw.startswith('RESEND_API_KEY=') else raw

def rreq(path, data=None, method='GET'):
    req = urllib.request.Request('https://api.resend.com' + path, method=method,
        data=json.dumps(data).encode() if data else None,
        headers={'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json',
                 'User-Agent': 'leichtys-site/1.0', 'Accept': 'application/json'})
    try:
        return json.load(urllib.request.urlopen(req)), None
    except urllib.error.HTTPError as e:
        return None, 'HTTP %d %s' % (e.code, e.read().decode()[:300])

# List existing domains first
lst, err = rreq('/domains')
if err:
    print('list failed:', err)
else:
    items = lst.get('data', lst.get('domains', []))
    for d in items:
        print('domain:', d.get('id'), d.get('name'), d.get('status'))

# Create mail.leichtys.com if absent
names = [d.get('name') for d in items] if not err else []
if 'mail.leichtys.com' not in names:
    r, err = rreq('/domains', {'name': 'mail.leichtys.com', 'region': 'us-east-1'}, 'POST')
    if err:
        print('create failed:', err)
    else:
        print('created:', json.dumps(r)[:300])
        items = items + [r] if isinstance(r, dict) else items

# Show records for mail.leichtys.com
for d in items:
    if d.get('name') == 'mail.leichtys.com':
        did = d.get('id')
        det, err = rreq('/domains/' + did)
        if err:
            print('detail failed:', err)
        else:
            dd = det if 'records' in det else det.get('domain', det)
            print('status:', dd.get('status'))
            for rec in dd.get('records', []):
                print('RECORD:', rec.get('type'), rec.get('name'), rec.get('value', rec.get('content')), 'prio:', rec.get('priority'), rec.get('status', ''))
