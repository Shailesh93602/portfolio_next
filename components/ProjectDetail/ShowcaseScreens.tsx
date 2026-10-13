"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Project, ShowcaseItem } from "@/constants/projects";
import ThemeComparison from "@/components/Showcase/ThemeComparison";

function ScreenImage({
  projectTitle,
  showcase,
}: {
  projectTitle: string;
  showcase: ShowcaseItem;
}) {
  if (showcase.imageDark && showcase.imageLight) {
    return (
      <ThemeComparison
        title=""
        alt={`${projectTitle} — ${showcase.title}`}
        darkImage={showcase.imageDark}
        lightImage={showcase.imageLight}
      />
    );
  }
  return (
    <Image
      src={showcase.image || showcase.imageDark || showcase.imageLight || ""}
      alt={showcase.title}
      fill
      unoptimized
      sizes="(max-width: 1024px) 100vw, 66vw"
      className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
    />
  );
}

/** One screen, alternating text-left / text-right down the page. */
function ScreenRow({
  projectTitle,
  showcase,
  flipped,
}: {
  projectTitle: string;
  showcase: ShowcaseItem;
  flipped: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
    >
      <div className={`space-y-6 lg:col-span-4 ${flipped ? "lg:order-2" : ""}`}>
        <h3 className="text-3xl font-bold">{showcase.title}</h3>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {showcase.description}
        </p>
      </div>

      <div className={`relative lg:col-span-8 ${flipped ? "lg:order-1" : ""}`}>
        <div className="absolute inset-0 scale-90 rounded-full bg-primary/5 blur-[100px]" />

        <div className="glassmorphism relative z-10 w-full rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/10 to-transparent p-4 shadow-2xl">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-black ring-1 ring-white/10">
            <ScreenImage projectTitle={projectTitle} showcase={showcase} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScreensSection({
  projectTitle,
  showcases,
}: {
  projectTitle: string;
  showcases: ShowcaseItem[];
}) {
  return (
    <section className="space-y-16">
      <div className="mx-auto mb-20 max-w-3xl space-y-4 text-center">
        <h2 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl">
          Screens
        </h2>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Screenshots from the shipped product.
        </p>
      </div>

      <div className="space-y-32">
        {showcases.map((showcase, idx) => (
          <ScreenRow
            key={showcase.title}
            projectTitle={projectTitle}
            showcase={showcase}
            flipped={idx % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}

const isVideo = (src: string) => src.endsWith(".webm") || src.endsWith(".mp4");

/** Legacy gallery, for showcase projects that have no `showcases` yet. */
function GallerySection({
  projectTitle,
  gallery,
}: {
  projectTitle: string;
  gallery: string[];
}) {
  return (
    <section className="space-y-12">
      <div className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
        <h2 className="text-4xl font-bold uppercase italic tracking-tight md:text-5xl">
          Project Gallery
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          A visual walkthrough of the platform's core interfaces and user
          experiences.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {gallery.map((img, idx) => (
          <motion.div
            key={img}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative aspect-video overflow-hidden rounded-3xl border border-border shadow-2xl"
          >
            {isVideo(img) ? (
              <video
                src={img}
                className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                src={img}
                alt={`${projectTitle} screenshot ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-8 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-sm font-bold uppercase tracking-wider text-white">
                View Full Resolution
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/** The showcase screens when the project has them, else its legacy gallery. */
export default function ShowcaseScreens({ project }: { project: Project }) {
  if (project.showcases && project.showcases.length > 0) {
    return (
      <ScreensSection
        projectTitle={project.title}
        showcases={project.showcases}
      />
    );
  }
  if (project.gallery && project.gallery.length > 0) {
    return (
      <GallerySection projectTitle={project.title} gallery={project.gallery} />
    );
  }
  return null;
}
