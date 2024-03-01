const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#00A59B',
        4: '#00a59b0a',
        8: 'rgba(0, 165, 155, 0.08)',
        12: 'rgba(0, 165, 155, 0.12)',
        16: 'rgba(0, 165, 155, 0.16)',
        20: 'rgba(0, 165, 155, 0.2)',
        25: 'rgba(0, 165, 155, 0.25)',
        30: 'rgba(0, 165, 155, 0.3)',
        50: 'rgba(0, 165, 155, 0.5)',
        100: '#E1F3F1',
        200: '#C3E7E3',
        300: '#A5DCD4',
        400: '#87D0C6',
        500: '#69C4B8',
        600: '#5abeb1',
        700: '#41a598',
        800: '#328076',
        900: '#245c54',
      },
      secondary: {
        100: '#D9DCE0',
        200: '#B3B9C1',
        300: '#8E96A2',
        400: '#687383',
        500: '#425064',
        600: '#47566c',
        700: '#333d4d',
        800: '#1e252e',
        900: '#0a0c0f',
      },
      grey: {
        100: '#F1F1F1',
        200: '#EDECED',
        300: '#D4D4D4',
        400: '#C5C5C5',
        500: '#AEAEAE',
        600: '#8E8E8E',
        700: '#5B5B5B',
        800: '#3B3B3B',
        900: '#000000',
      },
      white: '#FFFFFF',
      black: '#000000',
      text: '#252525',
      success: {
        DEFAULT: '#12861E',
        16: '#12861E29',
      },
      warning: '#EB8C00',
      error: {
        DEFAULT: '#C52A1A',
        8: '#C52A1A14',
      },
      info: '#5A74D8',
      light: '#D9D9D6',
      link: {
        hover: `#008077`,
      },
      'informational-warning': {
        DEFAULT: 'var(--informational-warning)',
        '-8': 'var(--informational-warning-8)',
        '-16': 'var(--informational-warning-16)',
        '-24': 'var(--informational-warning-24)',
        '-30': 'var(--informational-warning-30)',
        '-50': 'var(--informational-warning-50)',
      },
      'series-a': {
        DEFAULT: 'var(--series-a)',
        'lighten-50': 'var(--series-a-lighten-50)',
        'lighten-75': 'var(--series-a-lighten-75)',
        'darken-50': 'var(--series-a-darken-50)',
        'darken-75': 'var(--series-a-darken-75)',
      },
      'series-b': {
        DEFAULT: 'var(--series-b)',
        'lighten-50': 'var(--series-b-lighten-50)',
        'lighten-75': 'var(--series-b-lighten-75)',
        'darken-50': 'var(--series-b-darken-50)',
        'darken-75': 'var(--series-b-darken-75)',
      },
      'series-c': {
        DEFAULT: 'var(--series-c)',
        'lighten-50': 'var(--series-c-lighten-50)',
        'lighten-75': 'var(--series-c-lighten-75)',
        'darken-50': 'var(--series-c-darken-50)',
        'darken-75': 'var(--series-c-darken-75)',
      },
      'series-d': {
        DEFAULT: 'var(--series-d)',
        'lighten-50': 'var(--series-d-lighten-50)',
        'lighten-75': 'var(--series-d-lighten-75)',
        'darken-50': 'var(--series-d-darken-50)',
        'darken-75': 'var(--series-d-darken-75)',
      },
      'series-e': {
        DEFAULT: 'var(--series-e)',
        'lighten-50': 'var(--series-e-lighten-50)',
        'lighten-75': 'var(--series-e-lighten-75)',
        'darken-50': 'var(--series-e-darken-50)',
        'darken-75': 'var(--series-e-darken-75)',
      },
      'series-f': {
        DEFAULT: 'var(--series-f)',
        'lighten-50': 'var(--series-f-lighten-50)',
        'lighten-75': 'var(--series-f-lighten-75)',
        'darken-50': 'var(--series-f-darken-50)',
        'darken-75': 'var(--series-f-darken-75)',
      },
      'series-g': {
        DEFAULT: 'var(--series-g)',
        'lighten-50': 'var(--series-g-lighten-50)',
        'lighten-75': 'var(--series-g-lighten-75)',
        'darken-50': 'var(--series-g-darken-50)',
        'darken-75': 'var(--series-g-darken-75)',
      },
      'series-h': {
        DEFAULT: 'var(--series-h)',
        'lighten-50': 'var(--series-h-lighten-50)',
        'lighten-75': 'var(--series-h-lighten-75)',
        'darken-50': 'var(--series-h-darken-50)',
        'darken-75': 'var(--series-h-darken-75)',
      },
      disabledText: '#8F8F8F',
      'subtle-text': '#666666',
      component: {
        border: '#EBEBEB',
        text: '#424242',
        borderHover: '#D6D6D6',
      },
      buttons: {
        'button-text-90': '#002C3CE5',
        'button-text-8': '#002C3C14',
        'button-text-30': '#002C3C4D',
        'button-text-50': '#002c3c80',
        'button-text': '#002C3CE5',
      },
      chart: {
        'tooltip-bg': '#F9F9F9',
        border: '#00000014',
      },
      base: {
        background: '#FAFAFA',
        hover: '#EBEBEB',
        text: '#424242',
      },
      placeholder: {
        text: '#666666',
      },
    },
    extend: {
      fontFamily: {
        interstate: ['Interstate'],
      },
      opacity: {
        4: '0.04',
        8: '0.08',
        12: '0.12',
        16: '0.16',
      },
      transitionProperty: {
        'max-height': 'max-height',
      },
    },
    fontSize: {
      xxs: ['0.625rem', '0.75rem'], // 10px
      xs: ['0.6875rem', '1rem'], // 11px
      sm: ['0.75rem', '1.25rem'], // 12px
      base: ['0.875rem', '1.25rem'], // 14px
      lg: ['1rem', '1.5rem'], // 16px
      xl: ['1.125rem', '1.75rem'], // 20px
      '2xl': ['1.5rem', '2rem'], // 24px
      '3xl': ['1.875rem', '2.25rem'], // 30px
      '4xl': ['2.25rem', '2.5rem'], // 36px
      '5xl': ['3rem', 1], // 48px
      '6xl': ['3.75rem', 1], // 60px
      '7xl': ['4.5rem', 1], // 72px
      '8xl': ['6rem', 1], // 96px
      '9xl': ['8rem', 1], // 128px
    },
    minWidth: {
      dropdown: '11rem',
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        h1: {
          fontSize: '1.75rem',
          lineHeight: '2.125rem',
          fontWeight: 400,
        },
        h2: {
          fontSize: '1.1875rem',
          lineHeight: '1.5625rem',
          fontWeight: 500,
        },
        h3: {
          fontSize: '0.875rem',
          lineHeight: '1.1875rem',
          fontWeight: 600,
        },
        h4: {
          fontSize: '0.75rem',
          lineHeight: '1rem',
          fontWeight: 600,
        },
      });
    }),
  ],
};
