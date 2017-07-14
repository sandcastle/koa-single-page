const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const root = (...args) => path.resolve(path.join(ROOT, ...args));

module.exports = {

  performance: {
    hints: false
  },

  entry: {
    main: './lib/main.js'
  },

  resolve: {
    extensions: ['.js'],
    modules: [root('../lib')]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'lib/index.html',
      chunksSortMode: 'dependency',
      inject: 'head'
    })
  ],

  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
