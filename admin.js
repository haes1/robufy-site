// Admin panel client. Contains NO password. It only sends what the user
// types to the server and reacts to the server's yes/no answer.
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var login = $('#login'), dash = $('#dash');

  function showDash() { login.hidden = true; dash.hidden = false; loadData(); }
  function showLogin() { dash.hidden = true; login.hidden = false; $('#pw').value = ''; $('#pw').focus(); }

  function loadData() {
    fetch('/api/admin/data', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('unauthorized'); return r.json(); })
      .then(function (d) { renderStats(d.stats || []); renderOrders(d.orders || []); })
      .catch(function () { showLogin(); });
  }

  function renderStats(stats) {
    $('#stats').innerHTML = stats.map(function (s) {
      return '<div class="stat"><div class="stat-v">' + s.value + '</div><div class="stat-l">' + s.label + '</div></div>';
    }).join('');
  }

  function renderOrders(orders) {
    $('#ordersBody').innerHTML = orders.map(function (o) {
      var cls = /Выполнен/.test(o.status) ? 'ok' : /оплаты/.test(o.status) ? 'wait' : 'work';
      return '<tr><td>' + o.id + '</td><td>' + o.nick + '</td><td>' + o.rbx + ' R$</td><td>' + o.sum +
        '</td><td><span class="badge ' + cls + '">' + o.status + '</span></td><td>' + o.time + '</td></tr>';
    }).join('');
  }

  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = $('#loginBtn'), err = $('#err');
    err.hidden = true; btn.disabled = true; btn.textContent = 'Проверка…';
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: $('#pw').value })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.ok) { showDash(); }
        else { err.textContent = (res.j && res.j.error) || 'Неверный пароль'; err.hidden = false; }
      })
      .catch(function () { err.textContent = 'Ошибка соединения'; err.hidden = false; })
      .finally(function () { btn.disabled = false; btn.textContent = 'Войти'; });
  });

  $('#logout').addEventListener('click', function () {
    fetch('/api/admin/logout', { method: 'POST' }).finally(showLogin);
  });

  // If a valid session cookie already exists, skip the login screen.
  fetch('/api/admin/session').then(function (r) { return r.json(); })
    .then(function (d) { if (d.authenticated) showDash(); else showLogin(); })
    .catch(showLogin);
})();
