/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'input': "0 0 0 2px rgba(24, 144, 255, 0.2)",
        'searchbar': "0 4px 4px rgba(0, 0, 0, 0.25)",
      },
      dropShadow: {
        
      },
      fontFamily: {
        'm-plus1': ['"M PLUS 1"', "sans-serif"],
      },
      colors: {
        'input-focus': "#40A9FF",
        'default': "#094067",
        'primary': "#3da9fc",
        'white': "#fffffe",
        'danger': "#ef4565",
        'warning': "#ffc53d",
        'success': "#73c42d",
        'disabled': "#8d8d8d",
        'information': "#648ffc",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
