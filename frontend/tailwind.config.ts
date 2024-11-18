/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-explicit-any */
import type { Config } from 'tailwindcss';
import { default as flattenColorPalette } from 'tailwindcss/lib/util/flattenColorPalette';
import plugin from 'tailwindcss/plugin';


export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        aurora: 'aurora 60s linear infinite',
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
      },
    },
  },
  plugins: [
    addVariablesForColors,
    plugin(({ matchUtilities, theme }) => {
      matchUtilities({ 'animate-delay': (animationDelay) => ({ animationDelay }) }, { values: theme('transitionDelay') });
      matchUtilities({ 'animate-duration': (animationDuration) => ({ animationDuration }) }, { values: theme('transitionDuration') });
      [['dh', 'height'], ['min-dh', 'minHeight'], ['max-dh', 'maxHeight']].forEach(([_class, property]) => matchUtilities(
        { [_class]: (value) => ({ [property]: `calc(var(--dvh, 1vh) * ${value})` }) },
        { values: Array.from({ length: 21 }, (_, i) => i * 5).reduce((acc, value) => ({ ...acc, [value]: value }), {}) },
      ));
    }),
  ],
  darkMode: 'class',
} satisfies Config;


// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));
  addBase({ ':root': newVars });
}
