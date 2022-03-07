import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Error from '../pages/_error';

test('ErrorPage ', () => {
  const { getByText, rerender } = render(<Error statusCode={500} />);
  expect(getByText('An error 500 occurred on server')).toBeInTheDocument();
  // Change props
  rerender(<Error />);
  expect(getByText('An error occurred on client')).toBeInTheDocument();
});
