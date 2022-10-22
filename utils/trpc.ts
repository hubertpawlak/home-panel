import { httpBatchLink, httpLink, splitLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";
import { cacheableQueries } from "../types/CacheableQueries";

function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;
    return {
      links: [
        // Disable request batching for cacheable queries
        splitLink({
          condition({ type, path }) {
            const isQuery = type === "query";
            const isCacheable = (cacheableQueries[path] ?? 0) > 0;
            return isQuery && isCacheable;
          },
          true: httpLink({ url }),
          false: httpBatchLink({ url }),
        }),
      ],
    };
  },
});
