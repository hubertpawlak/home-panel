import { RoleAccessDenied } from "./RoleAccessDenied";
import { trpc } from "../utils/trpc";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import type { PropsWithChildren } from "react";

/**
 * Restrict children components to certain roles
 */
export const RoleProtected = ({
  requiredPower,
  hideDenial,
  children,
}: PropsWithChildren<{ requiredPower: number; hideDenial?: boolean }>) => {
  // Hooks
  const session = useSessionContext();
  const {
    data: userPower,
    isFetched,
    isError,
  } = trpc.useQuery(["self.getPower"], {
    staleTime: 60 * 1000, // 1 min
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !session.loading,
  });
  // Loading
  if (session.loading) return null;
  if (!isFetched) return null;
  // Guest
  if (!session.doesSessionExist || isError)
    return hideDenial ? null : <RoleAccessDenied />;
  // Role power check
  const hasRequiredPower = (userPower ?? 0) >= requiredPower;
  if (!hasRequiredPower) return hideDenial ? null : <RoleAccessDenied />;
  // Allowed
  return <>{children}</>;
};
