import Router from 'next/router';

export const BASE_PATH = process.env.BASE_PATH || '';

export const NextRouterWrapper = ({ pathName, as, options = {} }) => {
  Router.push(pathName, `${BASE_PATH}${as || pathName}`, options);
};

export const getBasePath = (route) => `${BASE_PATH}${route}`;
