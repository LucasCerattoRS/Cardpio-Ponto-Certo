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
Para atualizar preços/itens, edite as seções marcadas em `index.html` e nas versões de impressão.
