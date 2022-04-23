import { env } from "process";

export const appBaseUrl = env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${env.NEXT_PUBLIC_VERCEL_URL}/`
  : "http://localhost:3000/";

export const appInfo = {
  // More on https://supertokens.com/docs/thirdparty/appinfo
  appName: "Logowanie - Zdalne zarządzanie domem",
  websiteDomain: appBaseUrl,
  apiDomain: appBaseUrl,
  websiteBasePath: "/auth",
  apiBasePath: "/api/auth",
};
