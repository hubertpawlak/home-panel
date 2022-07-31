import { z } from "zod";

export const userProviderSchema = z.enum(["github"]);
