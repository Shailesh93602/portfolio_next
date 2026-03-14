export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  live?: string;
  detailedDescription?: string;
  features?: string[];
  techStack?: string[];
  challenges?: string;
  solutions?: string;
}

export const projects: Project[] = [
  {
    id: "vibe-testing",
    title: "Vibe Testing",
    description:
      "AI-Powered Web Testing Chrome Extension that automates UI testing using advanced AI agents and real-time execution engines.",
    image: "/Images/portfolio1.png", // Using portfolio1.png as placeholder or I can generate one
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Chrome Extension", "AI/ML"],
    detailedDescription: "Vibe Testing is a sophisticated Chrome extension designed for the modern web ecosystem. it specifically targets websites built on rapid development platforms like Replit, v0, and Lovable, while maintaining full compatibility with any standard web application. It integrates with ContextQA's AI agents to perform autonomous UI validation.",
    features: [
      "AI-driven autonomous UI testing and validation",
      "Real-time communication with execution engine",
      "Interactive modals for live test results and logs",
      "Support for v0, Replit, and Lovable platforms",
      "Advanced image previews and execution data visualization"
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "ContextQA AI API", "WebSockets"],
    challenges: "Developing a real-time bridge between a browser extension and a remote AI execution engine while maintaining a low-latency, 'stunning' user experience was the primary technical hurdle.",
    solutions: "Implemented a robust WebSocket-based communication layer and optimized Next.js rendering within the Chrome extension environment to ensure smooth, real-time UI updates."
  },
  {
    id: "axetos",
    title: "AxeTos",
    description:
      "Professional Accessibility Testing Suite (Chrome Extension + Node.js) for automated WCAG compliance and instant fixes.",
    image: "/Images/portfolio1.png",
    tags: ["Node.js", "Next.js", "TypeScript", "Tailwind CSS", "Accessibility"],
    detailedDescription: "AxeTos is a comprehensive solution for web accessibility. It combines a powerful Chrome extension with a dedicated Node.js backend to audit websites against WCAG A, AA, and AAA standards. Beyond just identifying issues, it offers a revolutionary 'instant fix' capability.",
    features: [
      "Automated WCAG A/AA/AAA standards auditing",
      "Component-level issue visualization in the UI",
      "Intelligent fix suggestions with live preview",
      "Script generation for permanent, development-free fixes",
      "High-performance Node.js backend for complex analysis"
    ],
    techStack: ["Node.js", "Next.js", "TypeScript", "Tailwind CSS", "Express", "Chrome Scripting API"],
    challenges: "Translating complex accessibility standards into actionable, automated fixes that could be applied without breaking site functionality required deep understanding of DOM manipulation and CSS scoping.",
    solutions: "Developed an intelligent script injection engine that sanitizes and applies fixes in a temporary viewer mode before allowing the user to export a production-ready fix script."
  },
  /*
  {
    id: "gecsportify",
    title: "Cricket Auction System",
    description:
      "A web application developed for the college cricket league, simplifying the player registration and auction process. Built with Node.js, Express.js, EJS, and MongoDB.",
    image: "/Images/gecSportify.png",
    tags: ["Node.js", "Express.js", "MongoDB", "EJS", "Bootstrap"],
    github: "https://github.com/Shailesh93602/gecsportify/",
    live: "https://gecsportify.vercel.app/",
    detailedDescription: "GEC Sportify is a comprehensive cricket auction system designed to handle real-time player bidding for college sports leagues. It features a robust backend to manage player statistics, team budgets, and live auction updates.",
    features: [
      "Real-time bidding management",
      "Player profile and statistics tracking",
      "Team budget management with validation",
      "Dynamic auction leaderboard",
      "Admin dashboard for league management"
    ],
    techStack: ["Node.js", "Express.js", "MongoDB", "EJS", "Bootstrap", "WebSockets"],
  },
  {
    id: "jarvis-ai",
    title: "Jarvis AI",
    description:
      "An advanced Android app built with Java and XML, enabling voice commands for effortless task management on smartphones.",
    image: "/Images/portfolio1.png",
    tags: ["Java", "Android", "XML", "Voice Recognition"],
    github: "https://github.com/Shailesh93602/jarvis-ai",
    detailedDescription: "Jarvis AI is a personal assistant application for Android that leverages Google's Voice Recognition API to perform various tasks on the device. It aims to provide a hands-free experience for common smartphone activities.",
    features: [
      "Voice command execution (Call, Text, Apps)",
      "Daily schedule and reminders management",
      "Real-time weather and news updates",
      "Custom voice responses",
      "Integration with device hardware (Camera, Flashlight)"
    ],
    techStack: ["Java", "Android SDK", "XML", "Google Voice API"],
  },
  {
    id: "masteryprep",
    title: "MasteryPrep",
    description:
      "An online platform to learn programming fundamentals for technical interviews, built with the MERN stack.",
    image: "/Images/masteryPrep.png",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
    github: "https://github.com/shailesh93602/MasteryPrep",
    live: "https://masteryprep.netlify.app/",
    detailedDescription: "MasteryPrep is an educational platform focused on preparing students for technical interviews. It provides a curated set of problems, learning resources, and a community space for developers.",
    features: [
      "Curated coding challenges with categories",
      "Interactive learning modules for DSA",
      "User progress tracking and badges",
      "Discussion forums for problem solving",
      "Responsive design for mobile learning"
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "Redux", "Tailwind CSS"],
  },
  {
    id: "bookesell",
    title: "Book E-Sell",
    description:
      "A full-stack web application for buying and selling books online, built with React, Node.js, Express, and MongoDB.",
    image: "/Images/portfolio1.png",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
    github: "https://github.com/Shailesh93602/book-store",
    detailedDescription: "Book E-Sell is a marketplace for second-hand books, allowing users to list their books for sale and buy from others. It streamlines the process of finding affordable educational resources.",
    features: [
      "User authentication and profile management",
      "Book listing with image upload",
      "Advanced search and filtering by category",
      "Inner messaging system for buyers and sellers",
      "Rating and review system"
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "JWT"],
  },
  */
];
