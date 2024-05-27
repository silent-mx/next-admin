import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    if (!req.nextUrl.pathname.startsWith("/login")) {
      const redirectUrl = new URL("/login", req.nextUrl as unknown as URL);
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return Response.redirect(redirectUrl);
    }
  } else {
    if (req.nextUrl.pathname.startsWith("/login")) {
      return Response.redirect(new URL("/", req.nextUrl as unknown as URL));
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|image/.*).*)"],
};
