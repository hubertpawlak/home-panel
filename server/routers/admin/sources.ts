import { TRPCError } from "@trpc/server";
import { SignJWT } from "jose";
import { z } from "zod";
import { JwtAlg } from "../../../types/JwtAlg";
import { JWT_ISSUER } from "../../../types/JwtIssuer";
import { SharedMax } from "../../../types/SharedMax";
import { base64ToJwtPrivateKey } from "../../../utils/jwt";
import { adminProcedure } from "../../middleware/enforceUserAuth";
import { router } from "../trpc";

export const sourcesRouter = router({
  signToken: adminProcedure
    .input(
      z.object({
        sourceId: z.string().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
      // Decode private key
      const jwtPrivateKey = await base64ToJwtPrivateKey(
        process.env.JWT_PRIVATE
      );
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
    }),
});
