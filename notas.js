/* ============================================================
   notas.js — caixa de entrada embutida na página
   ------------------------------------------------------------
   Anota erro e pedido NA HORA em que se percebe, dentro do próprio
   app, e exporta em markdown pra colar no PENDENCIAS.md do repo.
   Escrito pro hiato de 09/2026: sem IA por perto, o que não é
   anotado no momento vira "tinha uma coisa que me incomodava".

   Zero dependência. Um <script src="notas.js"> no fim do <body>.

   Configuração pelo próprio <script>:
     data-projeto="Bar do Ferruge"   nome que vai no título do markdown
     data-chave="ferruge"            namespace no localStorage
     data-gate="hash"                só liga com #notas na URL (app de
                                     cliente: o cliente nunca vê o botão)

   ⚠️ localStorage é DESTE navegador. É rascunho, não backup: use
   "copiar tudo" e cole no PENDENCIAS.md do repo, senão a nota morre
   com o cache do aparelho.
   ============================================================ */
(function () {
  var s = document.currentScript;
  var PROJ  = (s && s.dataset.projeto) || document.title || 'Projeto';
  var CHAVE = 'notas:' + ((s && s.dataset.chave) || 'app');
  var GATE  = (s && s.dataset.gate) || '';

  if (GATE === 'hash' && location.hash.indexOf('notas') === -1) return;

  function ler() {
    try { return JSON.parse(localStorage.getItem(CHAVE) || '[]'); } catch (e) { return []; }
  }
  function gravar(lista) {
    try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) {
      alert('Não consegui salvar (armazenamento bloqueado). Copie o texto antes de fechar.');
    }
  }
  var hoje = function () { return new Date().toISOString().slice(0, 10); };

  function markdown() {
    var l = ler();
    var linha = function (n) {
      return '- [' + (n.feito ? 'x' : ' ') + '] **' + n.em + '** ' + n.texto +
             (n.onde ? ' _(' + n.onde + ')_' : '');
    };
    var bloco = function (rot, arr) { return arr.length ? '## ' + rot + '\n' + arr.map(linha).join('\n') + '\n' : ''; };
    var ab = l.filter(function (n) { return !n.feito; });
    return ['# Pendências — ' + PROJ, '',
      '> Exportado do próprio app em ' + hoje() + '.', '',
      bloco('🐞 Erro', ab.filter(function (n) { return n.tipo === 'erro'; })),
      bloco('💡 Pedido', ab.filter(function (n) { return n.tipo === 'pedido'; })),
      bloco('✅ Resolvidos', l.filter(function (n) { return n.feito; }))
    ].filter(function (p) { return p !== ''; }).join('\n') + '\n';
  }

  var css = document.createElement('style');
  css.textContent = [
    '.ntw-bt{position:fixed;right:14px;bottom:14px;z-index:99998;width:52px;height:52px;border-radius:50%;',
    'border:0;background:#1f2937;color:#fff;font-size:21px;cursor:pointer;box-shadow:0 3px 14px rgba(0,0,0,.35)}',
    '.ntw-bt b{position:absolute;top:-3px;right:-3px;min-width:20px;height:20px;border-radius:10px;background:#d33;',
    'color:#fff;font-size:11px;line-height:20px;font-weight:700}',
    '.ntw{position:fixed;inset:auto 0 0 0;z-index:99999;max-height:86vh;overflow:auto;background:#fff;color:#111;',
    'border-radius:14px 14px 0 0;box-shadow:0 -4px 30px rgba(0,0,0,.4);padding:16px;',
    'font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;box-sizing:border-box}',
    '@media(min-width:700px){.ntw{inset:auto 14px 14px auto;width:420px;border-radius:14px}}',
    '.ntw h3{margin:0 0 10px;font-size:16px}',
    '.ntw button,.ntw input,.ntw textarea{font:inherit;font-size:16px;box-sizing:border-box}',
    '.ntw textarea,.ntw input{width:100%;padding:9px;border:1px solid #ccc;border-radius:8px;margin-bottom:8px;',
    'background:#fff;color:#111}',
    '.ntw textarea{resize:vertical;min-height:70px}',
    '.ntw .ntw-tp{display:flex;gap:6px;margin-bottom:8px}',
    '.ntw .ntw-tp button{flex:1;min-height:44px;border:1px solid #ccc;border-radius:8px;background:#f4f4f5;color:#555;cursor:pointer}',
    '.ntw .ntw-tp button.on{background:#1f2937;color:#fff;border-color:#1f2937;font-weight:600}',
    '.ntw .ntw-ac{display:flex;gap:8px;flex-wrap:wrap}',
    '.ntw .ntw-ac button{min-height:44px;padding:0 14px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer}',
    '.ntw .ntw-ac .pri{background:#1f2937;color:#fff;border-color:#1f2937;font-weight:600}',
    '.ntw ul{list-style:none;margin:12px 0 0;padding:0;border-top:1px solid #eee}',
    '.ntw li{display:flex;gap:9px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #eee}',
    '.ntw li.f span.tx{color:#999;text-decoration:line-through}',
    '.ntw li span.tx{flex:1;min-width:0;white-space:pre-wrap;overflow-wrap:anywhere}',
    '.ntw li small{display:block;color:#999;font-size:11px}',
    '.ntw li button{border:0;background:none;cursor:pointer;font-size:15px;padding:2px 5px;color:#555}',
    '.ntw .ntw-av{margin-top:10px;font-size:12px;color:#666}'
  ].join('');
  document.head.appendChild(css);

  var tipo = 'erro', aberto = false;
  var bt = document.createElement('button');
  bt.className = 'ntw-bt'; bt.type = 'button';
  bt.title = 'Anotar erro ou pedido'; bt.setAttribute('aria-label', 'Anotar erro ou pedido');
  var painel = document.createElement('div');
  painel.className = 'ntw'; painel.hidden = true;

  function pintarBotao() {
    var n = ler().filter(function (x) { return !x.feito; }).length;
    bt.innerHTML = '📝' + (n ? '<b>' + n + '</b>' : '');
  }

  function pintar() {
    var l = ler().slice().sort(function (a, b) {
      return (a.feito - b.feito) || (a.em < b.em ? 1 : -1);
    });
    painel.innerHTML =
      '<h3>Anotações — ' + PROJ + '</h3>' +
      '<div class="ntw-tp">' +
        '<button type="button" data-t="erro">🐞 Erro</button>' +
        '<button type="button" data-t="pedido">💡 Pedido</button>' +
      '</div>' +
      '<textarea id="ntwTx" placeholder="O que aconteceu? Como repetir?"></textarea>' +
      '<input id="ntwOn" type="text" placeholder="onde? ex.: comanda, no celular">' +
      '<div class="ntw-ac">' +
        '<button type="button" class="pri" id="ntwAdd">Anotar</button>' +
        '<button type="button" id="ntwCp">⧉ Copiar tudo</button>' +
        '<button type="button" id="ntwX">fechar</button>' +
      '</div>' +
      '<ul></ul>' +
      '<div class="ntw-av">Isto fica só neste navegador. Copie e cole no <b>PENDENCIAS.md</b> do repo — é o que sobrevive.</div>';

    painel.querySelectorAll('.ntw-tp button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.t === tipo);
      b.onclick = function () { tipo = b.dataset.t; pintar(); painel.querySelector('#ntwTx').focus(); };
    });

    var ul = painel.querySelector('ul');
    l.forEach(function (n) {
      var li = document.createElement('li');
      if (n.feito) li.className = 'f';
      li.innerHTML = '<span>' + (n.tipo === 'erro' ? '🐞' : '💡') + '</span>' +
        '<span class="tx"></span>';
      li.querySelector('.tx').textContent = n.texto;
      var sm = document.createElement('small');
      sm.textContent = [n.em, n.onde].filter(Boolean).join(' · ');
      li.querySelector('.tx').appendChild(sm);
      var ok = document.createElement('button');
      ok.textContent = n.feito ? '↺' : '✓';
      ok.title = n.feito ? 'reabrir' : 'marcar resolvido';
      ok.onclick = function () {
        var t = ler(); var alvo = t.filter(function (x) { return x.id === n.id; })[0];
        if (alvo) { alvo.feito = !alvo.feito; gravar(t); pintar(); pintarBotao(); }
      };
      var del = document.createElement('button');
      del.textContent = '✕'; del.title = 'apagar';
      del.onclick = function () {
        gravar(ler().filter(function (x) { return x.id !== n.id; })); pintar(); pintarBotao();
      };
      li.appendChild(ok); li.appendChild(del);
      ul.appendChild(li);
    });

    painel.querySelector('#ntwX').onclick = fechar;
    painel.querySelector('#ntwAdd').onclick = function () {
      var tx = painel.querySelector('#ntwTx').value.trim();
      if (!tx) { painel.querySelector('#ntwTx').focus(); return; }
      var l2 = ler();
      l2.push({
        id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        tipo: tipo, texto: tx, onde: painel.querySelector('#ntwOn').value.trim(),
        em: hoje(), feito: false
      });
      gravar(l2); pintar(); pintarBotao();
    };
    painel.querySelector('#ntwCp').onclick = function () {
      var md = markdown();
      var pronto = function () { painel.querySelector('.ntw-av').textContent = 'Copiado — cole no PENDENCIAS.md do repo.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(pronto, mostrar);
      } else { mostrar(); }
      function mostrar() {
        var ta = document.createElement('textarea');
        ta.rows = 10; ta.value = md; ta.readOnly = true;
        painel.appendChild(ta); ta.select();
        painel.querySelector('.ntw-av').textContent = 'Selecione e copie o texto acima.';
      }
    };
  }

  function abrir() { aberto = true; painel.hidden = false; pintar(); painel.querySelector('#ntwTx').focus(); }
  function fechar() { aberto = false; painel.hidden = true; }
  bt.onclick = function () { aberto ? fechar() : abrir(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && aberto) fechar(); });

  document.body.appendChild(bt);
  document.body.appendChild(painel);
  pintarBotao();

  window.notasMarkdown = markdown; // pros testes e pro console
})();
