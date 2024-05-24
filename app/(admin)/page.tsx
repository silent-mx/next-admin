import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  return <main>Home Page {JSON.stringify(session)}</main>;
}
