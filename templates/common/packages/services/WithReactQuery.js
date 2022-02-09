import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const WithReactQuery = (Component, config = {}) => {
  const queryClient = new QueryClient(config);

  const { devTools } = config;

  const WithReactQueryProvider = (props) => (
    <>
      <QueryClientProvider client={queryClient}>
        {devTools && <ReactQueryDevtools initialIsOpen={false} />}
        <Component {...props} />
      </QueryClientProvider>
    </>
  );

  return WithReactQueryProvider;
};

export default WithReactQuery;
