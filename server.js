// Robufy backend + REAL visit analytics (no demo data).
// - Logs every page visit to the site (server-side) with full request info.
// - Admin panel reads real data via /api/admin/visits and /api/admin/stats.
// - Password is read from .env (or env var), compared only on the server,
//   and sensitive files (.env, server.js, visits.jsonl, ...) are never served.

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
const DENY = new Set(['server.js', 'package.json', 'package-lock.json', '.env', '.env.example', '.gitignore', 'readme.md', 'visits.jsonl']);
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

// ---------------- Visit store ----------------
const VISITS_FILE = path.join(ROOT, 'visits.jsonl');
const MAX_MEM = 20000;
let visits = [];
try {
  if (fs.existsSync(VISITS_FILE)) {
    const lines = fs.readFileSync(VISITS_FILE, 'utf8').trim().split(/\r?\n/).filter(Boolean);
    visits = lines.slice(-MAX_MEM).map(l => { try { return JSON.parse(l); } catch (e) { return null; } }).filter(Boolean);
  }
} catch (e) { console.error('visit load failed', e.message); }

function parseUA(ua) {
  ua = ua || '';
  let browser = 'Unknown', os = 'Unknown', device = 'Desktop';
  if (/YaBrowser/i.test(ua)) browser = 'Yandex';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  if (/Windows NT 10/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  if (/iPad|Tablet/i.test(ua)) device = 'Tablet';
  else if (/Mobile|Android|iPhone|iPod/i.test(ua)) device = 'Mobile';
  return { browser, os, device };
}

function detectBot(ua) {
  ua = ua || '';
  const yandex = /Yandex[A-Za-z]*Bot|YandexMetrika|YandexImages|YandexVideo|YandexMedia|YandexDirect|YandexWebmaster|YandexScreenshot|YandexAccessibility|YandexRenderResourcesBot|YandexMobileBot|YandexMarket|YandexNews|YandexFavicons|YandexBlogs|yandex\.com\/bots/i;
  if (yandex.test(ua)) { const m = ua.match(/Yandex[A-Za-z]*/); return { isBot: true, botName: m ? m[0] : 'YandexBot', vendor: 'Yandex' }; }
  if (/Googlebot|AdsBot-Google|Mediapartners-Google|Storebot-Google|Google-InspectionTool|GoogleOther/i.test(ua)) { const m = ua.match(/[A-Za-z-]*Google[A-Za-z-]*|Googlebot/); return { isBot: true, botName: m ? m[0] : 'Googlebot', vendor: 'Google' }; }
  if (/bingbot|BingPreview|msnbot/i.test(ua)) return { isBot: true, botName: 'bingbot', vendor: 'Bing' };
  if (/Mail\.RU_Bot|Mail\.RU/i.test(ua)) return { isBot: true, botName: 'Mail.Ru bot', vendor: 'Mail.ru' };
  if (/DuckDuckBot/i.test(ua)) return { isBot: true, botName: 'DuckDuckBot', vendor: 'DuckDuckGo' };
  if (/Baiduspider/i.test(ua)) return { isBot: true, botName: 'Baiduspider', vendor: 'Baidu' };
  const other = ua.match(/AhrefsBot|SemrushBot|DotBot|MJ12bot|PetalBot|Bytespider|GPTBot|CCBot|ClaudeBot|Applebot|Twitterbot|facebookexternalhit|TelegramBot|Discordbot|WhatsApp|SkypeUriPreview/i);
  if (other) return { isBot: true, botName: other[0], vendor: 'Other' };
  if (/bot|crawler|spider|crawl|slurp|Go-http-client|python-requests|curl\/|wget|HeadlessChrome|PhantomJS/i.test(ua)) return { isBot: true, botName: '\u041f\u0440\u043e\u0447\u0438\u0439 \u0431\u043e\u0442', vendor: 'Other' };
  return { isBot: false, botName: null, vendor: null };
}

function clientIp(req) {
  const xff = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  let ip = xff || (req.socket && req.socket.remoteAddress) || '';
  return ip.replace(/^::ffff:/, '');
}

function recordVisit(req, pathname) {
  const ua = req.headers['user-agent'] || '';
  const info = parseUA(ua);
  const bot = detectBot(ua);
  const v = {
    t: new Date().toISOString(),
    ip: clientIp(req),
    path: pathname,
    ref: (req.headers['referer'] || req.headers['referrer'] || '').slice(0, 300),
    lang: (req.headers['accept-language'] || '').split(',')[0].trim(),
    ua: ua.slice(0, 400),
    browser: info.browser, os: info.os, device: info.device,
    isBot: bot.isBot, botName: bot.botName, botVendor: bot.vendor
  };
  visits.push(v);
  if (visits.length > MAX_MEM) visits = visits.slice(-MAX_MEM);
  fs.appendFile(VISITS_FILE, JSON.stringify(v) + '\n', () => {});
}

// ---------------- helpers ----------------
function sign(data) { return crypto.createHmac('sha256', SECRET).update(data).digest('base64url'); }
function makeToken() { const exp = Date.now() + SESSION_HOURS * 3600 * 1000; const payload = 'admin.' + exp; return payload + '.' + sign(payload); }
function verifyToken(tok) {
  if (!tok) return false;
  const parts = tok.split('.'); if (parts.length !== 3) return false;
  const payload = parts[0] + '.' + parts[1]; const expected = sign(payload);
  if (expected.length !== parts[2].length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts[2]))) return false;
  return Date.now() < Number(parts[1]);
}
function parseCookies(h) { const o = {}; (h || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); }); return o; }
function safeEqual(a, b) { const ab = Buffer.from(String(a)), bb = Buffer.from(String(b)); if (ab.length !== bb.length) return false; return crypto.timingSafeEqual(ab, bb); }
function bearer(req) { const h = req.headers['authorization'] || ''; const m = h.match(/^Bearer\s+(.+)$/i); return m ? m[1] : (req.headers['x-admin-token'] || ''); }
function authed(req) { return verifyToken(parseCookies(req.headers.cookie).admin_session) || verifyToken(bearer(req)); }
function json(res, code, obj, extra = {}) { res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extra)); res.end(JSON.stringify(obj)); }
function serveFile(res, file) {
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}

