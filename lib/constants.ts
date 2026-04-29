export const SOCIAL_LINKS = {
  GITHUB: "https://github.com/shailesh93602",
  LINKEDIN: "https://www.linkedin.com/in/shaileshbhaichaudhari/",
  TWITTER: "https://twitter.com/ShaileshWork",
  GEEKSFORGEEKS: "https://www.geeksforgeeks.org/user/thenameisshaileshbhai/",
  HACKERRANK: "https://www.hackerrank.com/profile/shailesh93602",
  CODECHEF: "https://www.codechef.com/users/shaileshbhai03",
  LEETCODE: "https://leetcode.com/u/Shaileshbhai/",
} as const;

// Canonical usernames — profile URL shapes vary between platforms so deriving
// these with split("/").pop() is unreliable (trailing slashes, /u/ prefixes).
export const PROFILE_USERNAMES = {
  GITHUB: "shailesh93602",
  LEETCODE: "Shaileshbhai",
} as const;

export const COMPANY_LINKS = {
  ESPARKBIZ: "https://www.esparkinfo.com/",
  CONTEXTQA: "https://www.contextqa.com/",
  VERCEL: "https://vercel.com",
} as const;

export const PROFILE_LINKS = {
  PORTFOLIO: "https://shaileshchaudhari.vercel.app/",
  RESUME: "/Shailesh_Chaudhari_Resume.pdf",
} as const;

// Contact info sourced from the single-source-of-truth at lib/profile.ts.
// If editing these values, edit profile.ts — never this file.
import { PROFILE } from "./profile";

export const CONTACT_INFO = {
  EMAIL: PROFILE.contact.email,
  PHONE: PROFILE.contact.phone,
  LOCATION: PROFILE.location.displayShort,
} as const;
