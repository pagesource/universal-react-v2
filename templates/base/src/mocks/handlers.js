import { gql } from '@apollo/client';
import { rest, graphql } from 'msw';
import { myDatas } from './sampleRestData';
import { mygqlData } from './sampleGqlData';

const url = 'https://jsonplaceholder.typicode.com/users';
const slink = graphql.link('https://api.spacex.land/graphql');
gql`
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
      }
      rocket {
        rocket_name
      }
    }
  }
`;

export const handlers = [
  rest.get(url, (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(500), ctx.json([...myDatas]));
  }),
  slink.query('GetLaunches', (req, res, ctx) => {
    const fdata = { launchesPast: [...mygqlData] };
    return res(ctx.status(200), ctx.delay(500), ctx.data(fdata));
  })
];