function topCounts(arr, key, limit) {
  const m = new Map();
  for (const v of arr) { const k = (v[key] || '\u2014') || '\u2014'; m.set(k, (m.get(k) || 0) + 1); }
  return [...m.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, limit || 100);
}

function buildStats() {
  const now = Date.now();
  const dayMs = 86400000;
  const todayStr = new Date().toISOString().slice(0, 10);
  let today = 0, last24 = 0, bots = 0, yandexBots = 0;
  const uniq = new Set();
  const byDayMap = new Map();
  for (let i = 6; i >= 0; i--) byDayMap.set(new Date(now - i * dayMs).toISOString().slice(0, 10), 0);
  for (const v of visits) {
    uniq.add(v.ip);
    const day = (v.t || '').slice(0, 10);
    if (day === todayStr) today++;
    if (now - Date.parse(v.t) <= dayMs) last24++;
    if (byDayMap.has(day)) byDayMap.set(day, byDayMap.get(day) + 1);
    if (v.isBot) { bots++; if (v.botVendor === 'Yandex') yandexBots++; }
  }
  const botVisits = visits.filter(v => v.isBot);
  const refClean = visits.map(v => ({ ref: v.ref ? (function () { try { return new URL(v.ref).hostname; } catch (e) { return v.ref; } })() : '\u041f\u0440\u044f\u043c\u043e\u0439 \u0437\u0430\u0445\u043e\u0434' }));
  return {
    ok: true,
    totals: { total: visits.length, unique: uniq.size, humans: visits.length - bots, bots, yandexBots, today, last24h: last24 },
    byDay: [...byDayMap.entries()].map(([day, count]) => ({ day, count })),
    botsByName: topCounts(botVisits, 'botName', 10),
    botVendors: topCounts(botVisits, 'botVendor', 10),
    topPages: topCounts(visits, 'path', 10),
    browsers: topCounts(visits, 'browser', 10),
    os: topCounts(visits, 'os', 10),
    devices: topCounts(visits, 'device', 10),
    referrers: topCounts(refClean, 'ref', 10)
  };
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  const p = u.pathname;

  if (p === '/api/admin/login' && req.method === 'POST') {
    let body = ''; req.on('data', c => { body += c; if (body.length > 10000) req.destroy(); });
    req.on('end', () => {
      let pw = ''; try { pw = (JSON.parse(body || '{}').password || '').toString(); } catch (e) {}
      if (safeEqual(pw, PASSWORD)) { const tok = makeToken(); json(res, 200, { ok: true, token: tok }, { 'Set-Cookie': `admin_session=${tok}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}` }); }
      else json(res, 401, { ok: false, error: '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u043f\u0430\u0440\u043e\u043b\u044c' });
    });
    return;
  }
  if (p === '/api/admin/logout' && req.method === 'POST') { json(res, 200, { ok: true }, { 'Set-Cookie': 'admin_session=; HttpOnly; Path=/; Max-Age=0' }); return; }
  if (p === '/api/admin/session') { json(res, 200, { authenticated: authed(req) }); return; }

  if (p === '/api/admin/visits') {
    if (!authed(req)) { json(res, 401, { ok: false, error: 'unauthorized' }); return; }
    const limit = Math.min(Number(u.searchParams.get('limit')) || 300, 2000);
    json(res, 200, { ok: true, total: visits.length, visits: visits.slice(-limit).reverse() });
    return;
  }
  if (p === '/api/admin/stats') {
    if (!authed(req)) { json(res, 401, { ok: false, error: 'unauthorized' }); return; }
    json(res, 200, buildStats());
    return;
  }

  if (p === '/admin' || p === '/admin/') { serveFile(res, path.join(ROOT, 'admin.html')); return; }

  const rel = p === '/' ? 'index.html' : decodeURIComponent(p.replace(/^\/+/, ''));
  const base = path.basename(rel).toLowerCase();
  if (DENY.has(base) || base.startsWith('.')) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('404 Not Found'); return; }
  const filePath = path.normalize(path.join(ROOT, rel));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }

  // Record a real site visit for HTML page loads (not the admin panel, not assets).
  const ext = path.extname(filePath).toLowerCase();
  if (req.method === 'GET' && (ext === '.html' || ext === '') && base !== 'admin.html') {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) recordVisit(req, p);
  }

  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Robufy running:  http://localhost:${PORT}`);
  console.log(`Admin panel:     http://localhost:${PORT}/admin`);
});
