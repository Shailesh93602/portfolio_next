import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BLOG_AUTHOR, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: `Hire | ${BLOG_AUTHOR.name}`,
  description:
    "Hire Shailesh Chaudhari — Full-stack developer available for freelance and contract work. Specializes in Next.js, React, Node.js, and scalable web apps.",
  alternates: { canonical: `${SITE_URL}/hire` },
};

export default function HirePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <h1>Hire Me — Full-Stack Developer</h1>
        <p>
          I'm a full-stack developer focused on building performant, scalable web
          applications. I work with Next.js, React, Node.js, and databases like
          MongoDB. I take on freelance, contract, and full-time opportunities.
        </p>

        <h2>Services I offer</h2>
        <ul>
          <li>Full-stack web application development (Next.js / React / Node)</li>
          <li>Performance optimization & Core Web Vitals improvements</li>
          <li>API design and backend architecture</li>
          <li>Migration and modernization (legacy → modern stack)</li>
          <li>Consulting, code reviews, and technical mentoring</li>
        </ul>

        <h2>How I work</h2>
        <p>
          I prefer clear requirements, small iterations, and delivering value
          quickly. I share progress frequently and provide testable, maintainable
          code with documentation.
        </p>

        <h2>Rates & availability</h2>
        <p>
          Availability and rates vary by project. For short engagements I prefer
          fixed-price milestones; for long-term work I can work hourly or on a
          retainer basis. Contact me for a custom quote.
        </p>

        <div className="flex gap-4">
          <Link href="/contact">
            <Button>Contact Me</Button>
          </Link>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            <Button variant="ghost">View Resume</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
