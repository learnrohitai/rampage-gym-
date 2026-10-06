import Hero from "@/components/landing/hero";
import Categories from "@/components/landing/categories";
import Gallery from "@/components/landing/gallery";
import Cta from "@/components/landing/cta";
import StickyCta from "@/components/landing/sticky-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Gallery />
      <Cta />
      <StickyCta />
    </>
  );
}
