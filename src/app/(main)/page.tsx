import HeroSlider from "@/components/HeroSliderClient";
import FeaturedStudios from "@/components/FeaturedStudios";
import CategoryShowcase from "@/components/CategoryShowcase";
import HowBookingWorks from "@/components/HowBookingWorks";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <CategoryShowcase />
      <HowBookingWorks />
    </>
  );
}
