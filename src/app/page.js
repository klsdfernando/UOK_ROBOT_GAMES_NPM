import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import CategoriesSection from "./sections/CategoriesSection";
import TimelineSection from "./sections/TimelineSection";
import CommitteeSection from "./sections/CommitteeSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <AboutSection />
        <CategoriesSection />
        <TimelineSection />
        <CommitteeSection />
      </main>
      <Footer />
    </>
  );
}
