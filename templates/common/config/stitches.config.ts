import { createStitches } from '@stitches/react';
import { customTheme } from '../src/theme/theme';
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
