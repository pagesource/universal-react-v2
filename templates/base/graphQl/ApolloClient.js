import ApolloClient, { HttpLink, InMemoryCache } from 'apollo-boost';
import { graphQLApiUri } from '../config/api';

const cache = new InMemoryCache();

/**
 * GraphQLClient : Returns instance of apollo client.
 * @param {*} uri [URL of service ]
 * @param {*} headers [headers to be pased to service. like security token]
 */
const GraphQLClient = (uri = graphQLApiUri, headers = {}) =>
  new ApolloClient({
    cache,
    link: new HttpLink({
      uri,
      headers
    })
  });

export default GraphQLClient;
