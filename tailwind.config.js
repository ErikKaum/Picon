/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./ui-src/html",
    "./ui-src/**/*.{js,ts,jsx,tsx}",
    // "./index.html",
    // "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      display: ["group-hover"],
      colors :{
        "transparent-40" : "rgb(255,255,255,0.7)",
        "transparent-50" : "rgb(255,255,255,0.8)"
      },
    },
  },
  plugins: [],
}