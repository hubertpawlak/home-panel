import { Role } from "@prisma/client";
import { userProviderSchema } from "./userProviderSchema";
import { z } from "zod";

export const whitelistAddUserSchema = z.object({
  userProvider: userProviderSchema,
  userId: z.string().min(1).max(1000),
  role: z.nativeEnum(Role),
});
