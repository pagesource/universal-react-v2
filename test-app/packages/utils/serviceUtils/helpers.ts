import { endpoints, contentDomain, apiGeeDomain } from '../../config/endpoints';
/** getContentServiceUrl - return content service url to be passed to fetch api
 * (key, isMock) - > key - get url from endpoints ;  isMock - serve data from public folder
 */
export const getContentServiceUrl = (key: string, isMock = false) => {
  const url = endpoints.content[key];
  return isMock ? `/static/mock/${url}.json` : `${contentDomain}${url}`;
};

/** getDataServiceUrl - return data service url to be passed to fetch api
 * (key, isMock) - > key - get url from endpoints ;  isMock - serve data from public folder
 */
export const getDataServiceUrl = (key: string, isMock = false) => {
  const url = endpoints.apiGee[key];
  return isMock ? `/static/mock/${url}.json` : `${apiGeeDomain}${url}`;
};

export class CustomError extends Error {
  response: any;
  statusText: string;
  constructor(statusText: string, response: any) {
    super();
    this.statusText = statusText;
    this.response = response;
  }
}
