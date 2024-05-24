import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      auth?: string[];
      phoneNumber?: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "用户名或邮箱", type: "text" },
        password: { label: "密码", type: "password" },
      },

      async authorize(credentials) {
        const tokenRes = await fetch(`${process.env.NEXT_API_HOST}/connect/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "password",
            scope: "OrderSys offline_access",
            client_id: "OrderSys_Web",
            username: `${credentials?.username}`,
            password: `${credentials?.password}`,
          }),
        });

        if (!tokenRes.ok) {
          if (tokenRes.status == 500) {
            throw new Error("服务器内部错误");
          }

          const { error_description } = await tokenRes.json();
          if (error_description.startsWith("The user account has been locked")) {
            throw new Error("账号已被锁定, 请稍后再试");
          }
          if (error_description.startsWith("Invalid username or password")) {
            throw new Error("用户名或密码错误");
          }

          throw new Error(error_description || tokenRes.statusText);
        }

        return (await tokenRes.json()) ?? null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && user) {
        const appConfigRes = await fetch(
          `${process.env.NEXT_API_HOST}/api/abp/application-configuration?IncludeLocalizationResources=false`,
          {
            headers: {
              Authorization: `Bearer ${(user as any).access_token}`,
            },
          }
        );
        if (!appConfigRes.ok) {
          throw new Error("app初始化失败");
        }
        const appConfig = (await appConfigRes.json()) ?? {};
        if (appConfig.currentUser && appConfig.currentUser.isAuthenticated) {
          (account as any).access_token = (user as any).access_token;
          (account as any).refresh_token = (user as any)?.refresh_token;
          (account as any).expires_in = Date.now() + ((user as any)?.expires_in - 600) * 1000;
          (account as any).token_type = (user as any)?.token_type;
          (account as any).phone_number = appConfig.currentUser.phoneNumber;
          (account as any).auth = Object.keys(appConfig.auth.grantedPolicies);
          account.userId = appConfig.currentUser.id;

          (user as any).access_token = undefined;
          (user as any).refresh_token = undefined;
          (user as any).expires_in = undefined;
          (user as any).token_type = undefined;
          user.name = appConfig.currentUser.userName;
          user.email = appConfig.currentUser.email;

          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_in = account.expires_in;
        token.token_type = account.token_type;
        token.phone_number = account.phone_number;
        token.auth = account.auth;
        token.userId = account.userId;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.id = token.userId;
      (session as any).user.phone_number = token.phone_number;
      (session as any).access_token = token.access_token;
      (session as any).expires = token.expires_in;
      (session as any).auth = token.auth;
      return session;
    },
  },
});
