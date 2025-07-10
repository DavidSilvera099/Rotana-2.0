 /** @type {import('tailwindcss').Config} */
 const {heroui} = require("@heroui/react");
  export default {content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
      extend: {
        colors: {
          primary: '#10345E',
          secondary: '#45B56E',
          colorLogo: '#085997',
        },
        screens: {
          'mobile': '375px',
          'tablet': '768px',
          'desktop': '1024px',
          'desktop-large': '1440px',
        },
      },
    },
    darkMode: "class",
    plugins: [heroui()],
  }