// Node modules
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const WP = require('webpack');
const path = require('path');
const PACKAGE_JSON = require('./package.json');

/**
 * HTMLTemplate: Used to run dev build
 * ENTRY_PATH: index file
 * APP_NAME: Library name to access render
 */
const ENTRY_PATH = './src/index.tsx';
const HTMLTemplate = './src/index.html';
const APP_NAME = PACKAGE_JSON.name.toLowerCase();

/**
 * Module federation config
 * By default all dependencies are added to shared
 */
const MF_CONFIG = {
  name: `${APP_NAME}_remote`,
  remotes: {},
  exposes: {
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
      __IS_DEV__: isDev,
      __APP_NAME__: APP_NAME
    });

    return instance;
  };

  const addModuleFederation = () => {
    const instance = new ModuleFederationPlugin({
      ...MF_CONFIG,
      filename: 'remoteEntry.js',
      shared: {
        ...PACKAGE_JSON.dependencies,
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
      template: HTMLTemplate,
      filename: 'index.html',
      templateParameters: {
        app_name: APP_NAME
      }
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

  /** Add styles to custom object instead of adding to Head */
  function addStylesToWindow(el) {
    const windowRef = typeof window !== 'undefined' ? window : {};
    if (!windowRef.customElStyles) {
      windowRef.customElStyles = [];
    }
    windowRef.customElStyles.push(el);
  }

  const config = {
    entry: ENTRY_PATH,

    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name]-[hash].js',
      library: APP_NAME
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.jsx', '.js']
    },

    devServer: {
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
      }
    },

    devtool: isDev ? 'inline-source-map' : undefined,

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            {
              loader: 'style-loader',
              options: {
                insert: addStylesToWindow
              }
            },
            'css-loader'
          ]
        },
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader'
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
