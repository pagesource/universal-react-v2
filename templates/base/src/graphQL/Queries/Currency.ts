import gql from 'graphql-tag';

export const getCurrency = gql`
  {
    query
    rates(currency: "INR") {
      rate
      name
    }
  }
`;
