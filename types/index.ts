export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  companyUrl?: string;
  skills?: string[];
  highlights?: string[];
}

export interface Achievement {
  title: string;
  description: string;
  link?: string;
  iconName: "trophy" | "code" | "award" | "star";
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  score?: string;
  scoreLabel?: string;
  highlights?: string[];
}
