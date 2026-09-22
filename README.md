# Click Rural — Site

Site institucional de uma página (one-page) para a Click Rural Fotografia, em HTML, CSS e JavaScript puros — sem frameworks e sem etapa de build.

## Como abrir

Basta abrir `index.html` no navegador. Para testar com um servidor local (recomendado, evita problemas de caminho relativo):

```
node .claude/serve.js
```

e acessar `http://localhost:8080`.

## Estrutura

```
index.html
assets/
  css/style.css        → design system + responsivo
  js/main.js           → menu, revelações, filtros, lightbox, formulário
  img/                 → fotos reais já otimizadas para web
    hero/ intro/ momentos/ infancia/ animais/
    portfolio/ destaque/ sobre/ instagram/
    logo.png  favicon.png
  fonts/               → Product Sans (não usada na versão atual)
backup-v1/             → versão anterior do site (pode apagar quando quiser)
```

## Design

- **Tipografia:** Fraunces (títulos — serifada variável, com eixos `SOFT`/`WONK`) + Instrument Sans (texto). Carregadas via Google Fonts.
- **Paleta:** extraída do material de identidade da marca — verde-floresta `#25360A`, oliva `#647040`, sálvia `#ADB385`, dourado `#FAB534` e creme `#FDF4E5`. Todas definidas como variáveis no `:root` do CSS.
- **Seções:** hero em tela cheia, letreiro deslizante, manifesto, lista de ensaios (com preview da foto seguindo o cursor no desktop e miniatura no celular), ensaio visual com texto fixo, galeria com filtros e lightbox, citação em destaque, sobre, processo, Instagram, contato e rodapé.

## Acessibilidade e performance

- Fotos otimizadas (o site inteiro tem ~4,5 MB) com `width`/`height` declarados para evitar deslocamento de layout, e `loading="lazy"` abaixo da dobra.
- Galeria navegável por teclado (setas, Esc) e por gesto de arrastar no celular.
- Todas as animações são desligadas em `prefers-reduced-motion`, e o conteúdo aparece normalmente mesmo se o JavaScript falhar.

## O que ainda pode ser ajustado antes de publicar

1. **E-mail** — `contato@clickrural.com.br` pode ser um endereço de exemplo; confirmar antes de publicar.
2. **Formulário de contato** — hoje funciona só no front-end (valida e mostra confirmação, mas não envia e-mail de verdade). Para receber as mensagens, conectar a um serviço como Formspree, EmailJS, Netlify Forms ou um backend próprio em `assets/js/main.js`.
3. **Compartilhamento (Open Graph)** — a tag `og:image` usa caminho relativo; ao publicar em um domínio, trocar pela URL completa da imagem.
4. **Vídeos** — os ~15 vídeos do material original não entraram no site: são arquivos de câmera muito grandes (40–135 MB cada). Se quiser uma seção de vídeo, comprimir antes (HandBrake ou similar, algo em torno de 5–15 MB cada).
5. **Mais fotos** — a galeria usa 16 das fotos enviadas; ainda há outras na pasta original que podem entrar ou substituir as atuais.
