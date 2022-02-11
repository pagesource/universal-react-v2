import Router from 'next/router';
import { getBasePath, NextRouterWrapper } from '../routes';

jest.mock('next/router', () => ({ push: jest.fn() }));
const nextRouterWrapperConfig = {
  pathName: 'test',
  as: '',
  options: {}
};

describe('Testing Router/index.ts', () => {
  it('NextRouterWrapper should redirect correctly', () => {
    NextRouterWrapper({
      pathName: nextRouterWrapperConfig.pathName,
      as: nextRouterWrapperConfig.pathName,
      options: nextRouterWrapperConfig.options
    });
    expect(Router.push).toHaveBeenCalledWith(
      nextRouterWrapperConfig.pathName,
      expect.any(String),
      expect.any(Object)
    );
  });

  it('getBasePath should return Valid string', () => {
    expect(
      getBasePath(nextRouterWrapperConfig.pathName).includes(
        nextRouterWrapperConfig.pathName
      )
    ).toBeTruthy();
  });
});
