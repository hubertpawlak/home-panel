import { createRouter } from "../../createRouter";
import { prisma } from "../../../prisma/client";
import { Role } from "@prisma/client";
import { SharedMax } from "../../../types/SharedMax";
import { userProviderSchema } from "../../../sharedSchema/userProviderSchema";
import { whitelistAddUserSchema } from "../../../sharedSchema/whitelistAddUserSchema";
import { z } from "zod";

export const whitelistRouter = createRouter()
  .query("getMinRoleAllowedToLogin", {
    input: z.undefined(),
    async resolve() {
      const minRole = await prisma.configString.findFirst({
        where: { key: "minRoleAllowedToLogin" },
      });
      return minRole?.value ?? "noRole";
    },
  })
  .mutation("setMinRoleAllowedToLogin", {
    input: z.union([z.nativeEnum(Role), z.literal("noRole")]),
    async resolve({ input: role }) {
      // TODO: delete config entry/nullify on noRole?
      const configEntry = await prisma.configString.upsert({
        where: { key: "minRoleAllowedToLogin" },
        update: { value: role },
        create: { key: "minRoleAllowedToLogin", value: role },
      });
      return configEntry;
    },
  })
  .query("getUsers", {
    input: z.object({
      search: z.string().max(SharedMax).optional(),
      cursor: z.string().max(SharedMax).optional(),
      maxRowsPerPage: z.number().min(1).default(10),
    }),
    async resolve({ input }) {
      const { search: searchQuery, cursor, maxRowsPerPage } = input;
      const users = await prisma.whitelist.findMany(
        // Ignore empty search string
        {
          where: !!searchQuery?.length
            ? {
                OR: [
                  { entryId: { startsWith: searchQuery } },
                  { userId: { startsWith: searchQuery } },
                ],
              }
            : {},
          // Always add 1 to check for next page
          // Add another 1 to compensate skipped cursor
          take: maxRowsPerPage + (!!cursor ? 2 : 1),
          skip: !!cursor ? 1 : 0,
          cursor: cursor ? { entryId: cursor } : undefined,
        }
      );
      const hasNextPage = users.length > maxRowsPerPage; // Has that extra record
      if (hasNextPage) {
        users.pop(); // Remove last record, it will be on the next page
        const lastUser = users.at(-1);
        return {
          rows: users,
          nextCursor: lastUser?.entryId,
        };
      }
      // No next page
      return {
        rows: users,
        nextCursor: undefined,
      };
    },
  })
  .mutation("addUser", {
    input: whitelistAddUserSchema,
    async resolve({ input }) {
      const { userProvider, userId, role } = input;
      const createdEntry = await prisma.whitelist.create({
        data: {
          userProvider,
          userId,
          role,
        },
      });
      return createdEntry;
    },
  })
  .mutation("editUser", {
    input: z.intersection(
      z.object({
        id: z.string().cuid().min(1).max(SharedMax),
      }),
      z.discriminatedUnion("field", [
        z.object({
          field: z.literal("userProvider"),
          value: userProviderSchema,
        }),
        z.object({
          field: z.literal("userId"),
          value: z.string().min(1).max(SharedMax),
        }),
        z.object({
          field: z.literal("role"),
          value: z.nativeEnum(Role),
        }),
      ])
    ),
    async resolve({ input }) {
      const { id, field, value } = input;
      const result = await prisma.whitelist.update({
        data: { [field]: value },
        where: { entryId: id },
      });
      // TODO: update on the client
      console.log(result);
      return result;
    },
  })
  .mutation("removeUsers", {
    input: z
      .string()
      .cuid()
      .min(1)
      .max(SharedMax)
      .array()
      .nonempty()
      .max(SharedMax),
    async resolve({ input: entryIds }) {
      await prisma.whitelist.deleteMany({
        where: {
          entryId: { in: entryIds },
        },
      });
    },
  });
