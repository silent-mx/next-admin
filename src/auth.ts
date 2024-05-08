import { fetchWithBaseUrl } from "@/utils/fetch";
import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await fetchWithBaseUrl("/connect/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "password",
            client_id: "OrderSys_Web",
            client_secret: "",
            scope: "OrderSys offline_access",
            username: `${credentials?.username}`,
            password: `${credentials?.password}`,
          }),
        });

        return res;
      },
    }),
  ],
});
