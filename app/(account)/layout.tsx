export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex h-screen w-screen items-center justify-center 
      bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 
      p-2 sm:p-4 lg:p-8 dark"
    >
      {children}
    </div>
  );
}
