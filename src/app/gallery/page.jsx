import fs from 'fs';
import path from 'path';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallaxGallery from "@/components/ParallaxGallery";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "Gallery",
  description: "Photo showcase from UOK Robot Games events.",
};

export default function GalleryPage() {
  // Read images directory statically on the server
  let imageFiles = [];
  try {
    const imagesDir = path.join(process.cwd(), 'public/images/gallery');
    const files = fs.readdirSync(imagesDir);
    
    imageFiles = files
      .filter(file => /\.(png|jpe?g|webp)$/i.test(file))
      .map(file => `/images/gallery/${file}`);
  } catch (error) {
    console.error("Error reading gallery directory:", error);
  }

  // Ensure we have fallback images if the folder is empty of valid images
  if (imageFiles.length === 0) {
    imageFiles = [
      "/images/robot-combat-1.png",
      "/images/arena-battle.png",
      "/images/robot-combat-2.png"
    ];
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16 bg-[#000000]">
        <FadeIn direction="up">
          <ParallaxGallery initialImages={imageFiles} />
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
