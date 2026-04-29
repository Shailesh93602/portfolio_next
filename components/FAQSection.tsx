import type { FaqItem } from "@/lib/faq-data";

interface Props {
  title?: string;
  description?: string;
  items: FaqItem[];
}

// Visible FAQ markup mirroring the FAQPage JSON-LD on the same page.
// Google requires visible Q&A text matching the schema or it strips the
// rich-result eligibility — JSON-LD-only FAQ violates the policy.
// Server-rendered for SEO; uses native <details> for zero-JS expand/collapse.
export function FAQSection({ title = "Frequently asked questions", description, items }: Props) {
  return (
    <section
      className="container mx-auto px-4 py-16"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
        <div className="mt-8 divide-y divide-border rounded-2xl border bg-card/50">
          {items.map((item, idx) => (
            <details
              key={item.question}
              className="group p-6"
              open={idx === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-foreground sm:text-lg [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className="ml-4 text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
