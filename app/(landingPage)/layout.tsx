import { Footer } from "@/app/(landingPage)/_components/Footer";
import { Navbar } from "@/app/(landingPage)/_components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#F9FAFB] px-3 sm:px-8 lg:px-12 my-5 flex flex-col">
      <Navbar />
      <main className="mt-5 mb-10 h-full">{children}</main>
      <Footer />
    </div>
  );
}
