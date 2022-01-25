import Router from 'next/router';
import { NextLinkWrapper } from './types';

export const BASE_PATH = process.env.BASE_PATH || '';

export const NextRouterWrapper = ({ pathName, as, options = {} }: NextLinkWrapper) => {
  Router.push(pathName, `${BASE_PATH}${as || pathName}`, options);
};

export const getBasePath = (route: string) => `${BASE_PATH}${route}`;
