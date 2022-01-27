import { endpoints, contentDomain, apiGeeDomain, apiEndPoints, mockRestDomain, mockGraphQLDomain, apiDomain } from '../../../config/endpoints';
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
  return isMock ? `/static/mock/${url}.json` : `${apiGeeDomain}${url}`;
};

export const getApiEndPoints = (queryId, isMock = false, isGraphQlApi=false) => {
  const url =  apiEndPoints[queryId];
  const domain = isGraphQlApi ? mockGraphQLDomain : mockRestDomain;
  return sessionStorage.getItem('serveMock') === 'true' || isMock ? `${domain}${url}` : `${apiDomain}${url}`;
};
