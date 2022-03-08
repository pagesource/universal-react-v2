import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Custom404 from '../pages/404';

test('404 Error Page ', () => {
  const { getByText } = render(<Custom404 />);
  expect(getByText('404 - Page Not Found')).toBeInTheDocument();
});
