import { Role } from "@prisma/client";

export interface AccessTokenPayload {
  admin?: boolean;
  role: Role;
}
