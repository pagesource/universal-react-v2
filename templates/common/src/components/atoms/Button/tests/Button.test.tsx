import React from 'react';
import { render, screen } from '@testing-library/react';

import Button from '../index';

describe('<Button />', () => {
  beforeEach(() => {
    render(
        <Button className="test-classname">Test</Button>
    );
  });

  test('should render correctly', () => {
    expect(screen.getByTestId('CompRoot'));
  });
});
