/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navbarLight: "#00CCCC",
        navbarDark: "#141414",
        backgroundLight: "#F8FAFC",
        backgroundDark: "#0F172A",
        panelLight: "#FFFFFF",
        panelDark: "#111827",
        mistLilac: "#c9c7eb",
        softLavender: "#aba7de",
        iceBlue: "#c7e2f0",
        skyMist: "#96c8e3",
        cloudWhite: "#eeeef9",
        palePeriwinkle: "#dadfff",
        mutedSlate: "#A7A5C0",
        aquaMint: "#2fd2ca",
        softTeal: "#84c4be",
      },
      fontFamily: {
        shikamaru: ["Shikamaru", "sans-serif"],
        jetbrains: ["JetBrainsMono", "monospace"],
        zodiak: ["Zodiak", "serif"],
        frozito: ["Frozito", "cursive"],
        unicorn : ["Unicorn", "cursive"],
      },
      boxShadow: {
        softxl: "0 12px 40px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};