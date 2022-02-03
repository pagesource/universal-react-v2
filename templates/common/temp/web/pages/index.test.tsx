import React from 'react';
import { render, screen } from '@testing-library/react';
import Web from './index';

describe('Web Component Renders', () => {
  test('should render correctly', () => {
    render(<Web />);
    expect(screen.getByTestId('WebDocsContainer'));
  });
});
