/* eslint-disable */

import React from 'react';
import { render } from '@testing-library/react';
import App from '../pages/_app';
import '@testing-library/jest-dom/extend-expect';
import { useQuery } from 'react-query';

function useCustomHook() {
  return useQuery('customHook', () => 'Success');
}

const TestComponent = () => {
  const result = useCustomHook();
  return (
    <>
      <h1>This is a test</h1>
      {result.data ? <h1>React Query Injected</h1> : null}
    </>
  );
};

const testProps = {
  abc: 'test'
};

describe('Root App rendering check', () => {
  test('should render <h1/> element correctly', () => {
    const { getByText } = render(
      <App Component={TestComponent} pageProps={testProps} router={undefined} />
    );
    expect(getByText('This is a test')).toBeInTheDocument();
  });

  test('Testing React query injection', async () => {
    const { getByText } = render(
      <App Component={TestComponent} pageProps={testProps} router={undefined} />
    );
    expect(getByText('React Query Injected')).toBeInTheDocument();
  });
});
