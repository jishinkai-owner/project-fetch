import { createClient } from "@/utils/supabase/server";
export async function authenticateRequest() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}
