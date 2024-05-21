import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  debug: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "用户名或邮箱", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_API_HOST}/connect/token`, {
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

        if (!res.ok) {
          throw new Error("用户名或密码错误");
        }

        const data = await res.json();
        return data;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log(token, user);
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      console.log(session, token);
      session.user = token.user as any;
      return session;
    },
  },
});
