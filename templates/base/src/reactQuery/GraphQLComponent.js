import graphQLWrapper from "./GraphQLReactQuery";
import ClipLoader from "react-spinners/ClipLoader";
import gql from 'graphql-tag';

// Fetch multiple countries
const GET_COUNTRIES = gql`
  query {
    countries {
      code
      name
      emoji
    }
  }
`;

// Fetch single country based on country code
const GET_COUNTRY = gql`
  query($code: ID!) {
    country(code: $code) {
      name
    }
  }
`;

export default function GetTestComponent() {

  // const { data, isLoading, error, isSuccess } = graphQLWrapper({
  //     key: 'countries', query: GET_COUNTRY, url: 'https://countries.trevorblades.com/', variables: {
  //         code: 'SE'
  //     }
  // });

  const { data, isLoading, error, isSuccess } = graphQLWrapper({ key: 'countries', query: GET_COUNTRIES, url: 'https://countries.trevorblades.com/' });
  if (error) console.log(data);

  return (
    <>
      <ClipLoader color="#339FFF" loading={isLoading} css={` display: block; margin: 0 auto;`} size={150} />

      {/* For single country */}

      {/* <div style={{ display: 'flex', width: "100%", marginTop: "50px", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
                {isSuccess &&
                    <div style={{ padding: '10px', borderRadius: "8px", width: "60%", background: "#339FFF", marginBottom: "20px" }} > Country: {data.country.name}</div>
                }
            </div> */}

      {/* For multiple countries */}

      <div style={{ display: 'flex', width: "100%", marginTop: "10px", flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
        {isSuccess &&
          <div>
            <strong>List of Countries:</strong>
            <br />
            <br />
            {
              data.countries.map(country => (
                <div style={{ padding: '10px', borderRadius: "8px", width: "100%", background: "#339FFF", marginBottom: "20px" }} key={country.name}>{country.name} {country.emoji}</div>
              ))
            }
          </div>
        }
      </div>
    </>
  );
}
