import ApolloClient, { HttpLink, InMemoryCache } from 'apollo-boost';

const defaultUri = 'https://48p1r2roz4.sse.codesandbox.io';

const cache = new InMemoryCache();

/**
 * GraphQLClient : Returns instance of apollo client.
 * @param {*} uri [URL of service ]
 * @param {*} headers [headers to be pased to service. like security token]
 */
const GraphQLClient = (uri = defaultUri, headers = {}) =>
  new ApolloClient({
    cache,
    link: new HttpLink({
      uri,
      headers
    })
  });

export default GraphQLClient;
