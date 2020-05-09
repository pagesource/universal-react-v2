import React from 'react'
import Router from 'next/router';
import getConfig from 'next/config';

const {
  publicRuntimeConfig
} = getConfig();

export const BASE_PATH = publicRuntimeConfig.basePath;

export const NextRouterWrapper = ({
  pathName,
  as,
  options = {}
}) => {
  Router.push(pathName, `${BASE_PATH}${as || pathName}`, options);
};

export const getBasePath = route =>
  `${BASE_PATH}${route}`

export default {
  home: '/'
};