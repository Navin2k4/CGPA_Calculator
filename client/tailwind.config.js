const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      transitionProperty: {
        'background-color': 'background-color, background-image',
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}