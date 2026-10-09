import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyAccess } from "@/lib/access";

// Gate: signed in + email verified + approved account. Course entitlements are
// enforced again by the database for every content request.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    const access = await fetchMyAccess();
    if (!access?.email_verified) throw redirect({ to: "/verify-email" });
    if (access.account_status !== "approved") throw redirect({ to: "/account-status" });
    return { user: data.user, access };
  },
  component: () => <Outlet />,
});
