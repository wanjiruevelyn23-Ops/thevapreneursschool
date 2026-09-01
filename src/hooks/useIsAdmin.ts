import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .then(({ data }) => {
        if (active) setIsAdmin(Boolean(data && data.length > 0));
      });
    return () => {
      active = false;
    };
  }, [userId]);

  return isAdmin;
}
