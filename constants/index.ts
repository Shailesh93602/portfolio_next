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
      description: `At <strong>ContextQA</strong>, I work as a proactive software engineer, delivering features quickly while ensuring high-quality, bug-free releases. I work with a modern stack including <strong>Next.js, TailwindCSS, Shadcn UI, Node.js, Express.js, PostgreSQL, MongoDB, Prisma, and Chrome Extensions</strong>.

<strong>🔧 Accessibility Testing Extension (AxeTOS)</strong>
Built a comprehensive Chrome extension and backend system that enables automated accessibility testing with intelligent fix suggestions, standards-based validation (WCAG A/AA/AAA), and detailed issue reports with proper locators.

<strong>🧪 Web Testing Extension (Vibe Testing)</strong>
Developed a versatile Chrome extension for testing websites, with seamless integration for platforms like V0, Lovable, and Replit. Features include real-time debugging with screenshots, configurable test parameters, AI-generated bug reports with detailed scenarios, and innovative chat-based bug-fix workflows.

<strong>🏢 ContextQA Portal</strong>
Enhanced backend infrastructure using Node.js, Express.js, and Playwright, resolving critical bugs and implementing new features to improve platform stability and performance.

<strong>🏆 Key Achievements</strong>
• Delivered 2 production-ready Chrome extensions with scalable backend systems and intuitive UIs
• Full-stack development with emphasis on performance, scalability, and developer experience
• Open to sharing more details about this role upon request`,
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
      description: `As a <strong>Full Stack Developer</strong> at <strong>eSparkBiz Technologies</strong>, I managed multiple projects simultaneously, balancing client requirements with in-house development deadlines. I delivered impactful solutions across several platforms that showcased my expertise in both frontend and backend development.

<strong>📚 Brightmont - Education Scheduling Platform</strong>
Built comprehensive scheduling and data management features for institutes providing one-on-one teaching. Integrated external APIs (Teachworks) with Python-based scheduling services using Cplex, synchronized large datasets, implemented cloud storage workflows with S3, and developed real-time calendar UIs with advanced data manipulation capabilities.

<strong>🤟 The ASL Shop - Sign Language E-Learning Platform</strong>
Developed key modules for an American Sign Language e-learning platform. Built the Dictionary module with advanced search, filtering, and synchronization from external platforms (Coda), implemented complete Supabase authentication system, and contributed significantly to course and quiz features with intuitive user interfaces.

<strong>🏢 Proleven - Corporate Learning Platform</strong>
Improved reliability of an employee training platform by resolving critical bugs, enhancing email workflows, streamlining template and trigger systems, and implementing various performance optimizations.

<strong>🏆 Key Achievements</strong>
• Successfully delivered multiple client and in-house projects on time
• Full-stack contributions spanning API integrations, data pipelines, authentication, and UI development
• Strengthened platform reliability and user experience through critical bug fixes and performance improvements`,
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
      description: `During my <strong>Software Developer Internship</strong> at <strong>eSparkBiz Technologies</strong>, I embarked on an intensive learning journey starting with web fundamentals (<strong>MySQL, HTML, CSS, JavaScript</strong>) and quickly advanced to modern technologies including <strong>TypeScript, Node.js, Express.js with EJS, React.js, Next.js, Sequelize, TypeORM, NestJS, TailwindCSS, and Redux</strong>.

<strong>🚗 Garage Management System - Full-Stack Team Project</strong>
Contributed to a major team project built with Node.js, Express.js, and EJS. Owned the critical authentication module, implementing secure role-based access control and comprehensive user management features. Also contributed to frontend development, building responsive and intuitive UIs across core system modules with focus on user experience and design.

<strong>🛍️ Practice Projects - Skill Development</strong>
Developed multiple smaller projects, including an e-commerce platform, to strengthen understanding of scalable architecture, industry best practices, and real-world development patterns. This hands-on experience solidified my foundational skills and prepared me for professional software engineering challenges.

<strong>📈 Key Learning Outcomes</strong>
• Gained comprehensive hands-on experience across the full stack, from databases to modern frontend frameworks
• Strengthened expertise in authentication systems, role-based access control, and responsive UI design
• Built a solid foundation for professional software engineering through intensive learning and practical application`,
    },
  ];