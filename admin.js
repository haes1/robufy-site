// Admin panel client. Contains NO password. Renders REAL visit data from the server.
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var login = $('#login'), dash = $('#dash');
  var allVisits = [], curFilter = 'all';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtTime(iso) { try { var d = new Date(iso); return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }); } catch (e) { return iso; } }

  function showDash() { login.hidden = true; dash.hidden = false; loadAll(); }
  function showLogin() { dash.hidden = true; login.hidden = false; $('#pw').value = ''; $('#pw').focus(); }

  function loadAll() { loadVisits(); loadStats(); }

  function loadVisits() {
    fetch('/api/admin/visits?limit=500', { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { allVisits = d.visits || []; renderVisits(d.total || 0); })
      .catch(function () { showLogin(); });
  }

  function applyFilter(rows) {
    if (curFilter === 'humans') return rows.filter(function (v) { return !v.isBot; });
    if (curFilter === 'bots') return rows.filter(function (v) { return v.isBot; });
    if (curFilter === 'yandex') return rows.filter(function (v) { return v.isBot && v.botVendor === 'Yandex'; });
    return rows;
  }

  function renderVisits(total) {
    var rows = applyFilter(allVisits);
    $('#visitsCount').textContent = total ? '— показано ' + rows.length + ' из ' + total : '';
    $('#visitsEmpty').hidden = rows.length > 0;
    $('#visitsBody').innerHTML = rows.map(function (v) {
      var ref = v.ref ? esc(v.ref) : '<span class="muted">Прямой заход</span>';
      var type = v.isBot
        ? '<span class="badge ' + (v.botVendor === 'Yandex' ? 'bot-ya' : 'bot') + '" title="' + esc(v.ua) + '">🤖 ' + esc(v.botName || 'Бот') + '</span>'
        : '<span class="badge human">👤 Человек</span>';
      return '<tr' + (v.isBot ? ' class="is-bot"' : '') + '>' +
        '<td class="nowrap">' + esc(fmtTime(v.t)) + '</td>' +
        '<td class="mono">' + esc(v.ip) + '</td>' +
        '<td class="mono">' + esc(v.path) + '</td>' +
        '<td class="ref">' + ref + '</td>' +
        '<td>' + type + '</td>' +
        '<td>' + esc(v.browser) + '</td>' +
        '<td>' + esc(v.os) + '</td>' +
        '<td>' + esc(v.device) + '</td>' +
        '<td>' + esc(v.lang || '—') + '</td>' +
        '</tr>';
    }).join('');
  }

  function loadStats() {
    fetch('/api/admin/stats', { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { renderStats(d); })
      .catch(function () {});
  }

  function renderStats(d) {
    var t = d.totals || {};
    $('#stats').innerHTML = [
      ['Всего заходов', t.total, ''], ['Уникальных IP', t.unique, ''],
      ['👤 Люди', t.humans, 'ok'], ['🤖 Боты', t.bots, 'bot'],
      ['🟥 Боты Яндекса', t.yandexBots, 'ya'],
      ['Сегодня', t.today, ''], ['За 24 часа', t.last24h, '']
    ].map(function (s) { return '<div class="stat ' + (s[2] ? 's-' + s[2] : '') + '"><div class="stat-v">' + (s[1] || 0) + '</div><div class="stat-l">' + s[0] + '</div></div>'; }).join('');

    bars('#botsByName', d.botsByName || []);
    bars('#botVendors', d.botVendors || []);
    bars('#byDay', (d.byDay || []).map(function (x) { return { name: x.day.slice(5), count: x.count }; }), true);
    bars('#topPages', d.topPages || []);
    bars('#referrers', d.referrers || []);
    bars('#browsers', d.browsers || []);
    bars('#os', d.os || []);
    bars('#devices', d.devices || []);

    var vc = $('#visitCards');
    if (vc) vc.innerHTML = [
      ['Всего заходов', t.total, ''],
      ['👤 Люди', t.humans, 'ok'],
      ['🤖 Боты', t.bots, 'bot'],
      ['🟥 Яндекс', t.yandexBots, 'ya']
    ].map(function (x) { return '<div class="stat ' + (x[2] ? 's-' + x[2] : '') + '"><div class="stat-v">' + (x[1] || 0) + '</div><div class="stat-l">' + x[0] + '</div></div>'; }).join('');
  }

  function bars(sel, items, keepOrder) {
    var el = $(sel); if (!el) return;
    if (!items.length) { el.innerHTML = '<div class="muted pad">Нет данных</div>'; return; }
    var max = Math.max.apply(null, items.map(function (i) { return i.count; })) || 1;
    var list = keepOrder ? items : items.slice().sort(function (a, b) { return b.count - a.count; });
    el.innerHTML = list.map(function (i) {
      var pct = Math.round((i.count / max) * 100);
      return '<div class="bar-row"><div class="bar-lbl" title="' + esc(i.name) + '">' + esc(i.name) + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + Math.max(pct, 4) + '%"></div></div>' +
        '<div class="bar-val">' + i.count + '</div></div>';
    }).join('');
  }

  // Visit filters
  $$('.chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.chip').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      curFilter = btn.dataset.filter;
      renderVisits(allVisits.length);
    });
  });

  // Tabs / sidebar nav
  var TITLES = { visits: 'Журнал заходов', analytics: 'Аналитика', settings: 'Настройки' };
  $$('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.tab').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var tab = btn.dataset.tab;
      $('#tab-visits').hidden = tab !== 'visits';
      $('#tab-analytics').hidden = tab !== 'analytics';
      $('#tab-settings').hidden = tab !== 'settings';
      var pt = $('#pageTitle'); if (pt) pt.textContent = TITLES[tab] || '';
      closeSidebar();
      if (tab === 'settings') loadSettings();
    });
  });

  function openSidebar(){ var sb = $('#sidebar'), bd = $('#backdrop'); if (sb) sb.classList.add('open'); if (bd) bd.classList.add('show'); }
  function closeSidebar(){ var sb = $('#sidebar'), bd = $('#backdrop'); if (sb) sb.classList.remove('open'); if (bd) bd.classList.remove('show'); }
  var burger = $('#burger'); if (burger) burger.addEventListener('click', openSidebar);
  var backdrop = $('#backdrop'); if (backdrop) backdrop.addEventListener('click', closeSidebar);

  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('#loginBtn'), err = $('#err');
    err.hidden = true; btn.disabled = true; btn.textContent = 'Проверка…';
    fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: $('#pw').value }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) { if (res.ok && res.j.ok) showDash(); else { err.textContent = (res.j && res.j.error) || 'Неверный пароль'; err.hidden = false; } })
      .catch(function () { err.textContent = 'Ошибка соединения'; err.hidden = false; })
      .finally(function () { btn.disabled = false; btn.textContent = 'Войти'; });
  });

  $('#refresh').addEventListener('click', loadAll);
  $('#logout').addEventListener('click', function () { fetch('/api/admin/logout', { method: 'POST' }).finally(showLogin); });

  function loadSettings() {
    fetch('/api/admin/settings', { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { if (d && d.ok) $('#maxLink').value = d.maxLink || ''; })
      .catch(function () {});
  }
  var saveBtn = $('#saveSettings');
  if (saveBtn) saveBtn.addEventListener('click', function () {
    var msg = $('#setMsg'), val = $('#maxLink').value.trim();
    msg.hidden = true; saveBtn.disabled = true; saveBtn.textContent = 'Сохранение…';
    fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ maxLink: val }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.ok) { msg.className = 'set-msg ok'; msg.textContent = 'Сохранено ✓'; $('#maxLink').value = res.j.maxLink; }
        else { msg.className = 'set-msg bad'; msg.textContent = (res.j && res.j.error) || 'Ошибка сохранения'; }
        msg.hidden = false;
      })
      .catch(function () { msg.className = 'set-msg bad'; msg.textContent = 'Ошибка соединения'; msg.hidden = false; })
      .finally(function () { saveBtn.disabled = false; saveBtn.textContent = 'Сохранить'; });
  });

  fetch('/api/admin/session').then(function (r) { return r.json(); })
    .then(function (d) { if (d.authenticated) showDash(); else showLogin(); })
    .catch(showLogin);
})();
