import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 4) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  });

  return {
    props: {
      launches: data.launchesPast
    }
  };
};

export const gqlSample = ({ launches }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX programs</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">SpaceX Programs</a>
        </h1>

        <div className={styles.grid}>
          {launches.map((ddd) => (
            <div key={ddd.id} className={styles.card}>
              <a href="https://nextjs.org/docs">
                <h2>{ddd.mission_name}</h2>
                <p>
                  Fetched launch Place is: <br />
                  {ddd.launch_site.site_name_long}
                </p>
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default gqlSample;
