import os
import json
import re
import xml.etree.ElementTree as ET

MEDIA_XML = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\Usman Jatoi Site Main Wordpress Data files and etc\usmanjatoipro.WordPress.2026-07-19.Media.xml"
OUTPUT_JSON = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\usman-jatoi\src\data\wp-media-manifest.json"

def parse_media():
    print(f"Reading {MEDIA_XML}...")
    with open(MEDIA_XML, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Fix common missing namespaces in WP export XMLs
    if 'xmlns:itunes' not in content:
        content = content.replace('<rss version="2.0"', '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"')

    root = ET.fromstring(content)
    channel = root.find("channel")
    items = channel.findall("item")

    ns = {
        'wp': 'http://wordpress.org/export/1.2/',
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'dc': 'http://purl.org/dc/elements/1.1/'
    }

    media_items = []
    for item in items:
        post_id_el = item.find('wp:post_id', ns)
        post_id = int(post_id_el.text) if post_id_el is not None and post_id_el.text else None
        
        post_type_el = item.find('wp:post_type', ns)
        post_type = post_type_el.text if post_type_el is not None else 'attachment'

        if post_type != 'attachment':
            continue

        title_el = item.find('title')
        title = title_el.text if title_el is not None else ""

        attachment_url_el = item.find('wp:attachment_url', ns)
        source_url = attachment_url_el.text if attachment_url_el is not None else ""

        post_name_el = item.find('wp:post_name', ns)
        slug = post_name_el.text if post_name_el is not None else ""

        pub_date_el = item.find('pubDate')
        pub_date = pub_date_el.text if pub_date_el is not None else ""

        # Extract alt text from postmeta
        alt_text = ""
        for meta in item.findall('wp:postmeta', ns):
            key = meta.find('wp:meta_key', ns)
            val = meta.find('wp:meta_value', ns)
            if key is not None and key.text == '_wp_attachment_image_alt' and val is not None:
                alt_text = val.text or ""

        if source_url:
            media_items.append({
                "id": post_id,
                "slug": slug,
                "title": title,
                "alt_text": alt_text,
                "source_url": source_url,
                "storage_url": source_url, # Fallback to source URL if not stored locally
                "pub_date": pub_date
            })

    print(f"Extracted {len(media_items)} media items.")
    
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(media_items, f, indent=2)
        
    print(f"Saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    parse_media()
