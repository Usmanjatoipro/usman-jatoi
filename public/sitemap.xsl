<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>XML Sitemap</title>
        <style>
          :root{color-scheme:light dark}
          body{font:14px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;margin:0;padding:32px;background:#0b0b10;color:#e7e7ea}
          .wrap{max-width:1100px;margin:0 auto}
          h1{font-size:22px;margin:0 0 4px}
          .sub{opacity:.7;margin-bottom:24px}
          table{width:100%;border-collapse:collapse;background:#14141b;border-radius:12px;overflow:hidden}
          th,td{padding:10px 14px;text-align:left;border-bottom:1px solid #22222c;font-size:13px}
          th{background:#1b1b24;font-weight:600;text-transform:uppercase;font-size:11px;letter-spacing:.05em;opacity:.8}
          tr:last-child td{border-bottom:none}
          a{color:#7aa2ff;text-decoration:none}
          a:hover{text-decoration:underline}
          .num{text-align:right;font-variant-numeric:tabular-nums;opacity:.7}
          .pill{display:inline-block;padding:2px 8px;border-radius:999px;background:#22c55e22;color:#4ade80;font-size:11px}
        </style>
      </head>
      <body>
        <div class="wrap">
          <xsl:apply-templates/>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="s:sitemapindex">
    <h1>Sitemap Index</h1>
    <div class="sub"><xsl:value-of select="count(s:sitemap)"/> child sitemaps</div>
    <table>
      <thead><tr><th>Sitemap</th><th>Last modified</th></tr></thead>
      <tbody>
        <xsl:for-each select="s:sitemap">
          <tr>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td class="num"><xsl:value-of select="s:lastmod"/></td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>

  <xsl:template match="s:urlset">
    <h1>URL Set</h1>
    <div class="sub"><span class="pill"><xsl:value-of select="count(s:url)"/> URLs</span></div>
    <table>
      <thead><tr><th>#</th><th>URL</th><th>Last modified</th><th>Priority</th></tr></thead>
      <tbody>
        <xsl:for-each select="s:url">
          <tr>
            <td class="num"><xsl:value-of select="position()"/></td>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td class="num"><xsl:value-of select="s:lastmod"/></td>
            <td class="num"><xsl:value-of select="s:priority"/></td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
