import db from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementsClientView from "./AnnouncementsClientView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Official Announcements",
  description:
    "Stay updated with all official announcements, workshop links, rule updates, and live dispatches from UOK Robot Games 2K26.",
};

export default async function AnnouncementsPage() {
  let announcements = [];

  try {
    if (db) {
      const snapshot = await db
        .collection("announcements")
        .orderBy("createdAt", "desc")
        .get();

      announcements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  } catch (error) {
    console.error("Error fetching announcements for page:", error);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#080808]">
        <AnnouncementsClientView initialAnnouncements={announcements} />
      </main>
      <Footer />
    </>
  );
}
