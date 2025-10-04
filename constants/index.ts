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
      companyUrl: "https://contextqa.com",
      skills: [
        "Next.js",
        "TailwindCSS",
        "Shadcn UI",
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "MongoDB",
        "Prisma",
        "Chrome Extensions"
      ],
      highlights: [
        "Delivered 2 Chrome extensions with stunning UI and robust backend systems.",
        "Full-stack development with a focus on scalable frontend and backend architecture.",
        "Open to sharing more details about this role on request.",
      ],
      description: `Working as a Software Engineer at ContextQA, I play an impactful role as a call-to-action person, delivering things fast, shipping faster, and ensuring bug-free releases. I work with a modern tech stack including Next.js, TailwindCSS, Shadcn UI, Node.js, Express.js, PostgreSQL, MongoDB, Prisma, and Chrome Extensions.

• AxeTOS: A comprehensive Chrome extension for accessibility testing. I built both the extension and the backend in Node.js and Express.js. The extension provides accessibility testing with proper locators, fix suggestions, and the ability to temporarily show or permanently apply fixes using script injection. Users can test their sites directly through the extension, receive detailed reports of issues found, and access fixes. The system allows users to choose what to focus on and select standards like WCAG Level A, AA, or AAA.

• Vibe Testing: A Chrome extension for testing websites built using vibe coding platforms like V0, Lovable, or Replit. The extension integrates into the chat section of these platforms. Users can configure agents, timeouts, URLs, and email notifications, then start testing to see live execution steps with real-time screenshots via Socket.io and network logs for debugging. After completion, users receive detailed AI-generated reports with bug summaries, detailed scenarios, metadata for failed test cases, and screen recordings. Reports are also emailed if specified. Users can provide testing instructions or additional info for the AI agent. The "Apply Fixes to Chat" button fetches consolidated bug reports and feeds them into the platform's chat, allowing users to modify and submit for agent fixing. The AI project manager asks contextual questions based on previous runs to better understand the project. I primarily worked on the extension frontend while leveraging the existing backend infrastructure.

• ContextQA Portal: I contributed to the backend using Node.js, Express.js, and Playwright, helping resolve crucial bugs and adding new features that enhance the platform's capabilities.`,
    },
    {
      title: "Software Developer",
      company: "eSparkBiz Technologies",
      period: "August 2024 - July 2025",
      companyUrl: "https://www.esparkinfo.com/",
      skills: [
        "React.js",
        "Node.js",
        "Express.js",
        "TailwindCSS",
        "PostgreSQL",
        "Supabase",
        "OAuth",
        "Stripe",
        "Firebase"
      ],
      highlights: [
        "Managed two projects simultaneously: client requirements and time-based delivery for in-house projects",
        "Led development of Brightmont platform with complex data synchronization and real-time scheduling features",
        "Built comprehensive ASL Shop e-learning platform with dictionary module and Supabase authentication",
        "Resolved critical bugs and improved system reliability across multiple projects including Proleven"
      ],
      description: `Working as a Full Stack Developer, I successfully managed two projects simultaneously while meeting client requirements and delivering in-house projects on time. I worked on several impactful projects that showcased my full-stack capabilities.

• Brightmont: A comprehensive platform used by institutes providing one-on-one teaching. I integrated with Teachworks API to manage large databases, synchronized records in desired formats, and provided data to Python services using Cplex for schedule generation. The generated schedules are stored in S3 buckets, and I implemented queue-based systems to pull and format this data. I created stunning UIs with advanced calendar features for data manipulation, real-time updates using Socket.io, and comprehensive data management interfaces.

• The ASL Shop: An e-learning platform for American Sign Language. I developed the crucial Dictionary module, synchronizing data from Coda platform and storing it in our database with a beautiful UI featuring filters, search, and advanced functionality. I handled all Supabase-related authentication and integration. Additionally, I contributed significantly to course and quiz modules, playing an impactful role in their completion.

• Proleven: A learning platform for employee training. I resolved critical bugs across the system, particularly focusing on email functionality, template management, triggers, and various system improvements to enhance reliability and user experience.`,
    },
    {
      title: "Software Developer Intern",
      company: "eSparkBiz Technologies",
      period: "January 2024 - August 2024",
      companyUrl: "https://www.esparkinfo.com/",
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Express.js",
        "EJS",
        "React.js",
        "Next.js",
        "MySQL",
        "Sequelize",
        "TypeORM",
        "Authentication",
        "Role-based Access Control",
        "NestJS",
        "TailwindCSS",
        "Shadcn UI",
        "PostgreSQL",
        "IndexedDB",
        "Redux"
      ],
      highlights: [
        "Developed robust authentication system with role-based access control for Garage Management System",
        "Built stunning user interfaces for multiple modules using modern web technologies",
        "Contributed to full-stack team project from concept to deployment",
        "Learned industry best practices through hands-on dummy projects including e-commerce website",
        "Progressed from fundamentals (HTML/CSS/JS) to advanced frameworks (React/Next.js/Node.js)"
      ],
      description: `Embarked on an intensive learning journey starting with web fundamentals including MySQL, HTML, CSS, and JavaScript. Rapidly progressed to mastering TypeScript, Node.js, and Express.js with EJS templating. Further expanded skills to include React.js, Next.js, Sequelize, TypeORM, and various other modern technologies.

Worked on a significant team project - Garage Management System built with Node.js, Express.js, and EJS. Took ownership of the critical authentication module, implementing robust authentication mechanisms with comprehensive role-based access control to ensure secure user management and data protection.

Additionally contributed to the frontend development, crafting stunning and intuitive user interfaces for most of the system's modules, focusing on user experience and responsive design principles.

Following the main project, developed several dummy projects including an e-commerce website to deepen understanding of industry best practices, scalable architecture, and real-world application development patterns. This hands-on experience solidified foundational skills while preparing for professional software development challenges.`,
    },
  ];