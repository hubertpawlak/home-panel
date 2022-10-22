import type { UserRole } from "./UserRole";

type RoleToRolePower = {
  [key in UserRole]: number;
};

export const rolePower: RoleToRolePower = {
  user: 1,
  admin: 2,
  root: Number.MAX_VALUE,
};
