# 🍽️ Cardápio Digital — Ponto Certo

Cardápio digital do **Ponto Certo — Restaurante e Lancheria** (Paraí/RS), publicado como site estático no GitHub Pages e acessado pelos clientes via QR code nas mesas.

**🔗 Site ao vivo:** https://lucascerattors.github.io/Cardpio-Ponto-Certo/

## 📂 Estrutura

```
├── index.html                              Cardápio web (mobile-first, o QR das mesas aponta aqui)
├── cardapio-impressao.html                 Versão para impressão padrão
├── cardapio-impressao-tematico.html        Versão impressa temática
├── cardapio-impressao-tematico-ampliado.html
├── cardapio-impressao-13x20.html           Formato 13x20 cm
├── cardapio-impressao-13x20-acessivel.html Formato 13x20 com alto contraste
├── cardapio-impressao-13x20-acessivel-preto.html
└── img/                                    Fotos dos pratos (jpg + webp) e logo
```

## 🛠️ Técnicas aplicadas

- **Mobile-first**: carrossel de fotos com scroll-snap, navegação sticky por categorias, áreas de toque generosas
- **Performance**: imagens em `webp` com fallback `jpg` via `<picture>`, `loading="lazy"`, CSS inline (zero build, 1 request)
- **Acessibilidade**: `alt` descritivos, `focus-visible`, `prefers-reduced-motion`, versões impressas de alto contraste
- **Sem dependências de build**: HTML/CSS/JS puros — basta servir os arquivos

## ⚠️ Manutenção

O QR code impresso nas mesas aponta para a URL do GitHub Pages acima.
**Não renomear o repositório, o `index.html` nem os arquivos de `img/`** — isso quebraria o acesso dos clientes.

## ✏️ Como editar um preço ou item (sem programar)

Cada prato aparece em **7 arquivos diferentes** (o digital + 6 versões de impressão), então uma alteração precisa ser repetida em todos. Passo a passo:

1. Abra o repositório numa sessão do Claude Code (ou peça pra alguém abrir).
2. Diga o que mudar, por exemplo: *"muda o preço da Picanha de R$ 70 para R$ 75 em todos os arquivos"*.
3. Peça pra revisar o `git diff` antes de aceitar — confirma que o valor mudou em todos os 7 arquivos e em nenhum lugar errado.
4. Peça pra commitar e dar `git push` — só depois disso a mudança aparece no site (GitHub Pages leva ~1 minuto para atualizar).

Se for **item novo** (como o Baurú foi adicionado): ele entra em todos os 7 arquivos com uma badge "Novo"/"Novidade". Se o preço ainda não estiver definido, use o texto `Consultar` como placeholder até confirmar o valor.

## 🔧 Workflow git (referência rápida)

```bash
git status              # ver o que mudou
git diff                # conferir as mudanças arquivo por arquivo
git add -A
git commit -m "Descrição da mudança"
git push
```

O deploy é automático via GitHub Pages a partir da branch `main` — não existe passo de build.

## 📋 Pendências

Nenhuma no momento. (Baurú adicionado em 04/08/2026, preço R$ 35 confirmado no mesmo dia.)
