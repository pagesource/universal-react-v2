import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import GraphQLClient from '../graphQL/ApolloClient'
import GlobalContextProvider from '../stores/global/Context';

// Will be called once for every metric that has to be reported.
export function reportWebVitals(metric) {
  // These metrics can be sent to any analytics service
  console.log(metric)
}

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={GraphQLClient}>
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>)
    </ApolloProvider>
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
