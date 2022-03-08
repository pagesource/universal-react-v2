// node modules
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

// packages
import { theme } from 'themes';
import WithReactQuery from 'services';

import GlobalContextProvider from '../stores/globalContext';

// Will be called once for every metric that has to be reported.
export function reportWebVitals(metric: any) {
  // These metrics can be sent to any analytics service
  console.log(metric);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>
    </ThemeProvider>
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

export default WithReactQuery(MyApp, { devTools: true });
