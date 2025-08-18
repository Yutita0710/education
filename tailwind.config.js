/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        notoSerifThai: ['"Noto Serif Thai"', 'serif'],
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(256.58deg, #F4EFFF 16.38%, #FAFDFF 48.42%, #E2EDFC 82.46%, #D7E7FF 103.63%)',
      },
    },
  },
  plugins: [],
}
