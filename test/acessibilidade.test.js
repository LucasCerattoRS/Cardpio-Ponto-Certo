// Auditoria de acessibilidade/mobile do cardápio (dados sintéticos, sem rede).
// Rodar: node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const raiz = path.join(__dirname, '..');

// Zoom do usuário não pode ser bloqueado (WCAG 1.4.4 Redimensionar texto).
test('viewport do index.html não bloqueia o zoom', () => {
  const s = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
  const m = s.match(/<meta\s+name="viewport"\s+content="([^"]*)"/);
  assert.ok(m, 'meta viewport ausente');
  const c = m[1].replace(/\s+/g, '');
  assert.ok(!/user-scalable=(no|0)/i.test(c), 'user-scalable=no impede zoom: ' + c);
  const max = c.match(/maximum-scale=([\d.]+)/i);
  assert.ok(!max || parseFloat(max[1]) >= 2, 'maximum-scale < 2 impede zoom: ' + c);
});

// notas.js com um localStorage qualquer (inclusive lixo) não pode derrubar a página.
function rodaNotas(valorGuardado) {
  const guardado = {};
  if (valorGuardado !== undefined) guardado['notas:teste'] = valorGuardado;
  const el = () => ({
    style: {}, dataset: {}, classList: { toggle() {}, add() {}, remove() {} },
    appendChild() {}, setAttribute() {}, querySelector: () => el(), querySelectorAll: () => [],
    focus() {}, select() {},
  });
  const doc = {
    currentScript: { dataset: { projeto: 'Teste', chave: 'teste' } },
    title: 'Teste', head: el(), body: el(), createElement: el, addEventListener() {},
  };
  const win = {};
  const ctx = {
    document: doc, window: win, location: { hash: '' }, navigator: {},
    localStorage: { getItem: (k) => (k in guardado ? guardado[k] : null), setItem(k, v) { guardado[k] = v; } },
    alert() {}, Date, Math, JSON,
  };
  vm.runInNewContext(fs.readFileSync(path.join(raiz, 'notas.js'), 'utf8'), ctx);
  return win;
}

for (const [nome, lixo] of [['null', 'null'], ['objeto', '{"a":1}'], ['texto', '"oi"'], ['JSON inválido', '{quebrado']]) {
  test('notas.js sobrevive a localStorage corrompido (' + nome + ')', () => {
    const win = rodaNotas(lixo);
    assert.match(win.notasMarkdown(), /^# Pendências/);
  });
}

test('notas.js lê notas válidas', () => {
  const nota = { id: 'n1', tipo: 'erro', texto: 'botão sem foco (sintético)', onde: 'celular', em: '2026-01-01', feito: false };
  const win = rodaNotas(JSON.stringify([nota]));
  assert.match(win.notasMarkdown(), /botão sem foco/);
});
