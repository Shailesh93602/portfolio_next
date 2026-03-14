export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live?: string;
  detailedDescription?: string;
  features?: string[];
  techStack?: string[];
  challenges?: string;
  solutions?: string;
}

export const projects: Project[] = [
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
];
