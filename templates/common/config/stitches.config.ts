import { createStitches } from '@stitches/react';
import { customTheme } from '../../theme/theme';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({ ...customTheme });
