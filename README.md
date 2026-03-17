# EcoTech

Site estático escolar sobre lixo eletrônico, descarte correto e ecopontos em Araçatuba-SP.

## Como rodar localmente

No Windows, dentro da pasta do projeto:

```powershell
.\localhost.cmd
```

Para trocar a porta:

```powershell
.\localhost.cmd 5501
```

O script sincroniza a estrutura do site antes de iniciar o servidor local.

## Como editar o conteúdo

Arquivos principais:

- `index.html`, `sobre.html`, `solucoes.html`, `projeto.html`, `aracatuba.html`, `contato-ou-fontes.html`
- `styles.css`
- `site.js`

Arquivos de dados e configuração:

- `data/ecopontos-aracatuba.json`: lista dos ecopontos
- `site.config.json`: URL do site, navegação, SEO e conteúdo compartilhado

## Sincronização

Antes de publicar, rode:

```powershell
python scripts\sync_site.py
```

Esse script:

- atualiza o cabeçalho compartilhado
- atualiza o rodapé compartilhado
- atualiza os metadados de SEO das páginas
- insere os cartões de ecopontos na página de Araçatuba
- embute os dados dos ecopontos no HTML para funcionar até sem localhost
- gera `robots.txt`
- gera `sitemap.xml`
- gera `.nojekyll`

## Publicação

O projeto está preparado para publicação como site estático no GitHub Pages.

Se a URL final mudar:

1. atualize `site.config.json`
2. rode `python scripts\sync_site.py`
3. publique novamente

## GitHub Pages

O workflow de publicação está em `.github/workflows/pages.yml`.

Ele:

- roda a sincronização do site
- publica automaticamente no GitHub Pages em pushes para `main`
- também pode ser executado manualmente
