/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#11175D',
        secondary: '#5F35F5',
        third: '#EA6C00',
        shadow: '#3D3D3D',
        rgba: 'rgba(237, 159, 159, 0.6)'
      }
    },
    screens: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
    },
  },
  plugins: [
  ],
}
