from __future__ import annotations

import json
import re
from datetime import date
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((ROOT / "site.config.json").read_text(encoding="utf-8"))
ECOPOINTS = json.loads((ROOT / "data" / "ecopontos-aracatuba.json").read_text(encoding="utf-8"))
LASTMOD = date.today().isoformat()


def replace_once(content: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, content, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"Nao foi possivel substituir {label}.")
    return updated


def build_shared_header() -> str:
    nav_links = "\n".join(
        f'        <a href="{escape(item["href"])}">{escape(item["label"])}</a>'
        for item in CONFIG["nav"]
    )

    return (
        '<header class="site-header">\n'
        '  <div class="shell">\n'
        '    <nav class="topbar" aria-label="Navegação principal">\n'
        f'      <a class="brand" href="index.html">{escape(CONFIG["siteName"])}</a>\n'
        '      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Abrir menu principal">\n'
        '        <span class="menu-toggle-label">Menu</span>\n'
        '        <span class="menu-toggle-bars" aria-hidden="true">\n'
        '          <span></span>\n'
        '          <span></span>\n'
        '          <span></span>\n'
        '        </span>\n'
        '      </button>\n'
        '      <div class="nav-links" id="site-menu">\n'
        f'{nav_links}\n'
        '      </div>\n'
        '    </nav>\n'
        '  </div>\n'
        '</header>'
    )


def build_shared_footer() -> str:
    footer_links = "\n".join(
        f'      <a href="{escape(item["href"])}">{escape(item["label"])}</a>'
        for item in CONFIG["nav"]
    )

    return (
        '<footer class="site-footer">\n'
        '  <div class="shell footer-shell footer-shell-shared">\n'
        '    <div class="footer-minimal">\n'
        f'      <strong>{escape(CONFIG["siteName"])}</strong>\n'
        f'      <p>{escape(CONFIG["footerDescription"])}</p>\n'
        f'      <span class="footer-meta">Última sincronização: {LASTMOD}</span>\n'
        '    </div>\n'
        '    <nav class="footer-nav" aria-label="Navegação do rodapé">\n'
        f'{footer_links}\n'
        '    </nav>\n'
        '  </div>\n'
        '</footer>'
    )


def build_metadata_block(page: dict[str, str]) -> str:
    site_url = CONFIG["siteUrl"].rstrip("/")
    path = page["path"]
    canonical = f"{site_url}/" if path == "index.html" else f"{site_url}/{path}"
    social_image = f"{site_url}/{CONFIG['socialImage'].lstrip('/')}"

    return (
        "  <!-- SYNC:SEO START -->\n"
        f"  <title>{escape(page['title'])}</title>\n"
        f'  <meta name="description" content="{escape(page["description"], quote=True)}">\n'
        f'  <meta name="theme-color" content="{escape(CONFIG["themeColor"], quote=True)}">\n'
        '  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n'
        '  <link rel="manifest" href="site.webmanifest">\n'
        f'  <link rel="canonical" href="{escape(canonical, quote=True)}">\n'
        '  <meta property="og:locale" content="pt_BR">\n'
        '  <meta property="og:type" content="website">\n'
        f'  <meta property="og:title" content="{escape(page["title"], quote=True)}">\n'
        f'  <meta property="og:description" content="{escape(page["description"], quote=True)}">\n'
        f'  <meta property="og:url" content="{escape(canonical, quote=True)}">\n'
        f'  <meta property="og:image" content="{escape(social_image, quote=True)}">\n'
        f'  <meta name="twitter:card" content="{escape(CONFIG["twitterCard"], quote=True)}">\n'
        f'  <meta name="twitter:title" content="{escape(page["title"], quote=True)}">\n'
        f'  <meta name="twitter:description" content="{escape(page["description"], quote=True)}">\n'
        f'  <meta name="twitter:image" content="{escape(social_image, quote=True)}">\n'
        "  <!-- SYNC:SEO END -->"
    )


