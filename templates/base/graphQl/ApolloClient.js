import ApolloClient, { HttpLink, InMemoryCache } from 'apollo-boost';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { graphQLApiUri } from '../config/endpoints';
import Logger from '../src/utils/Logger';

const cache = new InMemoryCache();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      Logger.error(
        { message: `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}` }
      )
    );
  if (networkError) Logger.error({ message: `[Network error]: ${networkError}` });
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
