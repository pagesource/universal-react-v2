import type { UrlObject } from 'url';

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
}

export declare type NextLinkWrapper = {
  pathName: UrlObject | string;
  as: UrlObject | string;
  options: TransitionOptions;
};
