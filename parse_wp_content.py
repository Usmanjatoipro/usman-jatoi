import os
import json
import re

POSTS_XML = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\Usman Jatoi Site Main Wordpress Data files and etc\usmanjatoipro.posts.WordPress.2026-07-18.xml"
PAGES_XML = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\Usman Jatoi Site Main Wordpress Data files and etc\usmanjatoipro.pages.WordPress.2026-07-19.xml"

OUT_POSTS = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\usman-jatoi\src\data\wp-posts-manifest.json"
OUT_PAGES = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\usman-jatoi\src\data\wp-pages-manifest.json"
OUT_TERMS = r"D:\Wp Bulk Publishing - All in One\Lovable Sites\usman-jatoi\src\data\wp-terms-manifest.json"

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
                        val = m.group(1).strip()
                        if val.startswith("<![CDATA[") and val.endswith("]]>"):
                            val = val[9:-3]
                        return val

                    def get_meta(key):
                        m = re.search(r'<wp:meta_key><!\[CDATA\[' + re.escape(key) + r'\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]></wp:meta_value>', block, re.DOTALL)
                        return m.group(1) if m else ""

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

                        seo_title = get_meta("_yoast_wpseo_title") or get_meta("rank_math_title") or title
                        seo_desc = get_meta("_yoast_wpseo_metadesc") or get_meta("rank_math_description") or excerpt_encoded[:160]

                        thumbnail_id_str = get_meta("_thumbnail_id")
                        featured_media_id = int(thumbnail_id_str) if thumbnail_id_str and thumbnail_id_str.isdigit() else None

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

                        path = "/" + slug if slug else ""

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
        json.dump(all_posts, f, indent=2)

    with open(OUT_PAGES, "w", encoding="utf-8") as f:
        json.dump(all_pages, f, indent=2)

    all_terms = {**posts_terms, **pages_terms}
    with open(OUT_TERMS, "w", encoding="utf-8") as f:
        json.dump(list(all_terms.values()), f, indent=2)

    print("Fast content parsing completed successfully!")

if __name__ == "__main__":
    run_parser()
