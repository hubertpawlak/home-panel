import { TRPCError } from "@trpc/server";
import { jwtVerify } from "jose";
import { z } from "zod";
import { JWT_ISSUER } from "../../types/JwtIssuer";
import { SharedMax } from "../../types/SharedMax";
import { base64ToJwtPublicKey } from "../../utils/jwt";
import { publicProcedure, t } from "../routers/trpc";

interface M2MRouterContext {
  sourceId: string;
}

const jwtValidator = z.object({
  iat: z.number(),
  iss: z.literal(JWT_ISSUER),
  sub: z.string().min(1).max(SharedMax),
});

export const enforceM2MAuth = t.middleware(async ({ ctx, next }) => {
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
  const { payload: rawJwtPayload } = await jwtVerify(jwtString, jwtPublicKey, {
    issuer: JWT_ISSUER,
  }).catch(() => {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "JWT verification failed",
    });
  });
  // Validate payload (using zod)
  const jwtValidationResult = jwtValidator.safeParse(rawJwtPayload);
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

export const m2mProcedure = publicProcedure.use(enforceM2MAuth);
