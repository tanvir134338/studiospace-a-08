import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSliderClient";
import CategoryShowcase from "@/components/CategoryShowcase";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <HeroSlider />
        <CategoryShowcase />
      </main>
    </>
  );
}
