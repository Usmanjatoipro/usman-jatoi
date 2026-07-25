import os
import json
import re

POSTS_XML = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\Usman Jatoi Site Main Wordpress Data files and etc\usmanjatoipro.posts.WordPress.2026-07-18.xml"
PAGES_XML = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\Usman Jatoi Site Main Wordpress Data files and etc\usmanjatoipro.pages.WordPress.2026-07-19.xml"

OUT_POSTS = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\usman-jatoi\src\data\wp-posts-manifest.json"
OUT_PAGES = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\usman-jatoi\src\data\wp-pages-manifest.json"
OUT_TERMS = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\usman-jatoi\src\data\wp-terms-manifest.json"

def clean_cdata(value):
    val = (value or "").strip()
    if val.startswith("<![CDATA[") and val.endswith("]]>"):
        val = val[9:-3]
    return val

SYSTEM_META_KEYS = {
    "_edit_lock",
    "_edit_last",
    "_thumbnail_id",
    "_wp_old_slug",
    "_wp_old_date",
    "_pingme",
    "_encloseme",
    "_power_chart_data",
    "_power_chart_version",
    "_prme_data_v3",
    "_prme_version_v3",
    "_eael_post_view_count",
    "ekit_post_views_count",
    "rank_math_internal_links_processed",
    "rank_math_robots_serialized",
    "_elementor_global_class_usage_indexed",
    "_elementor_page_assets",
    "_elementor_element_cache",
    "ocg_status_log",
    "ocg_last_generated",
    "_cached_locations_block_premium",
    "pcg_last_generated",
    "_post_ratings",
    "_post_votes",
}

SYSTEM_META_PREFIXES = (
    "_elementor_data",
    "_elementor_page_settings",
    "_elementor_controls_usage",
    "_elementor_css",
    "_elementor_conditions",
    "_oembed_",
    "_transient_",
    "_site_transient_",
    "_menu_item_",
    "_wp_attachment_",
    "_wp_attached_file",
    "_wp_attachment_metadata",
    "_icl_",
    "googlesitekit_",
)

KEEP_META_KEYS = {
    "_wp_page_template",
    "_elementor_template_type",
    "fifu_image_url",
    "fifu_image_alt",
    "rank_math_title",
    "rank_math_description",
    "rank_math_focus_keyword",
    "rank_math_seo_score",
    "_yoast_wpseo_title",
    "_yoast_wpseo_metadesc",
    "meta_title",
    "meta_description",
}

def should_keep_meta(key, value):
    if not key or not (value or "").strip():
        return False
    if key in KEEP_META_KEYS:
        return True
    if key in SYSTEM_META_KEYS:
        return False
    if value.strip().startswith("field_") and len(value.strip()) < 100:
        return False
    if key.startswith("rank_math") or key.startswith("_rank_math"):
        return True
    if key.startswith("fifu_") or key.startswith("_cached_"):
        return True
    return not any(key.startswith(prefix) for prefix in SYSTEM_META_PREFIXES)

def parse_postmeta(block):
    meta = {}
    for meta_block in re.findall(r"<wp:postmeta>(.*?)</wp:postmeta>", block, re.DOTALL):
        key_match = re.search(r"<wp:meta_key[^>]*>(.*?)</wp:meta_key>", meta_block, re.DOTALL)
        value_match = re.search(r"<wp:meta_value[^>]*>(.*?)</wp:meta_value>", meta_block, re.DOTALL)
        if not key_match or not value_match:
            continue
        key = clean_cdata(key_match.group(1))
        value = clean_cdata(value_match.group(1))
        if not should_keep_meta(key, value):
            continue
        if key in meta:
            if isinstance(meta[key], list):
                meta[key].append(value)
            else:
                meta[key] = [meta[key], value]
        else:
            meta[key] = value
    return meta

def meta_value(meta, key):
    value = meta.get(key, "")
    if isinstance(value, list):
        return next((item for item in value if item), "")
    return value or ""

def path_from_link(link, slug):
    if link and "://" in link:
        m = re.match(r"https?://[^/]+(/[^?#]*)", link)
        if m:
            path = m.group(1).strip()
            if path != "/" and path.endswith("/"):
                path = path[:-1]
            return path or "/"
    return "/" + slug.strip("/") if slug else ""

