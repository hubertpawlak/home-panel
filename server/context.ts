import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { SessionRequest } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

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

  // Bypass security checks flag
  const hasBypassHeader = !!req.headers.bypass;
  const bypassProtection =
    process.env.NODE_ENV !== "production" && hasBypassHeader;

  const userId = req.session?.getUserId();

  return {
    bypassProtection,
    user: {
      id: userId,
    },
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
