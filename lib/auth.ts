import { createClient as createBrowserClient } from "@/lib/supabase/browser";
import type { Profile } from "@/lib/types";

export async function getUserProfile() {
  const supabase = createBrowserClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single<Profile>();

  return profile;
}
