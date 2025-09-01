/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        notoThai: ['"Noto Sans Thai"', 'sans-serif'],
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(256.58deg, #E0D4FF 16.38%, #EAF7FF 48.42%, #C4DAF8 82.46%, #AFCFFF 103.63%)",
      },
    },
  },
  plugins: [],
};
