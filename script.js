(function(){
  var $=function(s,c){return (c||document).querySelector(s);};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};
  var PRICE=0.75757; // ₽ за 1 R$
  var rub=$('#rub'),rbx=$('#rbx'),range=$('#range'),fill=$('#fill'),knobLbl=$('#knobLbl');
  function fmt(n){return Math.round(n).toLocaleString('ru-RU');}
  function money(n){return (Math.round(n*100)/100).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function setSlider(v){var min=+range.min,max=+range.max;var pct=Math.min(1,Math.max(0,(v-min)/(max-min)));fill.style.width=(pct*100)+'%';knobLbl.style.left='calc('+(pct*100)+'% - '+((pct-0.5)*26)+'px)';knobLbl.textContent=fmt(v);}
  function fromRbx(){var v=Math.max(0,parseFloat(rbx.value)||0);rub.value=money(v*PRICE);if(v>=+range.min&&v<=+range.max){range.value=v;}setSlider(+range.value);}
  function fromRub(){var v=Math.max(0,parseFloat((rub.value+'').replace(/\s/g,'').replace(',','.'))||0);var r=Math.round(v/PRICE);rbx.value=r;if(r>=+range.min&&r<=+range.max){range.value=r;}setSlider(+range.value);}
  rbx.addEventListener('input',fromRbx);
  rub.addEventListener('input',fromRub);
  range.addEventListener('input',function(){rbx.value=range.value;rub.value=money(range.value*PRICE);setSlider(+range.value);});
  fromRbx();

  // TABS / VIEWS
  function showView(v){$$('.view').forEach(function(s){s.classList.remove('on');});$('#view-'+v).classList.add('on');
    $$('#tabs button').forEach(function(b){b.classList.toggle('on',b.dataset.view===v);});window.scrollTo({top:0,behavior:'smooth'});}
  // MODALS
  function openM(id){$('#m-'+id).classList.add('open');document.body.style.overflow='hidden';}
  function closeAll(){$$('.modal').forEach(function(m){m.classList.remove('open');});document.body.style.overflow='';}
  var DOCS={
    terms:{t:'\u0423\u0441\u043b\u043e\u0432\u0438\u044f \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f',h:'<p class="upd">\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e: 01.01.2026</p><p>\u041d\u0430\u0441\u0442\u043e\u044f\u0449\u0438\u0435 \u0423\u0441\u043b\u043e\u0432\u0438\u044f \u0440\u0435\u0433\u0443\u043b\u0438\u0440\u0443\u044e\u0442 \u043f\u043e\u0440\u044f\u0434\u043e\u043a \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0441\u0430\u0439\u0442\u0430 Robufy \u0438 \u043f\u0440\u0438\u043e\u0431\u0440\u0435\u0442\u0435\u043d\u0438\u044f \u0432\u0438\u0440\u0442\u0443\u0430\u043b\u044c\u043d\u043e\u0439 \u0438\u0433\u0440\u043e\u0432\u043e\u0439 \u0432\u0430\u043b\u044e\u0442\u044b Robux.</p><h4>1. \u041e\u0431\u0449\u0438\u0435 \u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u044f</h4><p>Robufy \u2014 \u043d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u044b\u0439 \u0441\u0435\u0440\u0432\u0438\u0441 \u0438 \u043d\u0435 \u0430\u0444\u0444\u0438\u043b\u0438\u0440\u043e\u0432\u0430\u043d \u0441 Roblox Corporation. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u044f \u0441\u0430\u0439\u0442, \u0432\u044b \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442\u0435 \u0441\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u0441 \u0434\u0430\u043d\u043d\u044b\u043c\u0438 \u0423\u0441\u043b\u043e\u0432\u0438\u044f\u043c\u0438.</p><h4>2. \u0417\u0430\u043a\u0430\u0437 \u0438 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0430</h4><ul><li>\u0414\u043b\u044f \u0437\u0430\u043a\u0430\u0437\u0430 \u0443\u043a\u0430\u0436\u0438\u0442\u0435 \u0438\u0433\u0440\u043e\u0432\u043e\u0439 \u043d\u0438\u043a \u0438 e-mail.</li><li>\u0421\u0440\u0435\u0434\u043d\u0435\u0435 \u0432\u0440\u0435\u043c\u044f \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438 \u2014 \u043e\u0442 5 \u043c\u0438\u043d\u0443\u0442 \u0434\u043e 24 \u0447\u0430\u0441\u043e\u0432.</li><li>\u041f\u0430\u0440\u043e\u043b\u044c \u043e\u0442 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430 \u043d\u0438\u043a\u043e\u0433\u0434\u0430 \u043d\u0435 \u0437\u0430\u043f\u0440\u0430\u0448\u0438\u0432\u0430\u0435\u0442\u0441\u044f.</li></ul><h4>3. \u041e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0441\u0442\u044c</h4><p>\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e \u043d\u0435\u0441\u0451\u0442 \u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043d\u043d\u043e\u0441\u0442\u044c \u0437\u0430 \u0441\u043e\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435 \u043f\u0440\u0430\u0432\u0438\u043b \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b Roblox.</p><h4>4. Оплата</h4><p>Все расчёты производятся в рублях РФ через подключённые платёжные сервисы. Стоимость заказа фиксируется в момент оформления и не меняется после оплаты.</p><h4>5. Ограничения</h4><ul><li>Запрещено использовать сервис для мошенничества, отмывания средств и иных противоправных действий.</li><li>Сервис вправе отказать в обслуживании при подозрении на нарушение правил Roblox или законодательства РФ.</li></ul><h4>6. Изменение условий</h4><p>Администрация вправе изменять настоящие Условия. Актуальная редакция всегда размещена на этой странице; продолжение использования сайта означает согласие с изменениями.</p><h4>7. Реквизиты и контакты</h4><p>ИП Иванов Иван Иванович · ИНН 771234567890 · ОГРНИП 320774600123456 · e-mail: support@robufy.ru · тел.: 8 (800) 123-45-67. Все споры разрешаются в соответствии с законодательством Российской Федерации.</p>'},
    offer:{t:'\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u0430\u044f \u043e\u0444\u0435\u0440\u0442\u0430',h:'<p class="upd">\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e: 01.01.2026</p><p>\u041d\u0430\u0441\u0442\u043e\u044f\u0449\u0438\u0439 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043e\u0444\u0438\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u043c \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u043c (\u043e\u0444\u0435\u0440\u0442\u043e\u0439) \u0418\u041f \u0418\u0432\u0430\u043d\u043e\u0432 \u0418.\u0418. \u0437\u0430\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0434\u043e\u0433\u043e\u0432\u043e\u0440 \u043a\u0443\u043f\u043b\u0438-\u043f\u0440\u043e\u0434\u0430\u0436\u0438 \u0446\u0438\u0444\u0440\u043e\u0432\u043e\u0433\u043e \u0442\u043e\u0432\u0430\u0440\u0430.</p><h4>1. \u041f\u0440\u0435\u0434\u043c\u0435\u0442</h4><p>\u041f\u0440\u043e\u0434\u0430\u0432\u0435\u0446 \u043f\u0440\u0435\u0434\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u0443\u0441\u043b\u0443\u0433\u0443 \u043f\u043e \u043f\u043e\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u044e \u0438\u0433\u0440\u043e\u0432\u043e\u0433\u043e \u0431\u0430\u043b\u0430\u043d\u0441\u0430 Robux.</p><h4>2. \u0426\u0435\u043d\u0430 \u0438 \u043e\u043f\u043b\u0430\u0442\u0430</h4><p>\u0426\u0435\u043d\u044b \u0443\u043a\u0430\u0437\u0430\u043d\u044b \u0432 \u0440\u0443\u0431\u043b\u044f\u0445 \u0420\u0424. \u041e\u043f\u043b\u0430\u0442\u0430 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 \u043f\u043b\u0430\u0442\u0451\u0436\u043d\u044b\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u044b, \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u044b\u0435 \u043d\u0430 \u0441\u0430\u0439\u0442\u0435.</p><h4>3. \u0410\u043a\u0446\u0435\u043f\u0442</h4><p>\u0410\u043a\u0446\u0435\u043f\u0442\u043e\u043c \u043e\u0444\u0435\u0440\u0442\u044b \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 \u0438 \u043e\u043f\u043b\u0430\u0442\u0430 \u0437\u0430\u043a\u0430\u0437\u0430.</p><h4>4. Порядок оказания услуги</h4><p>После поступления оплаты Продавец начисляет Robux на указанный игровой аккаунт в срок от 5 минут до 24 часов. Услуга считается оказанной с момента зачисления средств на баланс аккаунта.</p><h4>5. Права и обязанности сторон</h4><ul><li>Покупатель обязан предоставить корректный игровой ник и действующий e-mail.</li><li>Продавец обязуется выполнить заказ в полном объёме либо вернуть денежные средства.</li></ul><h4>6. Возврат средств</h4><p>Возврат осуществляется в соответствии с разделом «Возврат и гарантии» и Законом РФ «О защите прав потребителей».</p><h4>7. Реквизиты Продавца</h4><p>ИП Иванов Иван Иванович · ИНН 771234567890 · ОГРНИП 320774600123456 · адрес: 101000, г. Москва, а/я 42 · e-mail: support@robufy.ru · тел.: 8 (800) 123-45-67.</p>'},
    privacy:{t:'\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438',h:'<p class="upd">\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e: 01.01.2026</p><p>\u041c\u044b \u043e\u0431\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u0435\u043c \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u0432 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0438 \u0441 152-\u0424\u0417 \u00ab\u041e \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445\u00bb.</p><h4>1. \u041a\u0430\u043a\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 \u043c\u044b \u0441\u043e\u0431\u0438\u0440\u0430\u0435\u043c</h4><ul><li>\u0418\u0433\u0440\u043e\u0432\u043e\u0439 \u043d\u0438\u043a Roblox;</li><li>\u0430\u0434\u0440\u0435\u0441 \u044d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u043e\u0439 \u043f\u043e\u0447\u0442\u044b;</li><li>\u0442\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0435 (cookies, IP).</li></ul><h4>2. \u0426\u0435\u043b\u0438 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438</h4><p>\u0412\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u0430\u0437\u043e\u0432, \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432 \u0438 \u0443\u043b\u0443\u0447\u0448\u0435\u043d\u0438\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u0430.</p><h4>3. \u041f\u0440\u0430\u0432\u0430 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f</h4><p>\u0412\u044b \u0432\u043f\u0440\u0430\u0432\u0435 \u0437\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u0441\u0432\u043e\u0438\u0445 \u0434\u0430\u043d\u043d\u044b\u0445, \u043d\u0430\u043f\u0438\u0441\u0430\u0432 \u043d\u0430 support@robufy.ru.</p><h4>4. Хранение и защита данных</h4><p>Данные хранятся на защищённых серверах на территории РФ и не передаются третьим лицам, за исключением случаев, предус��отренных законом, и платёжных операторов — исключительно для проведения оплаты.</p><h4>5. Cookies</h4><p>Сайт использует cookies для корректной работы и аналитики. Вы можете отключить cookies в настройках браузера, при этом часть функций может стать недоступной.</p><h4>6. Согласие и его отзыв</h4><p>Оформляя заказ, вы даёте согласие на обработку персональных данных. Отозвать согласие и запросить удаление данных можно письмом на support@robufy.ru.</p><h4>7. Оператор данных</h4><p>ИП Иванов Иван Иванович · ИНН 771234567890 · e-mail: support@robufy.ru. Дата вступления в силу: 01.01.2026.</p>'},
    refund:{t:'\u0412\u043e\u0437\u0432\u0440\u0430\u0442 \u0438 \u0433\u0430\u0440\u0430\u043d\u0442\u0438\u0438',h:'<p class="upd">\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e: 01.01.2026</p><h4>1. \u0413\u0430\u0440\u0430\u043d\u0442\u0438\u044f \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438</h4><p>\u0415\u0441\u043b\u0438 \u0440\u043e\u0431\u0443\u043a\u0441\u044b \u043d\u0435 \u043f\u043e\u0441\u0442\u0443\u043f\u0438\u043b\u0438 \u0432 \u0442\u0435\u0447\u0435\u043d\u0438\u0435 24 \u0447\u0430\u0441\u043e\u0432, \u043c\u044b \u0432\u0435\u0440\u043d\u0451\u043c \u043e\u043f\u043b\u0430\u0442\u0443 \u0432 \u043f\u043e\u043b\u043d\u043e\u043c \u043e\u0431\u044a\u0451\u043c\u0435.</p><h4>2. \u0423\u0441\u043b\u043e\u0432\u0438\u044f \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430</h4><ul><li>\u0412\u043e\u0437\u0432\u0440\u0430\u0442 \u0432\u043e\u0437\u043c\u043e\u0436\u0435\u043d \u0434\u043e \u043c\u043e\u043c\u0435\u043d\u0442\u0430 \u0437\u0430\u0447\u0438\u0441\u043b\u0435\u043d\u0438\u044f \u0440\u043e\u0431\u0443\u043a\u0441\u043e\u0432.</li><li>\u0421\u0440\u043e\u043a \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u2014 \u0434\u043e 10 \u0440\u0430\u0431\u043e\u0447\u0438\u0445 \u0434\u043d\u0435\u0439.</li></ul><h4>3. \u041f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430</h4><p>\u041f\u043e \u0432\u043e\u043f\u0440\u043e\u0441\u0430\u043c \u0432\u043e\u0437\u0432\u0440\u0430\u0442\u0430: support@robufy.ru, 8 (800) 123-45-67.</p><h4>4. Как оформить возврат</h4><p>Напишите на support@robufy.ru с указанием игрового ника, e-mail заказа и причины возврата. Заявку рассматриваем в течение 24 часов.</p><h4>5. Невозвратные случаи</h4><ul><li>Robux уже зачислены на указанный аккаунт.</li><li>Указаны неверные данные аккаунта по вине покупателя.</li><li>Нарушение покупателем правил Roblox, повлёкшее блокировку аккаунта.</li></ul><h4>6. Способ возврата</h4><p>Средства возвращаются т��м же способом, которым была произведена оплата, в срок до 10 рабочих дней с момента одобрения заявки.</p><h4>7. Контакты поддержки</h4><p>ИП Иванов Иван Иванович · e-mail: support@robufy.ru · тел.: 8 (800) 123-45-67 · поддержка 24/7.</p>'}
  };
  function openDoc(key){var d=DOCS[key];if(!d)return;$('#docTitle').textContent=d.t;$('#docBody').innerHTML=d.h;openM('doc');}

  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-view],[data-modal],[data-buy],[data-close],[data-social],[data-doc]');
    if(!t)return;
    if(t.hasAttribute('data-close')){closeAll();return;}
    if(t.hasAttribute('data-view')){showView(t.dataset.view);return;}
    if(t.hasAttribute('data-buy')){e.preventDefault();$('#cRbx').textContent=fmt(parseFloat(rbx.value)||0);$('#cRub').textContent=money((parseFloat(rbx.value)||0)*PRICE)+' \u20bd';$('#cs1').style.display='';$('#cs2').style.display='none';openM('checkout');return;}
    if(t.hasAttribute('data-modal')){openM(t.dataset.modal);return;}
    if(t.hasAttribute('data-social')){e.preventDefault();toast('\u0421\u043e\u0446. \u0441\u0435\u0442\u0438','\u0421\u0441\u044b\u043b\u043a\u0430 \u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u0432 \u043d\u043e\u0432\u043e\u043c \u043e\u043a\u043d\u0435');return;}
    if(t.hasAttribute('data-doc')){e.preventDefault();openDoc(t.dataset.doc);return;}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll();});

  // BURGER (mobile) -> simple menu via prompt-like toasts; show tabs inline
  $('#burger').addEventListener('click',function(){
    var tabs=$('#tabs');var open=tabs.style.display==='flex';
    tabs.style.cssText=open?'':'display:flex;position:absolute;top:70px;left:20px;right:20px;flex-direction:column;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow);border-radius:16px;padding:8px;gap:4px;z-index:60;margin:0';
    $$('#tabs button').forEach(function(b){b.addEventListener('click',function(){tabs.style.cssText='';});});
  });

  // CHECKOUT
  $('#cPay').addEventListener('click',function(){
    var nick=$('#cNick'),email=$('#cEmail'),ok=true;
    if(!nick.value.trim()){nick.classList.add('err');ok=false;}else nick.classList.remove('err');
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())){email.classList.add('err');ok=false;}else email.classList.remove('err');
    if(!ok){toast('\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u0434\u0430\u043d\u043d\u044b\u0435','\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u043d\u0438\u043a \u0438 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 e-mail');return;}
    $('#cEmailOut').textContent=email.value.trim();$('#cNickOut').textContent=nick.value.trim();
    $('#cs1').style.display='none';$('#cs2').style.display='';
    toast('\u0417\u0430\u043a\u0430\u0437 \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d','\u041d\u0430 '+fmt(parseFloat(rbx.value)||0)+' R$ \u0434\u043b\u044f '+nick.value.trim());
  });

  $('#lBtn').addEventListener('click',function(){var e=$('#lEmail');if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.value.trim())){e.classList.add('err');return;}e.classList.remove('err');closeAll();toast('\u041a\u043e\u0434 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d','\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043f\u043e\u0447\u0442\u0443 '+e.value.trim());});
  $('#pBtn').addEventListener('click',function(){var e=$('#pNick');if(!e.value.trim()){e.classList.add('err');return;}e.classList.remove('err');closeAll();toast('\u041f\u043e\u043a\u0443\u043f\u043a\u0438','\u041f\u043e \u043d\u0438\u043a\u0443 \u00ab'+e.value.trim()+'\u00bb \u043f\u043e\u043a\u0443\u043f\u043e\u043a \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e');});

  var CODES={ROBUX5:1.05,WELCOME:1.07,PROMO:1.10};
  $('#promoBtn').addEventListener('click',function(){var code=($('#promoInp').value||'').trim().toUpperCase();
    if(CODES[code]){PRICE=0.75757/CODES[code];fromRbx();closeAll();toast('\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434 \u0430\u043a\u0442\u0438\u0432\u0438\u0440\u043e\u0432\u0430\u043d','\u041a\u0443\u0440\u0441 \u0443\u043b\u0443\u0447\u0448\u0435\u043d \u043d\u0430 '+Math.round((CODES[code]-1)*100)+'%');}
    else{toast('\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d','\u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043a\u043e\u0434 \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0441\u043d\u043e\u0432\u0430');}
  });

  // FREE tasks
  var freeBal=0;
  $$('#freeTasks .task').forEach(function(t){var btn=$('.go',t);btn.addEventListener('click',function(){
    if(t.classList.contains('done'))return;t.classList.add('done');btn.textContent='\u2713 \u0417\u0430\u0447\u0442\u0435\u043d\u043e';
    var rw=($('.rw',t).textContent.match(/\d+/)||[0])[0];freeBal+=+rw;$('#freeBal').textContent=freeBal+' R$';
    toast('\u0417\u0430\u0434\u0430\u043d\u0438\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e','+'+rw+' R$ \u043d\u0430 \u0431\u043e\u043d\u0443\u0441\u043d\u044b\u0439 \u0431\u0430\u043b\u0430\u043d\u0441',true);
  });});
  $('#withdraw').addEventListener('click',function(){if(freeBal<50){toast('\u041c\u0438\u043d\u0438\u043c\u0443\u043c \u0434\u043b\u044f \u0432\u044b\u0432\u043e\u0434\u0430 \u2014 50 R$','\u0412\u044b\u043f\u043e\u043b\u043d\u044f\u0439\u0442\u0435 \u0437\u0430\u0434\u0430\u043d\u0438\u044f \u0438 \u043f\u0440\u0438\u0433\u043b\u0430\u0448\u0430\u0439\u0442\u0435 \u0434\u0440\u0443\u0437\u0435\u0439');return;}toast('\u0417\u0430\u044f\u0432\u043a\u0430 \u043f\u0440\u0438\u043d\u044f\u0442\u0430','\u0412\u044b\u0432\u043e\u0434 '+freeBal+' R$ \u0432 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0435');});
  $('#copyRef').addEventListener('click',function(){toast('\u0421\u0441\u044b\u043b\u043a\u0430 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0430','robufy.ru/r/PROMO');});

  // RAFFLE tickets
  var tickets=0;
  $$('[data-ticket]').forEach(function(b){b.addEventListener('click',function(){if(b.classList.contains('done'))return;b.classList.add('done');b.style.opacity='.6';tickets+=+b.dataset.ticket;$('#tickets').textContent=tickets;toast('+'+b.dataset.ticket+' \u0431\u0438\u043b\u0435\u0442','\u0412\u0441\u0435\u0433\u043e \u0431\u0438\u043b\u0435\u0442\u043e\u0432: '+tickets,true);});});

  // COUNT-UP
  function animateCount(node){var target=parseFloat(node.dataset.count),suf=node.dataset.suffix||'',start=null,dur=1300;
    function step(t){if(!start)start=t;var p=Math.min((t-start)/dur,1);var e=1-Math.pow(1-p,3);node.textContent=Math.round(target*e).toLocaleString('ru-RU')+suf;if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){animateCount(x.target);io.unobserve(x.target);}});},{threshold:.5});
  $$('[data-count]').forEach(function(n){io.observe(n);});

  // LAST PURCHASES
  var names=['il','dse','Mit','Tox','Alex','Nik','Pro','Kir','Dsh','Max','Son','Lun','Foxy','Shd','Egr'];
  var amts=[20,300,240,500,120,800,1000,60,1700,240,320,50];
  function rand(n){return Math.floor(Math.random()*n);}
  function uname(){return names[rand(names.length)]+'_'+Math.random().toString(36).slice(2,4);}
  var lpList=$('#lpList');
  function lpRow(){var n=uname(),a=amts[rand(amts.length)];var d=document.createElement('div');d.className='lp-item';
    d.innerHTML='<div class="av">'+n.charAt(0).toUpperCase()+'</div><div><div class="nm">'+n+'</div><div class="am">'+a.toLocaleString('ru-RU')+' R$</div></div>';return d;}
  for(var i=0;i<4;i++)lpList.appendChild(lpRow());
  setInterval(function(){lpList.insertBefore(lpRow(),lpList.firstChild);if(lpList.children.length>4)lpList.removeChild(lpList.lastChild);},4200);

  // TOASTS
  var toasts=$('#toasts');
  function toast(title,sub,coin){var t=document.createElement('div');t.className='tst';
    t.innerHTML='<div class="av">'+(coin?'R$':'\u2713')+'</div><div><b>'+title+'</b><small>'+sub+'</small></div>';
    toasts.appendChild(t);setTimeout(function(){t.style.transition='opacity .4s,transform .4s';t.style.opacity='0';t.style.transform='translateX(-20px)';setTimeout(function(){t.remove();},400);},4000);
    if(toasts.children.length>3)toasts.removeChild(toasts.firstChild);}
  window.addEventListener('resize',function(){setSlider(+range.value);});
})();

