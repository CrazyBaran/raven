const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    join(__dirname, '../**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    colors: {
      primary: {
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
      success: '#3C672D',
      warning: '#EB8C00',
      error: '#D62929',
      info: '#5A74D8',
    },
    extend: {
      fontFamily: {
        interstate: ['Interstate'],
      },
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
