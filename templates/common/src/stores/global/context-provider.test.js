import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import ContextProvider from './ContextProvider';

afterEach(cleanup);

const TestComponent = () => {
  return (
    <>
      <ContextProvider>
        <h1 data-testid="HOCTestComponent">Test Component</h1>
      </ContextProvider>
    </>
  );
};

describe('Context Provider Test', () => {
  test('Matches snapshot', () => {
    const { container } = render(<TestComponent />);
    expect(container).toMatchSnapshot();
  });

  test('Renders the Test Component in Global Context', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('HOCTestComponent'));
  });
});
