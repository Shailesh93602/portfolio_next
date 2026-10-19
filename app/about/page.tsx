export { metadata } from "./metadata";
import AboutContent from "./AboutContent";
import { profilePageSchema } from "@/lib/structured-data";

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <AboutContent />
    </>
  );
}
