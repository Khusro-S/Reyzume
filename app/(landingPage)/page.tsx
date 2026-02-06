import { CallToAction } from "@/app/(landingPage)/_components/CallToAction";
import { FAQ } from "@/app/(landingPage)/_components/FAQ";
import { Features } from "@/app/(landingPage)/_components/Features";
import { Hero } from "@/app/(landingPage)/_components/Hero";
import { HowItWorks } from "@/app/(landingPage)/_components/HowItWorks";
// import { Templates } from "@/app/(landingPage)/_components/Templates";
// import { Testimonials } from "@/app/(landingPage)/_components/Testimonials";
import WhatYouGet from "./_components/WhatYouGet";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <div className="absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto min-h-screen max-w-6xl px-4">
        <div className="flex flex-1 flex-col gap-20">
          <Hero />
          <Features />
          <HowItWorks />
          {/* <Templates /> */}
          {/* <Testimonials /> */}
          <WhatYouGet />
          <CallToAction />
          <FAQ />
        </div>
      </div>
    </>
  );
}
