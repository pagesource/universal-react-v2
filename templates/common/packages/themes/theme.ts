import { createTheme } from "@nextui-org/react";

export const theme = createTheme({
  type: 'light',
  theme: {
    colors: {
      white: 'white',
      black: '#1c1c1c',
      red: '#ff414d',
      gray: '#b5b5b5',
      cyan: '#00e6c3',
      yellow: '#ffe63b',
      fontColor: '$gray',
      overlays: 'rgba(255,255,255,0.9)'
    },
    lineHeights: {
      solid: 1,
      body: 1.5,
      heading: 1.25
    },
    fonts: {
      fontExtraBold: '"FuturaNextW05-ExtraBold","Helvetica","Arial",sans-serif',
      fontBold: '"FuturaNextW05-Bold","Helvetica","Arial",sans-serif',
      fontLight: '"FuturaNextW05-Light","Helvetica","Arial",sans-serif',
      monospace: 'monospace',
      minionPro: '"minion-pro",serif',
      fontAwesome: "'Font Awesome 5 Free'"
    },
    radii: {
      1: '3px',
      2: '12px',
      3: '16px'
    },
    space: {
      1: '1px',
      2: '2px',
      3: '5px',
      4: '20px',
      5: '50px',
      6: '70px',
      7: '80px',
      8: '100px',
      9: '180px',
      10: '200px'
    },
    fontSizes: {
      1: '12px',
      2: '14px',
      3: '16px',
      4: '18px',
      5: '20px'
    },
    fontWeights: {
      1: 100,
      2: 200,
      3: 300
    },
    transitions: {
      1: 'all 1s cubic-bezier(0.32, 0.01, 0, 1)',
      2: 'all 0.5s cubic-bezier(0.39, 0.575, 0.565, 1)',
      3: 'all 0.3s cubic-bezier(0.32, 0.01, 0, 1)',
      4: 'all .25s linear'
    }
  }
});
