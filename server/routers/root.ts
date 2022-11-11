// Licensed under the Open Software License version 3.0
import { usersRouter } from "./root/users";
import { router } from "./trpc";

export const rootRouter = router({
  users: usersRouter,
});
