const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{html,js,ts,jsx,tsx}',
    './public/**/*.{html,js,ts,jsx,tsx}',
    './src/components/**/*.{html,js,ts,jsx,tsx}',
    './src/app/**/*.{html,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        normal: ['SFPro-Normal', ...defaultTheme.fontFamily.sans],
        semibold: ['SFPro-SemiBold', ...defaultTheme.fontFamily.sans],
        bold: ['SFPro-Bold', ...defaultTheme.fontFamily.sans],
        medium: ['SFPro-Medium', ...defaultTheme.fontFamily.sans],
        light: ['SFPro-Light', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#a404f7',
        },
        grey: {
          DEFAULT: '#7B8698',
          100: '#F4F7FB',
          200: '#E6EAF0',
          400: '#A7B2C3',
          600: '#596579',
          700: '#374253',
          800: '#192638',
          900: '#0F1825',
        },
        error: {
          DEFAULT: '#C63617',
          50: '#FDE7E0',
        },
        success: {
          DEFAULT: '#0E9E49',
          50: '#E6FAF0',
        },
        borderColor: {
          DEFAULT: '#EBEFF4',
        },
      },
      fontSize: {
        12: '12px',
        13: '13px',
        16: '16px',
        18: '18px',
      },
    },
  },
  plugins: [],
};