/* ===== Подарочное колесо (только мобильные, не боты): всегда выпадает 1000 R$ ===== */
(function(){
  try{

    var css = ''+
    '.rbx-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(23,23,43,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}'+
    '.rbx-modal.open{display:flex}'+
    '.rbx-box{position:relative;width:100%;max-width:380px;background:#fff;border-radius:26px;padding:26px 22px 24px;text-align:center;box-shadow:0 30px 80px rgba(23,23,43,.35);animation:rbxIn .35s ease}'+
    '@keyframes rbxIn{from{transform:translateY(24px) scale(.96);opacity:0}to{transform:none;opacity:1}}'+
    '.rbx-x{position:absolute;top:12px;right:14px;border:0;background:#F3F2F8;width:34px;height:34px;border-radius:50%;font-size:20px;color:#9A9AAF;cursor:pointer;line-height:1}'+
    '.rbx-badge{display:inline-block;background:#EEE8FD;color:#8B5CF6;font-weight:800;font-size:12px;padding:6px 14px;border-radius:999px;margin-bottom:12px}'+
    '.rbx-box h2{font-size:21px;font-weight:900;color:#17172B;line-height:1.25;margin:0 0 6px}'+
    '.rbx-box p{color:#9A9AAF;font-size:14px;margin:0 0 18px}'+
    '.rbx-wheel-wrap{position:relative;width:230px;height:230px;margin:0 auto 20px}'+
    '.rbx-pointer{position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:22px solid #17172B;z-index:3;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}'+
    '.rbx-wheel{width:230px;height:230px;border-radius:50%;position:relative;transition:transform 5s cubic-bezier(.15,.67,.13,.99);box-shadow:0 0 0 8px #fff,0 0 0 12px #ECEBF3,0 12px 30px rgba(124,92,252,.3);background:conic-gradient(from 0deg,#7C5CFC 0 45deg,#5B8DEF 45deg 90deg,#A855F7 90deg 135deg,#F3A66B 135deg 180deg,#7C5CFC 180deg 225deg,#5B8DEF 225deg 270deg,#A855F7 270deg 315deg,#F3A66B 315deg 360deg)}'+
    '.rbx-lbl{position:absolute;left:50%;top:50%;font-weight:800;font-size:15px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.28);white-space:nowrap}'+
    '.rbx-hub{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;color:#7C5CFC;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:2}'+
    '.rbx-spin{width:100%;border:0;border-radius:14px;padding:15px;font-size:16px;font-weight:800;color:#fff;cursor:pointer;font-family:inherit;background:linear-gradient(90deg,#5B8DEF,#A855F7 52%,#F3A66B)}'+
    '.rbx-spin:disabled{opacity:.75;cursor:default}'+
    '.rbx-result{margin-top:4px}'+
    '.rbx-fine{font-size:11px;color:#9A9AAF;line-height:1.5;margin-top:14px;text-align:left}'+
    '.rbx-rules{margin-top:8px;text-align:left}'+
    '.rbx-rules summary{font-size:12px;color:#7C5CFC;font-weight:700;cursor:pointer}'+
    '.rbx-rules > div{font-size:11px;color:#9A9AAF;line-height:1.5;margin-top:6px}'+
    '.rbx-win{font-size:20px;font-weight:900;color:#17172B}'+
    '.rbx-amt{font-size:16px;color:#17172B;margin:4px 0 14px}'+
    '.rbx-amt b{color:#7C5CFC;font-size:22px}'+
    '.rbx-claim{width:100%;border:0;border-radius:14px;padding:15px;font-size:16px;font-weight:800;color:#fff;cursor:pointer;font-family:inherit;background:linear-gradient(90deg,#5B8DEF,#A855F7 52%,#F3A66B)}'+
    '.rbx-verify{font-size:14px;color:#17172B;line-height:1.45;margin:2px 0 14px}'+
    '.rbx-max{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;text-decoration:none;border:0;border-radius:14px;padding:15px;font-size:16px;font-weight:800;color:#fff;cursor:pointer;font-family:inherit;background:linear-gradient(90deg,#2B7FFF,#8B5CF6);box-shadow:0 8px 20px rgba(43,127,255,.35);margin-bottom:10px}'+
    '.rbx-max:active{transform:translateY(1px)}'+
    '.rbx-done{width:100%;border:0;border-radius:14px;padding:14px;font-size:15px;font-weight:800;color:#7C5CFC;background:#EEE8FD;cursor:pointer;font-family:inherit}'+
    '.rbx-done:disabled{opacity:.5;cursor:default}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var VALUES = [10,100,1000,10000,10,100,1000,10000];
    var labels = '';
    for (var i=0;i<8;i++){ var a=i*45+22.5; labels += '<span class="rbx-lbl" style="transform:translate(-50%,-50%) rotate('+a+'deg) translateY(-92px) rotate('+(-a)+'deg)">'+VALUES[i]+'</span>'; }

    var wrap = document.createElement('div');
    wrap.className = 'rbx-modal'; wrap.id = 'rbxGift';
    wrap.innerHTML =
      '<div class="rbx-box">'+
        '<button class="rbx-x" aria-label="\u0417\u0430\u043a\u0440\u044b\u0442\u044c">&times;</button>'+
        '<div class="rbx-badge">\ud83c\udf89 \u0412 \u0447\u0435\u0441\u0442\u044c \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0435\u043d\u0438\u044f Roblox</div>'+
        '<div class="rbx-wheel-wrap">'+
          '<div class="rbx-pointer"></div>'+
          '<div class="rbx-wheel" id="rbxWheel">'+labels+'</div>'+
          '<div class="rbx-hub">R$</div>'+
        '</div>'+
        '<button class="rbx-spin" id="rbxSpin">\u041a\u0440\u0443\u0442\u0438\u0442\u044c \u043a\u043e\u043b\u0435\u0441\u043e</button>'+
        '<div class="rbx-result" id="rbxResult" hidden></div>'+
        '<div class="rbx-fine">Срок акции — до 31.12.2026. Не является лотереей или азартной игрой: бонус гарантирован каждому новому пользователю.</div>'+
        '<details class="rbx-rules"><summary>Правила акции и реквизиты</summary><div>Организатор: ИП Иванов Иван Иванович, ИНН 771234567890, ОГРНИП 320774600123456, e-mail: support@robufy.ru. Бонус начисляется один раз на аккаунт при первой оплаченной покупке и применяется как скидка к стоимости заказа. Бонус не подлежит обмену на денежные средства. Организатор вправе изменить или досрочно прекратить акцию, разместив уведомление на сайте. Robufy не аффилирован с Roblox Corporation.</div></details>'+
      '</div>';
    document.body.appendChild(wrap);

    function close(){ wrap.classList.remove('open'); document.body.style.overflow=''; }

    var wheel = wrap.querySelector('#rbxWheel');
    var spinBtn = wrap.querySelector('#rbxSpin');
    var result = wrap.querySelector('#rbxResult');
    var spun = false;
    var wonValue = 0;
    function prize(val){
      var idx = VALUES.indexOf(val); if (idx < 0) idx = 0;
      wonValue = VALUES[idx];
      var center = idx*45 + 22.5;
      var base = (360 - (center % 360)) % 360;
      var jitter = (Math.random()*30) - 15;
      wheel.style.transform = 'rotate(' + (360*8 + base + jitter) + 'deg)';
    }

    spinBtn.addEventListener('click', function(){
      if (spun) return; spun = true;
      spinBtn.disabled = true; spinBtn.textContent = '\u041a\u0440\u0443\u0442\u0438\u043c\u2026';
      fetch('/api/spin', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        .then(function(r){ return r.json(); })
        .then(function(d){ prize(d && typeof d.value === 'number' ? d.value : VALUES[2]); })
        .catch(function(){ prize(VALUES[2]); });
    });

    wheel.addEventListener('transitionend', function(){
      if (!spun || !result.hidden) return;
      result.hidden = false;
      result.innerHTML = '<div class="rbx-win">\ud83c\udf89 \u041f\u043e\u0437\u0434\u0440\u0430\u0432\u043b\u044f\u0435\u043c!</div>'+
        '<div class="rbx-amt">Ваш бонус <b>'+wonValue+' R$</b></div>'+
        '<button class="rbx-claim" id="rbxClaim">\u0417\u0430\u0431\u0440\u0430\u0442\u044c \u043f\u043e\u0434\u0430\u0440\u043e\u043a</button>';
      spinBtn.style.display = 'none';
      var claim = wrap.querySelector('#rbxClaim');
      if (claim) claim.addEventListener('click', function(){
        // TODO: вставьте ссылку на вашего бота/канал MAX и доделайте проверку подтверждения
        var MAX_LINK = 'https://max.ru/';
        result.innerHTML = '<div class="rbx-win">🎁 Ваш приз: <span style="color:#7C5CFC">'+wonValue+' R$</span></div>'+
          '<div class="rbx-verify">Остался один шаг: подтвердите, что вы не робот, в мессенджере MAX — и мы зачислим бонус.</div>'+
          '<a class="rbx-max" id="rbxMax" href="'+MAX_LINK+'" target="_blank" rel="noopener">🛡️ Подтвердить через MAX</a>'+
          '<button class="rbx-done" id="rbxDone" disabled>Я подтвердил — забрать бонус</button>';
        var maxBtn = wrap.querySelector('#rbxMax');
        var done = wrap.querySelector('#rbxDone');
        // после перехода в MAX разблокируем кнопку подтверждения (замените на реальную проверку)
        if (maxBtn) maxBtn.addEventListener('click', function(){ setTimeout(function(){ if (done) done.disabled = false; }, 1200); });
        if (done) done.addEventListener('click', function(){ close(); var t=document.querySelector('#tabs button[data-view="buy"]'); if(t) t.click(); });
      });
    });

    wrap.querySelector('.rbx-x').addEventListener('click', close);
    wrap.addEventListener('click', function(e){ if (e.target === wrap) close(); });

    fetch('/api/promo').then(function(r){ return r.json(); }).then(function(d){
      if (d && d.show) setTimeout(function(){ wrap.classList.add('open'); document.body.style.overflow='hidden'; }, 900);
    }).catch(function(){});
  }catch(e){}
})();
