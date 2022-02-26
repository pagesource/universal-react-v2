import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import Button from '../index';

import { theme } from 'themes';

describe('<Button />', () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={theme}>
        <Button className="test-classname">
          <>{'Test'}</>
        </Button>
      </ThemeProvider>
    );
  });

  test('should render correctly', () => {
    expect(screen.getByTestId('AppContainer'));
  });
});
