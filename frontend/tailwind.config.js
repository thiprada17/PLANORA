/** @type {import('tailwindcss').Config} */
module.exports = {

  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        KanitBold: ["KanitBold"],
        KanitRegular: ["KanitRegular"],
        KanitLight: ["KanitLight"],
        KanitMedium: ["KanitMedium"],
        KanitSemiBold: ["KanitSemiBold"],
        KanitExtraBold: ["KanitExtraBold"],
      },

      colors: {
        GREEN: '#CAEAD5',
        GRAY: '#F0F0F0',
        BLACK: '#222222'
      }
    },
    plugins: [],
  }
}