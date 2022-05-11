import React, { useState } from "react";
import { ActionIcon, Menu } from "@mantine/core";
import { Login, Logout, UserCircle } from "tabler-icons-react";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import {
  signOut,
  redirectToAuth,
} from "supertokens-auth-react/recipe/thirdparty";

export function AppHeaderSignInBtn() {
  const [userLoading, setUserLoading] = useState(false);
  const { doesSessionExist } = useSessionContext();
  const { invalidateQueries } = trpc.useContext();
  const router = useRouter();

  return (
    <>
      {doesSessionExist ? (
        <Menu
          control={
            <ActionIcon
              title="Akcje zalogowanego użytkownika"
              loading={userLoading}
            >
              <UserCircle />
            </ActionIcon>
          }
        >
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
        </Menu>
      ) : (
        <ActionIcon
          title="Zaloguj się"
          loading={userLoading}
          onClick={() => {
            setUserLoading(true);
            redirectToAuth({
              redirectBack: true,
            });
          }}
        >
          <Login />
        </ActionIcon>
      )}
    </>
  );
}
