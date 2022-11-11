// Licensed under the Open Software License version 3.0
import { Redis } from "@upstash/redis";

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!UPSTASH_REDIS_REST_URL) throw new Error("Missing UPSTASH_REDIS_REST_URL");
if (!UPSTASH_REDIS_REST_TOKEN)
  throw new Error("Missing UPSTASH_REDIS_REST_TOKEN");

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});
