import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readBlogIndexPage } from "./wp-blog.server";

export const getBlogIndexPage = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ offset: z.number().int().min(0), limit: z.number().int().min(1).max(50), search: z.string().max(120) }).parse(input),
  )
  .handler(({ data }) => readBlogIndexPage(data.offset, data.limit, data.search.trim()));