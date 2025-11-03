import { CallToAction } from "@/app/(landingPage)/_components/CallToAction";
import { FAQ } from "@/app/(landingPage)/_components/FAQ";
import { Features } from "@/app/(landingPage)/_components/Features";
import { Hero } from "@/app/(landingPage)/_components/Hero";
import { HowItWorks } from "@/app/(landingPage)/_components/HowItWorks";
// import { Templates } from "@/app/(landingPage)/_components/Templates";
import { Testimonials } from "@/app/(landingPage)/_components/Testimonials";

export default function Home() {
  return (
    <>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="mx-auto flex min-h-screen max-w-6xl px-4">
        <div className="flex flex-1 flex-col gap-20">
          <Hero />
          <Features />
          <HowItWorks />
          {/* <Templates /> */}
          <Testimonials />
          <CallToAction />
          <FAQ />
        </div>
      </div>
    </>
  );
}
