import { createStitches } from '@stitches/react';
import { customTheme } from 'theme';
import { globalTheme } from 'themes';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({ ...globalTheme, ...customTheme });
