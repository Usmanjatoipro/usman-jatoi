async function check() {
  const urls = [
    "https://usmanjatoi.com/sitemap.xml",
    "https://usmanjatoi.com/sitemap/static.xml",
    "https://usmanjatoi.com/sitemap/services-1.xml",
    "https://usmanjatoi.com/sitemap/pages-1.xml",
    "https://usmanjatoi.com/sitemap_index.xml",
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
      });
      const txt = await res.text();
      console.log(`URL: ${u} -> Status: ${res.status} | Content-Type: ${res.headers.get("content-type")} | Preview: ${txt.slice(0, 150)}`);
    } catch (e) {
      console.log(`URL: ${u} -> ERROR: ${e.message}`);
    }
  }
}

check();
