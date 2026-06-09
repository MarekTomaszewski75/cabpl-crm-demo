"use client";

import { CrmAuthShell } from "@/components/crm/crm-auth-shell";
import { LoginRedirectIfAuthenticated } from "@/components/crm/login-redirect-if-authenticated";
import { LoginUserPicker } from "@/components/crm/login-user-picker";
import { useDemoData } from "@/lib/data/demo-data-context";
import { useSession } from "@/lib/auth/demo-session";

export default function LoginPage() {
  const { users } = useDemoData();
  const { isReady, user } = useSession();

  if (!isReady || user) {
    return <LoginRedirectIfAuthenticated />;
  }

  return (
    <CrmAuthShell
      headerAction={
        <p className="text-sm text-ca-foreground-muted-on-shell">Demo CRM</p>
      }
    >
      <div className="flex w-full max-w-lg flex-col gap-6">
        <LoginUserPicker users={users} />
        <p className="text-center text-xs text-ca-foreground-muted-on-shell">
          Brak hasła i SSO — wybór konta na potrzeby prezentacji.
        </p>
      </div>
    </CrmAuthShell>
  );
}
