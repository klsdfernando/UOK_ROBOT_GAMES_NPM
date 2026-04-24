import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "UOK Robot Games 2K26",
    template: "%s | UOK Robot Games",
  },
  description:
    "UOK Robot Games 2K26 — The ultimate multi-competition robotics festival featuring Robot Battles and Robot Race, organized by ECSC, University of Kelaniya.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} dark antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-[#000000] text-white w-full max-w-[100vw]">
        {children}
      </body>
    </html>
  );
}
