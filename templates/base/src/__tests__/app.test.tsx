import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../app';

describe('App Component', () => {
  test('should render correctly', () => {
    render(<App />);
    expect(screen.getByTestId('AppComponent'));
  });
});
