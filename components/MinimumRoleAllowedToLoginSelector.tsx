import { Role } from "@prisma/client";
import { Select } from "@mantine/core";
import { trpc } from "../utils/trpc";

export function MinimumRoleAllowedToLoginSelector() {
  const { mutateAsync: setMinRoleAllowedToLogin, isLoading: isMutating } =
    trpc.useMutation("admin.whitelist.setMinRoleAllowedToLogin", {
      useErrorBoundary: false,
    });
  const { isLoading, data: minRoleAllowedToLogin } = trpc.useQuery([
    "admin.whitelist.getMinRoleAllowedToLogin",
  ]);
  // FIXME
  const { invalidateQueries } = trpc.useContext(); // Used to refetch min role globally

  // TODO: handle error etc.
  return (
    <Select
      label="Zezwalaj na logowanie"
      disabled={isMutating || isLoading}
      value={minRoleAllowedToLogin}
      onChange={async (v: Role | "noRole") => {
        await setMinRoleAllowedToLogin(v);
        invalidateQueries("admin.whitelist.getMinRoleAllowedToLogin");
      }}
      data={[
        {
          value: "noRole",
          label: "każdemu (w tym nowym użytkownikom)",
        },
        {
          value: "GUEST",
          label: "każdemu (kto ma już konto)",
        },
        {
          value: "USER",
          label: "zaufanym użytkownikom i administratorom",
        },
        {
          value: "ADMIN",
          label: "tylko administratorom",
        },
      ]}
    />
  );
}
