import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { readComparison, readComparisonList } from "./comparisons.server";

export const getComparisonList = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ search: z.string().max(120).optional() }).parse(data ?? {}),
  )
  .handler(async ({ data }) => readComparisonList(data.search ?? ""));

export const getComparison = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => readComparison(data.slug));
