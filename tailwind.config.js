/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        spot: {
          green: "#00FF41",
          dark: "#0a0a0a",
          card: "#141414",
          surface: "#1a1f1a",
          border: "#2a2a2a",
          muted: "#888888",
        },
      },
      fontFamily: {
        heading: ["Oswald", "Impact", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
