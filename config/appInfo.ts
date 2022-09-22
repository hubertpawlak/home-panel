const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}/`
  : "http://localhost:3000/";

export const appInfo = {
  // More on https://supertokens.com/docs/thirdparty/appinfo
  appName: "Logowanie - Zdalne zarządzanie domem",
  websiteDomain: appBaseUrl,
  apiDomain: appBaseUrl,
  websiteBasePath: "/auth",
  apiBasePath: "/api/auth",
};
