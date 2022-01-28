import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../pages/index';
import { ThemeProvider } from 'styled-components';
import { theme } from 'themes';

describe('Home Page', () => {
  let { container, getByText, rerender } = render(
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );

  test('should render correctly', () => {
    expect(screen.getByTestId('HomeContainer'));
  });
});
