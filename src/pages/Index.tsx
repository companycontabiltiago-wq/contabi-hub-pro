import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { FreeServices } from "@/components/sections/FreeServices";
import { Services } from "@/components/sections/Services";
import { MeiAberturas } from "@/components/sections/MeiAberturas";
import { Process } from "@/components/sections/Process";
import { Reforms } from "@/components/sections/Reforms";
import { Healthcare } from "@/components/sections/Healthcare";
import { IncomeTax } from "@/components/sections/IncomeTax";
import { Plans } from "@/components/sections/Plans";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <FreeServices />
        <Services />
        <MeiAberturas />
        <Process />
        <Reforms />
        <Healthcare />
        <IncomeTax />
        <Plans />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
