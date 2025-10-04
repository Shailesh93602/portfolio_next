import { SOCIAL_LINKS } from "@/lib/constants";
import { Achievement, Experience } from "@/types";

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export   const achievements: Achievement[] = [
    {
      title: "Institute Rank 1",
      description:
        "Achieved Institute Rank 1 on GeeksforGeeks coding platform with 604+ problems solved",
      iconName: "trophy",
      link: SOCIAL_LINKS.GEEKSFORGEEKS,
    },
    {
      title: "5 Star Rating on HackerRank",
      description:
        "Achieved 5 star rating in multiple programming skills including Problem Solving and Python",
      iconName: "star",
      link: SOCIAL_LINKS.HACKERRANK,
    },
    {
      title: "CodeChef Problem Solver",
      description:
        "Active competitive programmer with consistent problem-solving on CodeChef platform",
      iconName: "code",
      link: SOCIAL_LINKS.CODECHEF,
    },
    {
      title: "Hackathon Finalist",
      description:
        "Finalist in New India Vibrant Hackathon 2023 - Built ITI Alumni Tracking System using React and PHP, focusing on frontend development",
      iconName: "award",
    },
];
  

export  const experiences: Experience[] = [
    {
      title: "Software Engineer",
      company: "ContextQA",
      period: "July 2025 - Present",
      // optional companyUrl / logo can be provided; logo files not required
      companyUrl: "https://contextqa.com",
      skills: [
        "Next.js",
        "Tailwind CSS",
        "Shadcn UI",
        "Node.js",
        "Express.js",
        "TypeScript",
        "MongoDB",
        "PostgreSQL",
        "Sequelize",
        "TypeORM",
        "OAuth",
        "Stripe",
        "Firebase",
        "Chrome Extensions (published)",
      ],
      highlights: [
        "Delivered 2 Chrome extensions with stunning UI and robust backend systems.",
        "Full-stack development with a focus on scalable frontend and backend architecture.",
        "Open to sharing more details about this role on request.",
      ],
      description: `Working as a Full Stack Developer focused on frontend and backend work. I work on frontend using Next.js, Tailwind CSS and Shadcn UI; backend using Node.js, Express.js and TypeScript, with MongoDB and PostgreSQL. I also develop Chrome extensions (two shipped) and contributed across the full stack during this short period.`,
    },
    {
      title: "Software Developer",
      company: "eSparkBiz Technologies",
      period: "August 2024 - July 2025",
      companyUrl: "https://www.esparkinfo.com/",
      skills: [
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "Tailwind CSS",
        "Sequelize",
        "TypeORM",
        "OAuth",
        "Stripe",
        "Firebase",
      ],
      highlights: [
        "Worked on two projects simultaneously: a client project delivered to specific client requirements, and an in-house project delivered within time limits.",
        "Both clients were satisfied with the delivered work.",
      ],
      description: `Working as a Full Stack Developer, focusing on building high-quality software solutions using modern web technologies. Responsibilities included communicating with clients, developing scalable applications, implementing database solutions, and building responsive UIs.`,
    },
    {
      title: "Software Developer Intern",
      company: "eSparkBiz Technologies",
      period: "January 2024 - August 2024",
  skills: ["React", "Next.js", "Node.js", "TypeScript", "Firebase"],
      highlights: ["Developed a group project with a team during the internship."],
      description: `Gained industry experience through hands-on work with modern web technologies. Built demo projects, fixed production bugs, learned best practices, and collaborated in agile teams.`,
    },
  ];