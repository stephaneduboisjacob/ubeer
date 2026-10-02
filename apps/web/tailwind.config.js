import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18231d",
        moss: "#244d35",
        lime: "#d7f36a",
        cream: "#f7f7ef",
        orange: "#f28a4d",
      },
      fontFamily: { display: ["Manrope", "sans-serif"], body: ["DM Sans", "sans-serif"] },
      boxShadow: { card: "0 18px 60px rgba(24,35,29,.10)" },
    },
  },
  plugins: [forms, typography],
};
