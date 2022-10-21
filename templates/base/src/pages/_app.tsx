// node modules
import React from 'react';
import type { AppProps } from 'next/app';

// packages
import WithReactQuery from 'services';
import { theme } from 'themes';
import GlobalContextProvider from '../stores/globalContext';
import globalStyle from '../styles/cssIncludes';

// Will be called once for every metric that has to be reported.
// export function reportWebVitals(metric: any) {
// These metrics can be sent to any analytics service
// console.log(metric);
// }


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      {/*@ts-ignore*/}
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
