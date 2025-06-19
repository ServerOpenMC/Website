import AboutSection from "@/components/home/about-section";
import DiscordSection from "@/components/home/discord-section";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <DiscordSection />
    </>
  );
}
