import { SvgLogo } from "@/components/icons";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="dark h-screen w-screen flex flex-col justify-between
        p-4 md:p-8 bg-[url('/login-bg.png')] bg-cover bg-center bg-no-repeat"
    >
      <SvgLogo className="text-[#0A4B9D]"></SvgLogo>
      <div className="flex items-center justify-center md:justify-end md:mr-32">{children}</div>
      <p className="self-center shrink-0 text-sm text-default-600">
        版权所有 © {new Date().getFullYear()} 中国电信股份有限公司昭通分公司
      </p>
    </main>
  );
}
