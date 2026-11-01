import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSliderClient";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <HeroSlider />
      </main>
    </>
  );
}
