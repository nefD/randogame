import { theme } from "@chakra-ui/core";


export default {
  ...theme,
  breakpoints: ["30em", "48em", "62em", "80em"],
  fonts: {
    heading: '"Avenir Next", sans-serif',
    body: "system-ui, sans-serif",
    mono: "Menlo, monospace",
  },
  borderColor: '#00f',

  colors: {
    ...theme.colors,
    healthProgress: {
      200: '#ff0000',
      500: '#ff0000',
    },
    deathBackground: 'rgba(0,0,0,0.5)',
    panelBackground: theme.colors.gray['700'],
    shopItemBackground: theme.colors.gray['600'],
    enemyBackground: {
      50: '#ffe3e9',
      100: '#ffb3bf',
      200: '#fd8194',
      300: '#fb506a',
      400: '#fa2240',
      500: '#e10d26',
      600: '#af071e',
      700: '#7e0215',
      800: '#4c000b',
      900: '#1e0003',
    },
    facilityBackground: {
      50: '#ffffda',
      100: '#ffffad',
      200: '#ffff7d',
      300: '#ffff4b',
      400: '#ffff1a',
      500: '#e5e600',
      600: '#b2b300',
      700: '#7f8000',
      800: '#4c4d00',
      900: '#191b00',
    },
  },
  shadows: {
    ...theme.shadows,
    outline: 'none',
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "4rem",
  },
};
