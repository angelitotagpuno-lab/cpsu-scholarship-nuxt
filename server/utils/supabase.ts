import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

const config = useRuntimeConfig();
const supabaseUrl = config.supabaseUrl;
const supabaseKey = config.supabaseKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
