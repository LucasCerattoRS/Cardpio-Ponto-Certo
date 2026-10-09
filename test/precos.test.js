// Confere que as 6 versões de impressão têm os mesmos itens/preços do index.html.
// Pega o erro de "mudei o preço só no digital" (ex.: Porção da Casa R$50→60 em 08/2026).
// Rodar: node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const limpa = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function itensIndex() {
  const s = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
  const re = /class="item-name">([\s\S]*?)<\/span>\s*<span class="price-single">R\$\s*(\d+)/g;
  return new Map([...s.matchAll(re)].map((m) => [limpa(m[1]), m[2]]));
}

function itensImpresso(arq) {
  const s = fs.readFileSync(path.join(raiz, arq), 'utf8');
  const re = /class="nm">((?:(?!<\/div>)[\s\S])*?)<\/span>(?:<span class="dots"><\/span>)?<span class="pr">R\$\s*(\d+)/g;
  return [...s.matchAll(re)].map((m) => [limpa(m[1]), m[2]]);
}

const digital = itensIndex();
const impressos = fs.readdirSync(raiz).filter((f) => /^cardapio-impressao.*\.html$/.test(f));

test('existem versões de impressão', () => assert.ok(impressos.length >= 6));

for (const arq of impressos) {
  test(arq + ' bate com o index.html', () => {
    const erros = [];
    for (const [nome, preco] of itensImpresso(arq)) {
      if (!digital.has(nome)) continue; // nome escrito diferente / item com várias faixas de preço
      if (digital.get(nome) !== preco) erros.push(`${nome}: impresso R$${preco}, digital R$${digital.get(nome)}`);
    }
    // item que saiu do digital mas ficou no impresso
    if (!digital.has('Pastel Médio') && itensImpresso(arq).some(([n]) => n === 'Pastel Médio')) erros.push('Pastel Médio removido do digital');
    assert.deepStrictEqual(erros, []);
  });
}
