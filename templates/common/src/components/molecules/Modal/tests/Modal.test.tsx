import React from 'react';
import { render, screen } from '@testing-library/react';

import Modal from '../index';

describe('<Modal />', () => {
  beforeEach(() => {
    render(<Modal/>);
  });

  test('should render correctly', () => {
    expect(screen.getByTestId('modalComp'));
  });
});
