import React, { useState } from "react";
import { ActionIcon, Loader, Menu } from "@mantine/core";
import { Login, Logout, UserCircle } from "tabler-icons-react";
import { redirectToAuth } from "supertokens-auth-react";
import { signOut } from "supertokens-auth-react/recipe/thirdparty";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export function AppHeaderSignInBtn() {
  const [userLoading, setUserLoading] = useState(false);
  const session = useSessionContext();
  const { invalidateQueries } = trpc.useContext();
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
                  invalidateQueries(); // Make tRPC forget possibly secret content
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
