import { usersRouter } from "./root/users";
import { router } from "./trpc";

export const rootRouter = router({
  users: usersRouter,
});
