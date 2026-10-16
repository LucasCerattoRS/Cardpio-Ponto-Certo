# Auditoria de acessibilidade/mobile — cardápio (16/10/2026)

Escopo limitado: teclado, foco, alvos de toque, viewport, armazenamento local e links.
Só leitura de código + testes automatizados com dados sintéticos. Nada foi publicado.

## Defeitos reproduzidos e corrigidos

| # | Problema | Teste (`test/acessibilidade.test.js`) | Correção |
|---|----------|----------------------------------------|----------|
| 1 | `index.html` tinha `maximum-scale=1.0, user-scalable=no`: o cliente não conseguia dar zoom (WCAG 1.4.4). | `viewport do index.html não bloqueia o zoom` | Viewport agora é só `width=device-width, initial-scale=1.0`. |
| 2 | `notas.js`: se o `localStorage` guardasse JSON válido que não é lista (`null`, `{}`, `"x"`), `ler()` devolvia isso e `.filter` lançava `TypeError` ao carregar — a caixa de anotações inteira morria. | `notas.js sobrevive a localStorage corrompido (null/objeto/texto)` | `ler()` só aceita array; senão devolve `[]`. |

Os testes falhavam antes (4 falhas) e passam depois (13/13 com os de preços).

## Verificado, sem defeito encontrado

- Abas de categoria são `<button>` reais: operáveis por Tab/Enter/Espaço; têm `:focus-visible`.
- Links do WhatsApp: `rel="noopener"`, `href` `https://wa.me/...` válido; âncora `#entrega` existe.
- `alt` presente nas imagens; `prefers-reduced-motion` respeitado.
- `notas.js`: falha de gravação (storage bloqueado) e JSON inválido já eram tratados; botões principais têm 44px.
- Só aparece com `#notas` na URL (cliente não vê).

## Pendências / limites (não corrigidos, não testados)

- Não foi aberto em navegador real nem em leitor de tela; alvos de toque foram avaliados só pelo CSS (aba ≈ 43,6px, ligeiramente abaixo de 44px; passa o mínimo AA de 24px).
- Abas não expõem estado ao leitor de tela (`aria-pressed`/`aria-selected`) e `filterMenu` depende de comparar o texto do `onclick`.
- Botões ✓/✕ da lista em `notas.js` são pequenos (~20px) e só têm `title`, sem `aria-label`.
- Painel de `notas.js` não é `role="dialog"` e não devolve o foco ao fechar.
- QR do WhatsApp vem de serviço externo (`api.qrserver.com`).
- Cardápios impressos não foram auditados.
