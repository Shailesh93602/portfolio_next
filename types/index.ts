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

export interface SkillItem {
  name: string;
  level: number;
}

export interface Skill {
  category: string;
  items: SkillItem[];
}

export interface Hobby {
  title: string;
  description: string;
  icon: string;
}