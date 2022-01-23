import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const appRenderer = (el, config = {}) => {
  const { props = {}, shadowROOT } = config;

  let ROOT = null;
  if (el) {
    ROOT = el;
  } else {
    ROOT = document.getElementById('app');
  }

  if (!ROOT) {
    return;
  }

  const styleTags = window.customElStyles;

  if (shadowROOT) {
    ROOT.attachShadow({ mode: 'open' });
    const appRoot = document.createElement('div');
    ReactDOM.render(<App {...props} />, appRoot);
    ROOT.shadowRoot.append(...styleTags, appRoot);
  } else {
    ReactDOM.render(<App {...props} />, ROOT);
    document.head.append(...styleTags);
  }

  delete window.customElStyles;
};

export default { render: appRenderer };
