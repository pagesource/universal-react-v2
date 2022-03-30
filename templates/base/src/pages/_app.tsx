// node modules
import React from 'react';
import type { AppProps } from 'next/app';

// packages
import WithReactQuery from 'services';

import GlobalContextProvider from '../stores/globalContext';
import { globalCss } from '../../config/stitches.config';

// Will be called once for every metric that has to be reported.
// export function reportWebVitals(metric: any) {
// These metrics can be sent to any analytics service
// console.log(metric);
// }

const globalStyles = globalCss({
  '*': { margin: 0, padding: 0 },
});

function MyApp({ Component, pageProps }: AppProps) {
  
  globalStyles();

  return (
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>
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
