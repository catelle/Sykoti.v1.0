import InstallButton from "@/components/InstallPromt";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex dark:bg-gray-900">
    {/* LEFT */}
    <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 dark:bg-gray-800">
      <Link
        href="/"
        className="flex items-center justify-center lg:justify-start gap-2"
      >
        <Image src="/logo.png" alt="logo" width={32} height={32} />
        <span className="hidden lg:block font-bold text-gray-800 dark:text-white">Sykoti</span>
      </Link>
      <Menu />
    </div>
    {/* RIGHT */}
    <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] dark:bg-gray-900 overflow-scroll flex flex-col">
      <Navbar />
      {children}
      <InstallButton />
    </div>
  </div>
  
  );
}
