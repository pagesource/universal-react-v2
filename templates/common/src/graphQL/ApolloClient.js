import ApolloClient, { HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { graphQLApiUri } from '../../config/endpoints';
import Logger from '../utils/Logger';

const cache = new InMemoryCache();


const logObject = ({ message, code = '', errMessage, operationName }) => {
  return {
    message,
    error: {
      code,
      errMessage,
      operationName
    },
    service: {
      name: operationName,
      path: graphQLApiUri,
    }
  }
}

const errorLink = onError(({ graphQLErrors, networkError, operationName }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      Logger.error(logObject({
        message: `GraphQL Query Error: ${message}, ${locations}, ${path}`,
        errMessage: message,
        operationName,
      }))
    );
  }

  if (networkError) {
    Logger.error(logObject({
      message: `GraphQL Network error: ${networkError}`,
      errMessage: networkError,
      operationName,
    }));
  }
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
