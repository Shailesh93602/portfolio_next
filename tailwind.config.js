/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8300b8",
        primaryLight: "#8300b8a3",
        darkGray: "#6b7280",
        offWhite: "#f3f4f",
        grayText: "#E5E7EB",
        dark: "#111827",
        background: {
          DEFAULT: "#05010d",
          light: "##05010d",
        },
        text: {
          primary: "#F9FAFB",
          secondary: "#D1D5DB",
        },
        accent: {
          blue: {
            DEFAULT: "#3B82F6",
            light: "#60A5FA",
            dark: "#2563EB",
          },
          green: {
            DEFAULT: "#10B981",
            light: "#34D399",
            dark: "#059669",
          },
          red: {
            DEFAULT: "#EF4444",
            light: "#F87171",
            dark: "#DC2626",
          },
        },
        border: "#4B5563",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      boxShadow: {
        custom:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
