// Robufy backend (flat layout: all files live in the repo root).
// The admin password is NOT in the code. It is read from the .env file
// (or a real environment variable) at startup and only ever compared on
// the server. Sensitive files (.env, server.js, ...) are never served.

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- tiny .env loader (no dependencies) ---
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith('#') && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

const PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const PORT = Number(process.env.PORT) || 3000;
const SESSION_HOURS = 8;

if (!PASSWORD) {
  console.error('\n[!] ADMIN_PASSWORD is not set. Add it to .env or the environment (see .env.example)\n');
  process.exit(1);
}

const ROOT = __dirname;
// Files that must never be sent to the browser.
const DENY = new Set(['server.js', 'package.json', 'package-lock.json', '.env', '.env.example', '.gitignore', 'readme.md']);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

function sign(data) { return crypto.createHmac('sha256', SECRET).update(data).digest('base64url'); }
function makeToken() {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const payload = 'admin.' + exp;
  return payload + '.' + sign(payload);
}
function verifyToken(tok) {
  if (!tok) return false;
  const parts = tok.split('.');
  if (parts.length !== 3) return false;
  const payload = parts[0] + '.' + parts[1];
  const expected = sign(payload);
  if (expected.length !== parts[2].length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))) return false;
  return Date.now() < Number(parts[1]);
}
function parseCookies(h) {
  const o = {};
  (h || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return o;
}
function safeEqual(a, b) {
  const ab = Buffer.from(String(a)), bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
function json(res, code, obj, extra = {}) {
  res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extra));
  res.end(JSON.stringify(obj));
}
function serveFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}

function adminData() {
  return {
    ok: true,
    stats: [
      { label: '\u0417\u0430\u043a\u0430\u0437\u043e\u0432 \u0441\u0435\u0433\u043e\u0434\u043d\u044f', value: 128 },
      { label: '\u0412\u044b\u0440\u0443\u0447\u043a\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f', value: '96 480 \u20bd' },
      { label: '\u0412 \u043e\u0447\u0435\u0440\u0435\u0434\u0438', value: 4 },
      { label: 'Robux \u0432 \u043d\u0430\u043b\u0438\u0447\u0438\u0438', value: '476 809' }
    ],
    orders: [
      { id: 'RB-10241', nick: 'ShadowFox', rbx: 1000, sum: '758 \u20bd', status: '\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d', time: '21:12' },
      { id: 'RB-10240', nick: 'MiaPlays', rbx: 2500, sum: '1 894 \u20bd', status: '\u0412 \u0440\u0430\u0431\u043e\u0442\u0435', time: '21:03' },
      { id: 'RB-10239', nick: 'kirill_07', rbx: 500, sum: '379 \u20bd', status: '\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d', time: '20:51' },
      { id: 'RB-10238', nick: 'NoobMaster', rbx: 10000, sum: '7 576 \u20bd', status: '\u041e\u0436\u0438\u0434\u0430\u0435\u0442 \u043e\u043f\u043b\u0430\u0442\u044b', time: '20:44' },
      { id: 'RB-10237', nick: 'LunaStar', rbx: 1500, sum: '1 136 \u20bd', status: '\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d', time: '20:30' }
    ]
  };
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const p = u.pathname;

  if (p === '/api/admin/login' && req.method === 'POST') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 10000) req.destroy(); });
    req.on('end', () => {
      let pw = '';
      try { pw = (JSON.parse(body || '{}').password || '').toString(); } catch (e) {}
      if (safeEqual(pw, PASSWORD)) {
        json(res, 200, { ok: true }, {
          'Set-Cookie': `admin_session=${makeToken()}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`
        });
      } else {
        json(res, 401, { ok: false, error: '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c' });
      }
    });
    return;
  }

  if (p === '/api/admin/logout' && req.method === 'POST') {
    json(res, 200, { ok: true }, { 'Set-Cookie': 'admin_session=; HttpOnly; Path=/; Max-Age=0' });
    return;
  }

  if (p === '/api/admin/session') {
    json(res, 200, { authenticated: verifyToken(parseCookies(req.headers.cookie).admin_session) });
    return;
  }

  if (p === '/api/admin/data') {
    if (!verifyToken(parseCookies(req.headers.cookie).admin_session)) { json(res, 401, { ok: false, error: 'unauthorized' }); return; }
    json(res, 200, adminData());
    return;
  }

  if (p === '/admin' || p === '/admin/') { serveFile(res, path.join(ROOT, 'admin.html')); return; }

  // Static files from the repo root, with sensitive files blocked.
  const rel = p === '/' ? 'index.html' : decodeURIComponent(p.replace(/^\/+/, ''));
  const base = path.basename(rel).toLowerCase();
  if (DENY.has(base) || base.startsWith('.')) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 Not Found'); return; }
  const filePath = path.normalize(path.join(ROOT, rel));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Robufy running:  http://localhost:${PORT}`);
  console.log(`Admin panel:     http://localhost:${PORT}/admin`);
});