def build_ecopoint_icon(point_type: str) -> str:
    if point_type == "pev":
        return """
<svg viewBox="0 0 64 64" aria-hidden="true">
  <rect x="12" y="14" width="40" height="36" rx="6"></rect>
  <path d="M22 24h20"></path>
  <path d="M22 32h20"></path>
  <path d="M22 40h12"></path>
</svg>
""".strip()

    return """
<svg viewBox="0 0 64 64" aria-hidden="true">
  <path d="M32 56s18-12 18-28a18 18 0 1 0-36 0c0 16 18 28 18 28Z"></path>
  <circle cx="32" cy="28" r="6"></circle>
</svg>
""".strip()


def build_ecopoint_cards() -> str:
    blocks = []

    for point in ECOPOINTS:
        block = f"""
            <article class="ecopoint-card" data-id="{escape(point["id"], quote=True)}">
              <div class="icon small">
                {build_ecopoint_icon(point["type"])}
              </div>
              <h3>{escape(point["name"])}</h3>
              <p><strong>Endereço:</strong> {escape(point["address"])}</p>
              <p><strong>Materiais aceitos:</strong> {escape(point["materials"])}</p>
              <p><strong>Horário:</strong> {escape(point["hours"])}</p>
              <a class="card-link" href="{escape(point["mapsUrl"], quote=True)}" target="_blank" rel="noopener noreferrer">Abrir localização</a>
            </article>
        """.strip("\n")
        blocks.append(block)

    return "\n\n".join(blocks)


def build_ecopoint_data_block() -> str:
    payload = json.dumps(ECOPOINTS, ensure_ascii=False, separators=(",", ":"))
    return (
        "<!-- ECOPOINTS_DATA_START -->\n"
        f'<script id="ecopoints-data" type="application/json">{payload}</script>\n'
        "<!-- ECOPOINTS_DATA_END -->"
    )


def sync_pages() -> None:
    cards_html = build_ecopoint_cards()
    header_html = build_shared_header()
    footer_html = build_shared_footer()

    for page in CONFIG["pages"]:
        file_path = ROOT / page["path"]
        content = file_path.read_text(encoding="utf-8")
        content = replace_once(content, r"  <!-- SYNC:SEO START -->.*?  <!-- SYNC:SEO END -->", build_metadata_block(page), "seo")
        content = replace_once(content, r"<header class=\"site-header\">.*?</header>", header_html, "header")
        content = replace_once(content, r"<footer class=\"site-footer\">.*?</footer>", footer_html, "footer")

        if file_path.name == "aracatuba.html":
            cards_replacement = f"<!-- ECOPOINTS_CARDS_START -->\n{cards_html}\n          <!-- ECOPOINTS_CARDS_END -->"
            content = replace_once(
                content,
                r"<!-- ECOPOINTS_CARDS_START -->.*?<!-- ECOPOINTS_CARDS_END -->",
                cards_replacement,
                "cartoes dos ecopontos"
            )
            content = replace_once(
                content,
                r"<!-- ECOPOINTS_DATA_START -->.*?<!-- ECOPOINTS_DATA_END -->",
                build_ecopoint_data_block(),
                "dados embutidos dos ecopontos"
            )

        file_path.write_text(content.rstrip() + "\n", encoding="utf-8")


def build_sitemap() -> None:
    base_url = CONFIG["siteUrl"].rstrip("/")
    entries = []

    for page in CONFIG["pages"]:
        path = page["path"]
        loc = base_url + ("/" if path == "index.html" else f"/{path}")
        entries.append(
            "  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{LASTMOD}</lastmod>\n"
            f"    <priority>{page['priority']}</priority>\n"
            "  </url>"
        )

    sitemap = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
        f"{chr(10).join(entries)}\n"
        "</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")


def build_robots() -> None:
    robots = (
        "User-agent: *\n"
        "Allow: /\n\n"
        f"Sitemap: {CONFIG['siteUrl'].rstrip('/')}/sitemap.xml\n"
    )
    (ROOT / "robots.txt").write_text(robots, encoding="utf-8")


def build_nojekyll() -> None:
    (ROOT / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    sync_pages()
    build_sitemap()
    build_robots()
    build_nojekyll()
