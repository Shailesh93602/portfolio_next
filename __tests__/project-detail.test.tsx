import React from "react";
import { render, screen, within } from "@testing-library/react";
import ProjectDetailContent from "@/app/portfolio/[id]/ProjectDetailContent";
import { projects, type Project } from "@/constants/projects";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

// jsdom has no IntersectionObserver; framer-motion's whileInView needs one.
beforeAll(() => {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.assign(window, { IntersectionObserver: NoopObserver });
});

const byId = (id: string) => {
  const p = projects.find((x) => x.id === id);
  if (!p) throw new Error(`no project ${id}`);
  return p;
};

const showcase = projects.filter((p) => p.isShowcase);
const standard = projects.filter((p) => !p.isShowcase);

describe("ProjectDetailContent — showcase layout", () => {
  it("has showcase and standard projects to render", () => {
    expect(showcase.length).toBeGreaterThan(0);
    expect(standard.length).toBeGreaterThan(0);
  });

  it.each(showcase.map((p) => [p.id, p] as const))(
    "%s renders its hero, case study and footer",
    (_id, p) => {
      render(<ProjectDetailContent project={p} />);
      expect(
        screen.getByRole("heading", { level: 1, name: p.title })
      ).toBeInTheDocument();
      expect(screen.getByText("Featured Project")).toBeInTheDocument();
      if (p.problem) expect(screen.getByText(p.problem)).toBeInTheDocument();
      if (p.solution) expect(screen.getByText(p.solution)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Start a Discussion" })
      ).toHaveAttribute("href", "/contact");
      for (const step of p.userFlow ?? []) {
        expect(screen.getByText(step.step)).toBeInTheDocument();
      }
      for (const s of p.showcases ?? []) {
        expect(
          screen.getByRole("heading", { level: 3, name: s.title })
        ).toBeInTheDocument();
      }
    }
  );

  it("a private repository is labelled, never linked", () => {
    const p = byId("khatago");
    expect(p.githubPrivate).toBe(true);
    render(<ProjectDetailContent project={p} />);
    expect(screen.getByTitle("This repository is private")).toHaveTextContent(
      "Private repository"
    );
    expect(screen.queryByRole("link", { name: /Repository/ })).toBeNull();
  });

  it("a public repository links out in a new tab", () => {
    const p = showcase.find((x) => x.github && !x.githubPrivate);
    expect(p).toBeDefined();
    render(<ProjectDetailContent project={p!} />);
    const link = screen.getByRole("link", { name: /Repository/ });
    expect(link).toHaveAttribute("href", p!.github);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("only EduScale carries the framework stat strip", () => {
    const { unmount } = render(
      <ProjectDetailContent project={byId("eduscale")} />
    );
    expect(screen.getByText("Next.js 16")).toBeInTheDocument();
    expect(screen.getByText("Complexity")).toBeInTheDocument();
    unmount();
    render(<ProjectDetailContent project={byId("khatago")} />);
    expect(screen.queryByText("Complexity")).toBeNull();
  });

  it("renders incidents numbered from 01 with all four fields", () => {
    const incident = {
      title: "Duplicate rows",
      symptom: "two rows per message",
      hypothesis: "retries",
      fix: "unique key",
      confirmed: "a concurrency test",
    };
    const p: Project = { ...byId("eduscale"), incidents: [incident] };
    render(<ProjectDetailContent project={p} />);
    const card = screen.getByText(incident.title).closest("article");
    expect(card).not.toBeNull();
    const scope = within(card as HTMLElement);
    expect(scope.getByText("01")).toBeInTheDocument();
    for (const value of Object.values(incident)) {
      expect(scope.getByText(value)).toBeInTheDocument();
    }
  });

  it("falls back to the legacy gallery when there are no showcases", () => {
    const p: Project = {
      ...byId("eduscale"),
      showcases: [],
      gallery: ["/a.png", "/b.webm"],
    };
    const { container } = render(<ProjectDetailContent project={p} />);
    expect(screen.getByText("Project Gallery")).toBeInTheDocument();
    expect(screen.getByAltText(`${p.title} screenshot 1`)).toBeInTheDocument();
    expect(container.querySelector('video[src="/b.webm"]')).not.toBeNull();
    expect(screen.queryByText("Screens")).toBeNull();
  });
});

describe("ProjectDetailContent — standard layout", () => {
  it.each(standard.map((p) => [p.id, p] as const))(
    "%s renders its overview, sidebar and stack",
    (_id, p) => {
      render(<ProjectDetailContent project={p} />);
      expect(
        screen.getByRole("heading", { level: 1, name: p.title })
      ).toBeInTheDocument();
      expect(screen.getByText("Back to Portfolio")).toBeInTheDocument();
      expect(screen.getByText("Quick Actions")).toBeInTheDocument();
      expect(
        screen.getByText(p.detailedDescription || p.description)
      ).toBeInTheDocument();
      for (const tech of p.techStack ?? []) {
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0);
      }
      if (p.github && !p.githubPrivate) {
        expect(
          screen.getByRole("link", { name: /View Source/ })
        ).toHaveAttribute("href", p.github);
      }
      if (p.live) {
        expect(
          screen.getByRole("link", { name: /Live Preview/ })
        ).toHaveAttribute("href", p.live);
      }
    }
  );

  it("labels a private repository in the sidebar instead of linking it", () => {
    const p: Project = {
      ...standard[0],
      github: "https://github.com/o/private",
      githubPrivate: true,
    };
    render(<ProjectDetailContent project={p} />);
    expect(screen.getByTitle("This repository is private")).toHaveTextContent(
      "Private repository"
    );
    expect(screen.queryByRole("link", { name: /View Source/ })).toBeNull();
  });
});
