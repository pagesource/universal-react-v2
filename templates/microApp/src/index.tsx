import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

export interface IAppConfig {
  props?: { [key: string]: any };
  shadowROOT?: boolean;
}

export const render = (el: HTMLElement, config: IAppConfig = {}) => {
  try {
    const { props = {}, shadowROOT } = config;

    const ROOT = el;

    if (!ROOT) {
      return;
    }

    const styleTags = window['customElStyles'] || [];

    if (shadowROOT) {
      ROOT.attachShadow({ mode: 'open' });
      const appRoot = document.createElement('div');
      ReactDOM.render(<App {...props} />, appRoot);
      ROOT.shadowRoot.append(...styleTags, appRoot);
    } else {
      ReactDOM.render(<App {...props} />, ROOT);
      document.head.append(...styleTags);
    }

    delete window['customElStyles'];
  } catch (error) {
    console.error('Micro-app render error', error);
  }
};
