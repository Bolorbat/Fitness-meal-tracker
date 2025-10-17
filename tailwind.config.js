/** @type {import('tailwindcss').Config} */
import { colors } from "./theme/colors";
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
      colors: colors,
      fontFamily: {
        PoppinsRegular: ["Poppins-Regular"],
        PoppinsSemiBold: ["Poppins-SemiBold"],
        PoppinsBold: ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
};
