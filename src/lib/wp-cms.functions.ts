import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function sb() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export interface CmsRow {
  id: number;
  title: string;
  path: string | null;
  post_type: string;
  status: string;
  post_modified: string | null;
  seo_title: string | null;
}

export const listCmsRows = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        post_type: z.enum(["page", "post", "product", "courses"]),
        q: z.string().optional().default(""),
        page: z.number().int().min(1).optional().default(1),
        pageSize: z.number().int().min(1).max(100).optional().default(50),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const from = (data.page - 1) * data.pageSize;
    const to = from + data.pageSize - 1;
    let q = sb()
      .from("wp_posts")
      .select("id,title,path,post_type,status,post_modified,seo_title", { count: "exact" })
      .eq("post_type", data.post_type)
      .eq("status", "publish")
      .order("post_modified", { ascending: false, nullsFirst: false })
      .range(from, to);

    if (data.q.trim()) {
      const needle = `%${data.q.trim()}%`;
      q = q.or(`title.ilike.${needle},path.ilike.${needle}`);
    }
    const { data: rows, count, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: (rows ?? []) as CmsRow[], total: count ?? 0 };
  });
