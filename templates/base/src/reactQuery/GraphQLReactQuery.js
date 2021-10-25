import { useQuery } from 'react-query'
import fetchWrapper from '../utils/serviceUtils/fetch';
import { GraphQLClient, request } from "graphql-request";
import gql from 'graphql-tag';

export default function graphQLWrapper({ key, query, variables, url, headers }) {
    const graphQLClient = new GraphQLClient(url, headers);
    const fetchData = async () => await graphQLClient.request(query, variables);
    return useQuery(key, fetchData);
};