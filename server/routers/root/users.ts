import {
  deleteUser,
  getUserCount,
  getUsersNewestFirst,
} from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import {
  addRoleToUser,
  getRolesForUser,
  removeUserRole,
} from "supertokens-node/recipe/userroles";
import { z } from "zod";
import type { DisplayedUser } from "../../../types/DisplayedUser";
import { SharedMax } from "../../../types/SharedMax";
import { rootProcedure } from "../../middleware/enforceUserAuth";
import { router } from "../trpc";

export const usersRouter = router({
  getCount: rootProcedure.query(async () => {
    const count = await getUserCount();
    return count;
  }),
  getNewest: rootProcedure
    .input(
      z.object({
        cursor: z.string().max(SharedMax).optional(),
        maxRowsPerPage: z.number().min(1).default(10),
      })
    )
    .query(async ({ input }) => {
      const usersResponse = await getUsersNewestFirst({
        limit: input?.maxRowsPerPage,
        paginationToken: input?.cursor,
      });
      const { users: rawUsers, nextPaginationToken } = usersResponse;
      // Map users for data grid
      const users = rawUsers.map<DisplayedUser>(({ user }) => ({
        id: user.id,
        tpProvider: user.thirdParty.id,
        tpUserId: user.thirdParty.userId,
        timeJoined: user.timeJoined,
        email: user.email,
      }));
      return { rows: users, nextCursor: nextPaginationToken };
    }),
  getEditableUserInfo: rootProcedure
    .input(z.object({ userId: z.string().min(1).max(SharedMax) }))
    .query(async ({ input }) => {
      const { userId } = input;
      const roles = (await getRolesForUser(userId)).roles;
      return { userId, roles };
    }),
  editUser: rootProcedure
    .input(
      z.object({
        userId: z.string().min(1).max(SharedMax),
        roles: z
          .array(z.enum(["root", "admin", "user"]))
          .max(3)
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Extract inputs
      const { userId } = input;
      const wantedRoles: string[] | undefined = input.roles;
      // Specify what to change
      const editRoles = !!wantedRoles;
      // Add/Remove roles
      if (editRoles) {
        const currentRoles = (await getRolesForUser(userId)).roles;
        const rolesToRemove = currentRoles.filter(
          (role) => !wantedRoles.includes(role)
        );
        const rolesToAdd = wantedRoles.filter(
          (role) => !currentRoles.includes(role)
        );
        await Promise.all(
          rolesToAdd.map((role) => addRoleToUser(userId, role))
        );
        await Promise.all(
          rolesToRemove.map((role) => removeUserRole(userId, role))
        );
      }
      return {
        userId,
        roles: wantedRoles,
      };
    }),
  deleteUsers: rootProcedure
    .input(z.array(z.string().min(1).max(SharedMax)).nonempty())
    .mutation(async ({ input: userIds }) => {
      await Promise.all(
        userIds.map(async (userId) => {
          await Session.revokeAllSessionsForUser(userId);
          return await deleteUser(userId);
        })
      );
    }),
});
