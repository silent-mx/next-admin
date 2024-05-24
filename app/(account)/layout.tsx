import { SvgLogo } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={cn(
        "dark h-screen w-screen",
        "flex flex-col justify-between",
        "bg-[url('/image/login-bg.png')] bg-cover bg-center bg-no-repeat",
        "p-4 md:p-8"
      )}
    >
      <SvgLogo className="text-[#0A4B9D] w-32 h-9"></SvgLogo>
      <div className="flex items-center justify-center md:justify-end md:mr-32">{children}</div>
      <p className="self-center shrink-0 text-sm text-default-500">
        版权所有 © {new Date().getFullYear()} 中国电信股份有限公司昭通分公司
      </p>
    </main>
  );
}
