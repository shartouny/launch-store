const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minWidth: {
        11: '2.75rem'
      },
      fontFamily: {
        inter: 'inter'
      },
      borderColor: {
        'gray-BDBDBD': '#BDBDBD'
      },
      colors: {
        gray: {
          light: '#c4c4c4',
          transparent: 'rgba(196, 196, 196, .85)',
          neutral: '#9098B1'
        },

        black: '#000',
        faGray: 'var(--theme-secondary)' == '' ? '#FAFAFA' : 'var(--theme-secondary)',
        c4Gray: 'var(--theme-secondary)' == '' ? '#C4C4C4' : 'var(--theme-secondary)',
        ebGray: 'var(--theme-secondary)' == '' ? '#EBEBEB' : 'var(--theme-secondary)',
        color22262A: '#22262A',
        color333333: 'var(--theme-secondary)' == '' ? '#333333' : 'var(--theme-secondary)',
        color262626: 'var(--theme-secondary)' == '' ? '#262626' : 'var(--theme-secondary)',
        colorE5E5E5: 'var(--theme-secondary)' == '' ? '#E5E5E5' : 'var(--theme-secondary)',
        color21B6B2: '#21B6B2',
        gray_606060: '#606060',
        colorC4C4C4: 'var(--theme-secondary)' == '' ? '#C4C4C4' : 'var(--theme-secondary)',
        primary: 'var(--theme-primary)',
        secondary: 'var(--theme-secondary)'
      },
      keyframes: {
        pillow: {
          '0%, 10%': { transform: 'scale(0.99)' }
        },
        pump: {
          '0%': {
            opacity: '0',
            transform: 'scale(1)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1.1)'
          }
        }
      },
      animation: {
        pillow: 'pillow 500ms ',
        pump: 'pump 500ms'
      },
      textColor: {
        grey_606060: '#606060'
      },
      width: {
        'photo-picker-xl': 'calc(100vw*0.36)',
        'photo-picker-item-xl': 'calc(100vw*0.32/5)',

        'photo-picker-lg': 'calc(100vw*0.33)',
        'photo-picker-item-lg': 'calc(100vw*0.30/5)',

        'photo-picker-item-md': 'calc(100vw*0.181)',

        'photo-picker-item-sm': 'calc(100vw*0.16)',

        'photo-picker-item-phone': 'calc(100vw*0.17)',

        'photo-picker-ipad': 'calc(100vw*0.35)',
        'photo-picker-item-ipad': 'calc(100vw*0.35/5)',

        97: '26rem',
        98: '28rem',
        99: '4rem',
        'h-100': '20rem'
      },
      height: {
        'photo-picker-xl': 'calc(100vw*0.23)',
        'photo-picker-item-xl': 'calc(100vw*0.31/5)',

        'photo-picker-lg': 'calc(100vw*0.23)',
        'photo-picker-item-lg': 'calc(100vw*0.30/5)',

        'photo-picker-item-md': 'calc(100vw*0.181)',

        'photo-picker-item-sm': 'calc(100vw*0.16)',

        'photo-picker-ipad': 'calc(100vh*0.16)',
        'photo-picker-item-ipad': 'calc(100vw*0.35/5)',

        'photo-picker-item-phone': 'calc(100vw*0.17)',
        'photo-picker-mobile': 'calc(100vh*0.35)'
      },
      boxSizing: {
        sm: '2rem',
        lg: '4rem',
        xl: '5rem'
      }
    },
    fontFamily: {
      inter: 'inter'
    },
    screens: {
      xs: '350px',
      ...defaultTheme.screens
    }
  },
  variants: {
    extend: {
      display: ['hover', 'focus', 'group-hover']
    }
  },
  plugins: [require('@tailwindcss/custom-forms')]
}
