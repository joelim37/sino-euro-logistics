import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./supabase-env";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
