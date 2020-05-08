
/** list of apis to be called */
const endpoints = {
  getMockJson: '/todos/1',
}

/** various domains entry
 * 1. contentDomain - for content type like labels, api call to graphql, etc
 * 2. dataDomain - for data type, like api call for user data
*/
const contentDomain = '';
const dataDomain = 'https://jsonplaceholder.typicode.com';


/** getContentServiceUrl - generates content service url to be passed to fetch api
 * (key, isMock) - > key - get url from endpoints ;  isMock - serve data from public folder
*/
export const getContentServiceUrl = (key, isMock = false) => {
  const url = endpoints[key];
  return isMock ? url : `${contentDomain}url`;
}

/** getDataServiceUrl - generates data service url to be passed to fetch api
 * (key, isMock) - > key - get url from endpoints ;  isMock - serve data from public folder
*/
export const getDataServiceUrl = (key, isMock = false) => {
  const url = endpoints[key];
  return isMock ? `${url}.json` : `${dataDomain}${url}`; // mock file can be changed as preference
}
