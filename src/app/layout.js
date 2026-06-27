import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://robotgames.ecsc-uok.com";
const OG_IMAGE = "https://ik.imagekit.io/wfnazmyxh/images/arena-battle.png?updatedAt=1777697842835";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "UOK Robot Games 2K26 | Robot Battles & Robot Race — University of Kelaniya",
    template: "%s | UOK Robot Games 2K26",
  },
  description:
    "UOK Robot Games 2K26 — Sri Lanka's largest inter-university robotics competition featuring Robot Battles (heavyweight & lightweight) and Robot Race. Organized by ECSC, University of Kelaniya. Register now for the ultimate robotics festival with Rs. 300,000+ in prizes.",
  keywords: [
    "UOK Robot Games",
    "UOK Robot Battles",
    "UOK Robot Games 2K26",
    "UOK Robot Battles 2K26",
    "Robot Battles Sri Lanka",
    "Robot Race Sri Lanka",
    "University of Kelaniya Robot Competition",
    "UOK robotics",
    "ECSC UOK",
    "Electronics and Computer Science Club",
    "robot battle competition",
    "robot race competition",
    "Sri Lanka robot competition",
    "inter-university robotics",
    "heavyweight robot battle",
    "lightweight robot battle",
    "autonomous robot race",
    "robotics festival Sri Lanka",
    "UOK Robot Games registration",
    "robot competition Kelaniya",
  ],
  authors: [
    { name: "Electronics and Computer Science Club (ECSC)", url: SITE_URL },
    { name: "University of Kelaniya" },
  ],
  creator: "ECSC - University of Kelaniya",
  publisher: "Electronics and Computer Science Club (ECSC)",
  icons: {
    icon: "https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160",
    apple: "https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "UOK Robot Games 2K26",
    title: "UOK Robot Games 2K26 | Robot Battles & Robot Race — University of Kelaniya",
    description:
      "Sri Lanka's largest inter-university robotics competition. Robot Battles (heavyweight & lightweight) and Robot Race. Rs. 300,000+ in prizes. Organized by ECSC, University of Kelaniya.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "UOK Robot Games 2K26 — Robot Battles & Robot Race Arena",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UOK Robot Games 2K26 | Robot Battles & Robot Race",
    description:
      "Sri Lanka's largest inter-university robotics festival. Robot Battles & Robot Race with Rs. 300,000+ prizes. Register now!",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

// JSON-LD Structured Data for the Event
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "UOK Robot Games 2K26",
  description:
    "Sri Lanka's largest inter-university robotics competition featuring Robot Battles (heavyweight & lightweight combat) and Robot Race (autonomous line-following). Organized by the Electronics and Computer Science Club (ECSC), University of Kelaniya.",
  url: SITE_URL,
  image: OG_IMAGE,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  organizer: {
    "@type": "Organization",
    name: "Electronics and Computer Science Club (ECSC)",
    url: "https://ecsc-uok.com",
  },
  location: {
    "@type": "Place",
    name: "University of Kelaniya",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kelaniya",
      addressCountry: "LK",
    },
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "LKR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/register`,
    validFrom: "2026-07-01",
  },
  performer: {
    "@type": "Organization",
    name: "University of Kelaniya - ECSC",
  },
};

// JSON-LD for the Organization
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UOK Robot Games",
  alternateName: ["UOK Robot Battles", "ECSC Robot Games", "University of Kelaniya Robot Games"],
  url: SITE_URL,
  logo: "https://ik.imagekit.io/wfnazmyxh/images/logo.png?updatedAt=1777697840160",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@ecsc-uok.com",
    contactType: "customer service",
  },
  sameAs: [],
};

// JSON-LD for the Website (helps with sitelinks search box)
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UOK Robot Games 2K26",
  alternateName: ["UOK Robot Battles", "UOK Robot Games"],
  url: SITE_URL,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} dark antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-[#000000] text-white w-full max-w-[100vw]">
        {children}
      </body>
    </html>
  );
}

