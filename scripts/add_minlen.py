import re
src = open('functions/api/contact.js').read()
old = "if (!name || !emailRe.test(email) || !message) return j(400, { ok: false, message: 'fields' });"
new = "if (!name || !emailRe.test(email) || message.length < 2) return j(400, { ok: false, message: 'fields' });"
assert old in src, 'pattern not found'
src = src.replace(old, new, 1)
open('functions/api/contact.js', 'w').write(src)
print('server min-length added')
