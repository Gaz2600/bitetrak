/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        btBlue: "#1D6BFF",
        btBlueDark: "#0F4BC4",
        btMint: "#36D0A0",
        btSlate: "#111418",
      },
      boxShadow: {
        "soft-lg": "0 18px 45px rgba(15, 23, 42, 0.13)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
