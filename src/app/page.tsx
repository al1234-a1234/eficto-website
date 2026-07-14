import { Hero } from "@/components/Hero";
import { AmbienceSection } from "@/components/AmbienceSection";
import { MenuPreview } from "@/components/MenuPreview";
import { ReviewsPreview } from "@/components/ReviewsPreview";
import { ContactTeaser } from "@/components/ContactTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AmbienceSection />
      <MenuPreview />
      <ReviewsPreview />
      <ContactTeaser />
    </>
  );
}
