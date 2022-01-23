// Node modules
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const deps = require('./package.json').dependencies;

const WP = require('webpack');
const path = require('path');

/**
 * HTMLTemplate: Used to run dev build
 * ENTRY_PATH: index file
 * LIB_NAME: Library name to access render
 */
const ENTRY_PATH = './src/index.js';
const HTMLTemplate = './src/index.html';
const LIB_NAME = 'remoteApp';

/**
 * Module federation config
 * By default all dependencies are added to shared
 */
const MF_CONFIG = {
  name: 'remote',
  remotes: {},
  exposes: {
    './Heading': './src/components/atoms/Heading',
    './app': './src/index'
  }
};

/**
 * ****** WEBPACK CONFIG STARTS HERE *****
 * @param {*} env process var
 * @param {*} argv cmd args
 * @returns webpack config object
 */
module.exports = (env, argv) => {
  const { mode } = argv;
  const isDev = mode === 'development';

  const addDefinePlugin = () => {
    const instance = new WP.DefinePlugin({
      __IS_DEV__: isDev
    });

    return instance;
  };

  const addModuleFederation = () => {
    const instance = new ModuleFederationPlugin({
      ...MF_CONFIG,
      filename: 'remoteEntry.js',
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true
        },
        'react-dom': {
          eager: true,
          singleton: true
        }
      }
    });

    return instance;
  };

  const addHTMLTemplate = () => {
    const instance = new HtmlWebPackPlugin({
      template: HTMLTemplate
    });

    return instance;
  };

  const addBuildManifest = () => {
    const instance = new WebpackManifestPlugin({
      basePath: '',
      publicPath: ''
    });

    return instance;
  };

  const cleanupDist = () => {
    const instance = new CleanWebpackPlugin();
    return instance;
  };

  const config = {
    entry: ENTRY_PATH,

    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name]-[hash].js',
      library: LIB_NAME
    },

    resolve: {
      extensions: ['.jsx', '.js', '.json']
    },

    devServer: {
      port: 8080,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    },

    devtool: isDev ? 'inline-source-map' : '',

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            {
              loader: 'style-loader',
              options: {
                insert: function addStylesToWindow(el) {
                  const _window = typeof window !== 'undefined' ? window : {};
                  if (!_window.customElStyles) {
                    _window.customElStyles = [];
                  }
                  _window.customElStyles.push(el);
                }
              }
            },
            'css-loader'
          ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },

    plugins: [
      cleanupDist(),
      addDefinePlugin(),
      addModuleFederation(),
      addHTMLTemplate(),
      addBuildManifest()
    ]
  };

  return config;
};
