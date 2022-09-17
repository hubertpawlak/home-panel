import { createClient } from "@supabase/supabase-js";
/* eslint-disable @typescript-eslint/no-non-null-assertion */

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_KEY) throw new Error("Missing SUPABASE_KEY");

export default createClient(
  process.env.SUPABASE_URL!,
  // process.env.SUPABASE_ANON_KEY!,
  process.env.SUPABASE_KEY!,
  { schema: "public" }
);
