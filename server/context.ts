// Licensed under the Open Software License version 3.0
import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import supertokens from "supertokens-node";
import type { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { backendConfig } from "../config/backendConfig";

/**
 * Remember that whenever we want to use any functions from the supertokens-node lib,
 * we have to call the supertokens.init function at the top of that serverless function file.
 */
supertokens.init(backendConfig());

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  if (!opts) return {};

  // Bypassing type checks as these functions are designed for express
  // but are compatible with Next
  const req = opts.req as any as SessionRequest;
  const res = opts.res as any;

  // Inject SuperTokens functions
  await superTokensNextWrapper(
    async (next) => {
      // Don't require session to prevent rejecting all requests from guests
      // I only want to inject context for latter functions if possible
      await verifySession({ sessionRequired: false })(req, res, next);
    },
    req,
    res
  );

  // JWT string used by machines (data sources)
  const authorization = req.headers.authorization;

  // Bypass security checks flag
  const hasBypassHeader = !!req.headers.bypass;
  const bypassProtection =
    process.env.NODE_ENV !== "production" && hasBypassHeader;

  const userId = req.session?.getUserId();

  return {
    bypassProtection,
    authorization,
    user: {
      id: userId,
    },
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
