import { createRouter } from "../../createRouter";
import { prisma } from "../../../prisma/client";
import { Role } from "@prisma/client";
import { SharedMax } from "../../../types/SharedMax";
import { userProviderSchema } from "../../../sharedSchema/userProviderSchema";
import { z } from "zod";

// FIXME: crud sources
export const sourcesRouter = createRouter();
