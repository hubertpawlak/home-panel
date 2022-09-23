import supertokens from "supertokens-node";
import { backendConfig } from "../../../config/backendConfig";
import { middleware } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Request, Response } from "express";

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
