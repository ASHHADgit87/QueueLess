/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          light: "#818CF8",
          dark: "#3730A3",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#6EE7B7",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FCA5A5",
        },
        surface: {
          DEFAULT: "#F9FAFB",
          dark: "#111827",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#1F2937",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};
