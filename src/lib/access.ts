import { supabase } from "@/integrations/supabase/client";

export type AccountStatus = "pending_approval" | "approved" | "rejected" | "suspended";

export type MyAccess = {
  email_verified: boolean;
  account_status: AccountStatus | null;
  roles: string[];
};

/** Server-computed access facts for the signed-in user (cannot be faked client-side). */
export async function fetchMyAccess(): Promise<MyAccess | null> {
  const { data, error } = await supabase.rpc("my_access");
  if (error || !data) return null;
  return data as unknown as MyAccess;
}
