import { base64ToJwtPublicKey } from "../utils/jwt";
import { createRouter } from "./createRouter";
import { JWT_ISSUER } from "../types/JwtIssuer";
import { jwtVerify } from "jose";
import { router, TRPCError } from "@trpc/server";
import { SharedMax } from "../types/SharedMax";
import { z } from "zod";

interface M2MRouterContext {
  sourceId: string;
}

const jwtValidator = z.object({
  iat: z.number(),
  iss: z.literal(JWT_ISSUER),
  sub: z.string().min(1).max(SharedMax),
});

/**
 * Create a router verifying JWT and extracting sourceId
 */
export function _createM2MRouter() {
  return createRouter().middleware(async ({ ctx, next }) => {
    // Bypass the whole thing
    if (ctx.bypassProtection)
      return next<M2MRouterContext>({
        ctx: {
          sourceId: "fakeSource",
        },
      });
    // Decode keys
    const jwtPublicKey = await base64ToJwtPublicKey(process.env.JWT_PUBLIC);
    if (!jwtPublicKey)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Missing JWT public key",
      });
    // Extract JWT from header
    const authString = ctx.authorization;
    if (!authString) throw new TRPCError({ code: "UNAUTHORIZED" });
    const BEARER = "Bearer ";
    if (!authString.startsWith(BEARER))
      throw new TRPCError({ code: "BAD_REQUEST" });
    const jwtString = authString.slice(BEARER.length);
    if (!jwtString) throw new TRPCError({ code: "UNAUTHORIZED" });
    // Verify JWT
    const { payload: rawJwtPayload } = await jwtVerify(
      jwtString,
      jwtPublicKey,
      {
        issuer: JWT_ISSUER,
      }
    ).catch(() => {
      throw new TRPCError({
        code: "PARSE_ERROR",
        message: "JWT verification failed",
      });
    });
    // Validate payload (using zod)
    const jwtValidationResult = await jwtValidator.safeParse(rawJwtPayload);
    if (!jwtValidationResult.success)
      throw new TRPCError({
        code: "PARSE_ERROR",
        message: "JWT validation failed",
      });
    const jwtPayload = jwtValidationResult.data;
    const sourceId = jwtPayload.sub;
    // Pass data extracted from JWT
    return next<M2MRouterContext>({
      ctx: {
        sourceId,
      },
    });
  });
}

/**
 * Create a fake router with M2MRouterContext.
 * Used for context swapping for nested routers.
 * @example
 * const real = _createM2MRouter();
 * const fake = createM2MRouter();
 * real.merge(fake);
 */
export function createM2MRouter() {
  return router<M2MRouterContext>();
}
