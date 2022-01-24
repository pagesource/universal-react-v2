import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools';
import GlobalContextProvider from '../stores/global/ContextProvider';

import { ThemeProvider } from 'styled-components';
import { theme } from "../themes/theme";

// Will be called once for every metric that has to be reported.
export function reportWebVitals(metric) {
  // These metrics can be sent to any analytics service
  console.log(metric)
}
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return (
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={theme}>
        <GlobalContextProvider>
          <Component {...pageProps} />
        </GlobalContextProvider>
      </ThemeProvider>
      </QueryClientProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
