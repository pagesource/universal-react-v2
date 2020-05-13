import ApolloClient, { HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { graphQLApiUri } from '../config/endpoints';
import Logger from '../src/utils/Logger';

const cache = new InMemoryCache();


const logObject = ({ message, code, errMessage, operationName }) => {
  return {
    message,
    error: {
      code: 'graphQLNetworkError',
      message: errMessage,
      operationName
    },
    service: {
      name: 'GraphQLClient',
      path: graphQLApiUri,
    }
  }
}

const errorLink = onError(({ graphQLErrors, networkError, operationName }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      Logger.error(logObject({
        message: `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        code: 'graphQLError',
        errMessage: message,
        operationName,
      })
      )
    );
  if (networkError) Logger.error(logObject({
    message: `[Network error]: ${networkError}`,
    code: 'graphQLNetworkError',
    errMessage: networkError,
    operationName,
  }));
});

/**
 * GraphQLClient : Returns instance of apollo client.
 * @param {*} uri [URL of service ]
 * @param {*} headers [headers to be passed to service. like security token]
 */
const GraphQLClient = (uri = graphQLApiUri, headers = {}) =>
  new ApolloClient({
    cache,
    link: ApolloLink.from([
      errorLink,
      new HttpLink({
        uri,
        headers
      })
    ])
  });

export default GraphQLClient;
