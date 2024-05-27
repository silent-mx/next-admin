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
        const appConfig = (await appConfigRes.json()) ?? null;
        if (appConfig.currentUser && appConfig.currentUser.isAuthenticated) {
          (account as any).access_token = (user as any).access_token;
          (account as any).refresh_token = (user as any)?.refresh_token;
          (account as any).token_type = (user as any)?.token_type;
          (account as any).expires_in = (user as any)?.expires_in * 1000;
          (account as any).expires_at = Date.now() + (user as any)?.expires_in * 1000;

          (account as any).phone_number = appConfig.currentUser.phoneNumber;
          (account as any).auth = Object.keys(appConfig.auth.grantedPolicies);

          (user as any).access_token = undefined;
          (user as any).refresh_token = undefined;
          (user as any).expires_in = undefined;
          (user as any).token_type = undefined;
          user.id = appConfig.currentUser.id;
          user.name = appConfig.currentUser.userName;
          user.email = appConfig.currentUser.email;

          return true;
        } else {
          throw new Error("登录失败");
        }
      } else {
        throw new Error("登录失败");
      }
    },
    async jwt({ token, account }) {
      if (account) {
        return {
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          auth: account.auth,
          user: {
            ...token,
            phone_number: account.phone_number,
          },
        };
      } else if (Date.now() < (token as any).expires_at) {
        return token;
      } else {
        if (!token.refresh_token) {
          throw new Error("Missing refresh_token");
        }

        try {
          const refreshTokenRes = await fetch(`${process.env.NEXT_API_HOST}/connect/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: (token as any).refresh_token,
              client_id: "OrderSys_Web",
              client_secret: "",
            }),
          });

          const refreshTokenData = await refreshTokenRes.json();

          if (!refreshTokenRes.ok) {
            throw refreshTokenData;
          }

          return {
            ...token,
            access_token: refreshTokenData.access_token,
            refresh_token: refreshTokenData.refresh_token ?? token.refresh_token,
            expires_at: Date.now() + refreshTokenData.expires_in * 1000,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
    async session({ session, token }) {
      (session as any).error = token.error;
      (session as any).user.phone_number = token.phone_number;
      (session as any).expires = token.expires_at;
      return {
        ...session,
        ...token,
      };
    },
  },
});
