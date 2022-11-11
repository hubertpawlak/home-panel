// Licensed under the Open Software License version 3.0
import { ActionIcon, Loader, Menu } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { redirectToAuth } from "supertokens-auth-react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/thirdparty";
import { Login, Logout, UserCircle } from "tabler-icons-react";
import { trpc } from "../utils/trpc";

export function AppHeaderSignInBtn() {
  const [userLoading, setUserLoading] = useState(false);
  const session = useSessionContext();
  const trpcContext = trpc.useContext();
  const router = useRouter();

  if (session.loading) return <Loader size="sm" color="gray" />;

  const doesSessionExist = session.doesSessionExist;

  return (
    <>
      <Menu width={200}>
        <Menu.Target>
          <ActionIcon
            title={
              doesSessionExist
                ? "Akcje zalogowanego użytkownika"
                : "Zaloguj się"
            }
            loading={userLoading}
            onClick={() => {
              if (doesSessionExist) return;
              setUserLoading(true);
              redirectToAuth({
                redirectBack: true,
              });
            }}
          >
            {doesSessionExist ? <UserCircle /> : <Login />}
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<Logout />}
            disabled={userLoading}
            onClick={async () => {
              setUserLoading(true);
              signOut()
                .then(() => {
                  trpcContext.invalidate(); // Make tRPC forget possibly secret content
                  router.push("/"); // Redirect to homepage
                })
                .finally(() => {
                  setUserLoading(false);
                });
            }}
          >
            Wyloguj się
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
