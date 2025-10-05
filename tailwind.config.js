/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        blue: {
          light: "#92A3FD",
          dark: "#9DCEFF",
        },
        pink: {
          light: "#C58BF2",
          dark: "#EEA4CE",
        },
        black: "#1D1617",
        gray: {
          1: "#7B6F72",
          2: "#ADA4A5",
          3: "#DDDADA",
        },
      },
      fontFamily: {
        PoppinsRegular: ["Poppins-Regular"],
        PoppinsSemiBold: ["Poppins-SemiBold"],
        PoppinsBold: ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
};
