import Hero from "@/components/landing/hero";
import Categories from "@/components/landing/categories";
import Prizes from "@/components/landing/prizes";
import Gallery from "@/components/landing/gallery";
import Schedule from "@/components/landing/schedule";
import Sponsors from "@/components/landing/sponsors";
import FaqRules from "@/components/landing/faq-rules";
import Cta from "@/components/landing/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Prizes />
      <Gallery />
      <Schedule />
      <Sponsors />
      <FaqRules />
      <Cta />
    </>
  );
}