def parse_line_stream(file_path):
    print(f"Fast line-streaming {file_path}...")
    items = []
    terms_dict = {}
    
    in_item = False
    current_lines = []

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            if "<item>" in line:
                in_item = True
                current_lines = [line]
            elif "</item>" in line:
                if in_item:
                    current_lines.append(line)
                    block = "".join(current_lines)
                    in_item = False

                    def get_tag(tag_name):
                        m = re.search(r'<' + re.escape(tag_name) + r'[^>]*>(.*?)</' + re.escape(tag_name) + r'>', block, re.DOTALL)
                        if not m:
                            return ""
                        return clean_cdata(m.group(1))

                    post_id_str = get_tag("wp:post_id")
                    if post_id_str:
                        post_id = int(post_id_str)
                        post_type = get_tag("wp:post_type") or "post"
                        status = get_tag("wp:status") or "publish"
                        title = get_tag("title")
                        link = get_tag("link")
                        slug = get_tag("wp:post_name")
                        post_date = get_tag("wp:post_date")
                        post_modified = get_tag("wp:post_modified")
                        content_encoded = get_tag("content:encoded")
                        excerpt_encoded = get_tag("excerpt:encoded")
                        meta = parse_postmeta(block)

                        seo_title = meta_value(meta, "_yoast_wpseo_title") or meta_value(meta, "rank_math_title") or meta_value(meta, "meta_title") or title
                        seo_desc = meta_value(meta, "_yoast_wpseo_metadesc") or meta_value(meta, "rank_math_description") or meta_value(meta, "meta_description") or excerpt_encoded[:160]

                        thumbnail_match = re.search(r'<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]></wp:meta_value>', block, re.DOTALL)
                        thumbnail_id_str = thumbnail_match.group(1) if thumbnail_match else ""
                        featured_media_id = int(thumbnail_id_str) if thumbnail_id_str and thumbnail_id_str.isdigit() else None
                        fifu_image_url = meta_value(meta, "fifu_image_url")
                        fifu_image_alt = meta_value(meta, "fifu_image_alt")

                        cats = re.findall(r'<category domain="([^"]+)" nicename="([^"]+)"><!\[CDATA\[(.*?)\]\]></category>', block)
                        post_terms = []
                        for domain, cat_slug, cat_name in cats:
                            term_key = f"{domain}:{cat_slug}"
                            if term_key not in terms_dict:
                                terms_dict[term_key] = {
                                    "taxonomy": domain,
                                    "slug": cat_slug,
                                    "name": cat_name
                                }
                            post_terms.append({
                                "taxonomy": domain,
                                "slug": cat_slug,
                                "name": cat_name
                            })

                        path = path_from_link(link, slug)

                        items.append({
                            "id": post_id,
                            "post_type": post_type,
                            "status": status,
                            "slug": slug,
                            "title": title,
                            "excerpt": excerpt_encoded,
                            "content": content_encoded,
                            "permalink": link,
                            "path": path,
                            "post_date": post_date,
                            "post_modified": post_modified,
                            "seo_title": seo_title,
                            "seo_description": seo_desc,
                            "featured_media_id": featured_media_id,
                            "fifu_image_url": fifu_image_url or None,
                            "fifu_image_alt": fifu_image_alt or None,
                            "meta": meta,
                            "terms": post_terms
                        })
            elif in_item:
                current_lines.append(line)

    return items, terms_dict

def run_parser():
    all_posts, posts_terms = parse_line_stream(POSTS_XML)
    all_pages, pages_terms = parse_line_stream(PAGES_XML)

    print(f"Total posts parsed: {len(all_posts)}")
    print(f"Total pages parsed: {len(all_pages)}")

    os.makedirs(os.path.dirname(OUT_POSTS), exist_ok=True)
    with open(OUT_POSTS, "w", encoding="utf-8") as f:
        json.dump(all_posts, f, separators=(",", ":"))

    with open(OUT_PAGES, "w", encoding="utf-8") as f:
        json.dump(all_pages, f, separators=(",", ":"))

    all_terms = {**posts_terms, **pages_terms}
    with open(OUT_TERMS, "w", encoding="utf-8") as f:
        json.dump(list(all_terms.values()), f, separators=(",", ":"))

    print("Fast content parsing completed successfully!")

if __name__ == "__main__":
    run_parser()
