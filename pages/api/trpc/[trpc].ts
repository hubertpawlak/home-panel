// Licensed under the Open Software License version 3.0
import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "../../../server/context";
import { appRouter } from "../../../server/routers/_app";
import { cacheableQueries } from "../../../types/CacheableQueries";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  responseMeta({ type, paths, errors }) {
    const isQuery = type === "query";
    const hasNoErrors = errors.length === 0;
    // Cache only whitelisted queries
    const cacheForNSeconds =
      paths?.reduce((pv, v) => {
        return Math.min(pv, cacheableQueries[v] ?? 0);
      }, Number.MAX_VALUE) ?? 0;

    if (isQuery && hasNoErrors && cacheForNSeconds > 0) {
      return {
        headers: {
          "Cache-Control": `s-maxage=${cacheForNSeconds},max-age=${cacheForNSeconds},must-revalidate`,
        },
      };
    }

    return {};
  },
});
