import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import CategoriesSection from "./sections/CategoriesSection";
import TimelineSection from "./sections/TimelineSection";
import AnnouncementsSection from "./sections/AnnouncementsSection";
import CommitteeSection from "./sections/CommitteeSection";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <FadeIn direction="up" delay={0.1}>
          <HeroSection />
        </FadeIn>
        
        <FadeIn direction="up" delay={0.2} viewAmount={0.1}>
          <AboutSection />
        </FadeIn>

        <FadeIn direction="up" delay={0.2} viewAmount={0.1}>
          <AnnouncementsSection />
        </FadeIn>

        <FadeIn direction="up" delay={0.2} viewAmount={0.1}>
          <CategoriesSection />
        </FadeIn>

        <FadeIn direction="up" delay={0.2} viewAmount={0.1}>
          <TimelineSection />
        </FadeIn>

        <FadeIn direction="up" delay={0.2} viewAmount={0.1}>
          <CommitteeSection />
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
