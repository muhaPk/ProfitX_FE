/** @type {import('tailwindcss').Config} */
const colors = require("./src/constants/Colors");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // colors,
      colors: {
        ...colors,
      },
    },
    fontFamily: {
      display: ['Oswald', 'sans-serif'],

      fontFamily: {
        'oswald-300': ['Oswald-Light'],
        'oswald-400': ['Oswald-Regular'],
        'oswald-500': ['Oswald-Medium'],
        'oswald-600': ['Oswald-SemiBold'],
        'oswald-700': ['Oswald-Bold'],
        oswald: ['Oswald-Regular'],
      },
      
    },
  },
  plugins: [],
}

