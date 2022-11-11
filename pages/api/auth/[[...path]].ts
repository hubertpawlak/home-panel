// Licensed under the Open Software License version 3.0
import type { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from "next";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { backendConfig } from "../../../config/backendConfig";

supertokens.init(backendConfig());

export default async function superTokens(
  req: NextApiRequest & Request,
  res: NextApiResponse & Response
) {
  await superTokensNextWrapper(
    async (next) => {
      await middleware()(req, res, next);
    },
    req,
    res
  );
  if (!res.writableEnded) {
    res.status(404).send("Not found");
  }
}
