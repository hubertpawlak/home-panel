import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_KEY) throw new Error("Missing SUPABASE_KEY");

export default createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  { schema: "private" }
);
