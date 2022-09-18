import { base64ToJwtPrivateKey } from "../../../utils/jwt";
import { createProtectedRouter } from "../../createProtectedRouter";
import { JWT_ISSUER } from "../../../types/JwtIssuer";
import { JwtAlg } from "../../../types/JwtAlg";
import { SharedMax } from "../../../types/SharedMax";
import { SignJWT } from "jose";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const sourcesRouter = createProtectedRouter().mutation("signToken", {
  input: z.object({
    sourceId: z.string().min(1).max(SharedMax),
  }),
  async resolve({ input }) {
    // Decode private key
    const jwtPrivateKey = await base64ToJwtPrivateKey(process.env.JWT_PRIVATE);
    if (!jwtPrivateKey)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Missing JWT private key",
      });
    // Create a signed JWT
    const { sourceId } = input;
    const jwt = await new SignJWT({})
      .setProtectedHeader({ alg: JwtAlg })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setSubject(sourceId)
      .sign(jwtPrivateKey);
    return jwt;
  },
});
