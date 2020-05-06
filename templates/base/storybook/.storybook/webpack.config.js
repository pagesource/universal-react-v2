const path = require('path');

module.exports = ({ config }) => {
  const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));
  const assetLoader = {
    loader: assetRule.loader,
    options: assetRule.options || assetRule.query,
  };
  config.module.rules.unshift({
    test: /\.svg$/,
    use: ['@svgr/webpack', assetLoader],
  }, {
    test: /\.(css)$/,
    loader: 'css-loader',
  });

  config.module.rules = [{ oneOf: config.module.rules }];

  return config;
};