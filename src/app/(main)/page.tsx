import HeroSlider from "@/components/HeroSliderClient";
import FeaturedStudios from "@/components/FeaturedStudios";
import CategoryShowcase from "@/components/CategoryShowcase";
import HowBookingWorks from "@/components/HowBookingWorks";
import HostGuarantee from "@/components/HostGuarantee";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <CategoryShowcase />
      <HowBookingWorks />
      <HostGuarantee />
    </>
  );
}
