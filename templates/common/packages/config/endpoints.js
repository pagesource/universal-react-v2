/** list of apis to be called */
export const endpoints = {
  content: {
    home: 'home/1'
  },
  apiGee: {
    todo: 'todos/1',
    users: 'profile',
    account: 'account'
  }
};

/** various domains entry
 * 1. contentDomain - for content type like labels, api call to graphql, etc
 * 2. dataDomain - for data type, like api call for user data
 */
export const contentDomain = 'https://jsonplaceholder.typicode.com/';
export const apiGeeDomain = 'https://jsonplaceholder.typicode.com/';
export const apiGeeDomainMockRest = 'http://localhost:5002/';
export const apiGeeDomainMockGraphQL = 'http://localhost:5004/';

/** getContentServiceUrl - return content service url to be passed to fetch api
 * (key, isMock) - > key - get url from endpoints ;  isMock - serve data from public folder
 */
export const getContentServiceUrl = (key, isMock = false) => {
  const url = endpoints.content[key];
  return isMock ? `/static/mock/${url}.json` : `${contentDomain}${url}`;
};

/** getDataServiceUrl - return data service url to be passed to fetch api
 * (key, isMock) - > key - get url from endpoints ;  isMock - serve data from public folder
 */
export const getDataServiceUrl = (key, isMock = false) => {
  const url = endpoints.apiGee[key];
  return sessionStorage.getItem('serveMock') === 'true' || isMock
    ? `${apiGeeDomainMockRest}${url}`
    : `${apiGeeDomain}${url}`;
};

export const getGraphQlServiceUrl = (key, isMock = false) => {
  const url = endpoints.apiGee[key];
  return sessionStorage.getItem('serveMock') === 'true' || isMock
    ? `${apiGeeDomainMockGraphQL}${url}`
    : `${apiGeeDomain}${url}`;
};
