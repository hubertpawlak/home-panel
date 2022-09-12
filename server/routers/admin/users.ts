import Session from "supertokens-node/recipe/session";
import { createProtectedRouter } from "../../createProtectedRouter";
import { SharedMax } from "../../../types/SharedMax";
import { z } from "zod";
import {
  deleteUser,
  getUserCount,
  getUsersNewestFirst,
} from "supertokens-node";

export const usersRouter = createProtectedRouter()
  .query("getCount", {
    input: z.undefined(),
    output: z.number().min(0),
    async resolve({}) {
      const count = await getUserCount();
      return count;
    },
  })
  .query("getNewest", {
    input: z.object({
      cursor: z.string().max(SharedMax).optional(),
      maxRowsPerPage: z.number().min(1).default(10),
    }),
    async resolve({ input }) {
      const usersResponse = await getUsersNewestFirst({
        limit: input?.maxRowsPerPage,
        paginationToken: input?.cursor,
      });
      const { users: rawUsers, nextPaginationToken } = usersResponse;
      // Map users for data grid
      const users = rawUsers.map(({ user }) => ({
        id: user.id,
        tpProvider: user.thirdParty.id,
        tpUserId: user.thirdParty.userId,
        timeJoined: user.timeJoined,
        email: user.email,
      }));
      return { rows: users, nextCursor: nextPaginationToken };
    },
  })
  .mutation("deleteUsers", {
    input: z.array(z.string().min(1).max(SharedMax)).nonempty(),
    async resolve({ input: userIds }) {
      await Promise.all(
        userIds.map(async (userId) => {
          await Session.revokeAllSessionsForUser(userId);
          return await deleteUser(userId);
        })
      );
    },
  });
