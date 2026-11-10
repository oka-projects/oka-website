# Fonte da home de oka.dev.br

A página inicial (`../index.html`) é um arquivo único, montado a partir desta pasta.
O nome começa com `_` para o GitHub Pages não servir a pasta em oka.dev.br.

| Arquivo | O que é |
|---|---|
| `base.html` | Estrutura e textos da página (entrada, serviços, produtos, treinamentos, fecho) |
| `cena.css`, `cena.js` | Fundo em fluido (WebGL), trilha dos treinamentos e símbolo 3D do fecho |
| `common.css`, `common.js` | Fonte, demonstrações animadas e troca automática dos serviços |
| `montar.py` | Junta tudo; também guarda o HTML das demonstrações e o número do WhatsApp |
| `cabecalho-seo.html` | Título, descrição, ícones, compartilhamento e JSON-LD |
| `is.woff2`, `wordmark.svg` | Instrument Sans e o wordmark, embutidos na página |

## Como alterar o site

1. Edite os arquivos desta pasta (nunca o `index.html` da raiz direto).
2. `python3 _fonte/montar.py` grava o `index.html` novo.
3. Abra o `index.html` no navegador e confira.
4. Commit e push na `main` publicam (GitHub Pages, um a dois minutos).

`python3 _fonte/montar.py --conferir` diz se a fonte gera exatamente o `index.html` que está no repositório.
