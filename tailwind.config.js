/** @type {import('tailwindcss').Config} */
const colors = require("./src/constants/colors.js");
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/shared/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  // Optimize build performance
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
    fontFamily: {
      display: ['Oswald-Regular', 'sans-serif'],
      'oswald-300': ['Oswald-Light'],
      'oswald-400': ['Oswald-Regular'],
      'oswald-500': ['Oswald-Medium'],
      'oswald-600': ['Oswald-SemiBold'],
      'oswald-700': ['Oswald-Bold'],
      oswald: ['Oswald-Regular'],
    },
  },
  plugins: [],
}

