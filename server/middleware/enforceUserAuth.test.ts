// Licensed under the Open Software License version 3.0
import { beforeEach } from "@jest/globals";
import { rolePower } from "../../types/RolePower";
import type { UserRole } from "../../types/UserRole";
import type { Context } from "../context";
import { enforceUserAuth } from "./enforceUserAuth";

jest.mock("supertokens-node/recipe/userroles", () => ({
  getRolesForUser: (id: string) => ({
    status: "OK",
    roles: id ? [id] : [], // Return id as role for simple testing
  }),
}));

const next = jest.fn();

beforeEach(() => {
  next.mockReset();
});

test("throws if no min role is required", async () => {
  const ctx = {};
  const middlewarePromise = enforceUserAuth({})._middlewares[0]({
    next,
    ctx,
  } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"UNAUTHORIZED"`
  );
  expect(next).not.toBeCalled();
});

test("throws without user", async () => {
  const ctx = {};
  const middlewarePromise = enforceUserAuth({
    minRequiredRole: "user",
  })._middlewares[0]({
    next,
    ctx,
  } as any);
  await expect(middlewarePromise).rejects.toThrowErrorMatchingInlineSnapshot(
    `"UNAUTHORIZED"`
  );
  expect(next).not.toBeCalled();
});

const roles = Object.keys(rolePower) as UserRole[];
const cases: {
  minRequiredRole: UserRole;
  is: UserRole;
  shouldBeAllowed: boolean;
}[] = roles
  .map((role1) =>
    roles.map((role2) => ({
      minRequiredRole: role1,
      is: role2,
      shouldBeAllowed: rolePower[role2] >= rolePower[role1],
    }))
  )
  .flat();

test("access test cases have the correct length", () => {
  expect(cases).toHaveLength(roles.length * roles.length);
});

test.each(cases)(
  "should allow if user is '$is' and '$minRequiredRole' is required: $shouldBeAllowed",
  async ({ minRequiredRole, is, shouldBeAllowed }) => {
    const ctx = {
      user: { id: is },
    } as Context;
    const middlewarePromise = enforceUserAuth({
      minRequiredRole,
    })._middlewares[0]({
      next,
      ctx,
    } as any);
    if (shouldBeAllowed) {
      await expect(middlewarePromise).resolves.toBeUndefined();
      expect(next).toBeCalledTimes(1);
      // Should swap context
      const nextCallFirstArg = next.mock.lastCall[0];
      expect(nextCallFirstArg).toMatchObject({
        ctx: { user: { id: is, roles: [is] } },
      });
    } else {
      await expect(
        middlewarePromise
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"FORBIDDEN"`);
      expect(next).not.toBeCalled();
    }
  }
);
