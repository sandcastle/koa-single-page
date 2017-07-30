const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const root = (...args) => path.resolve(path.join(ROOT, ...args));

module.exports = {

  performance: {
    hints: false
  },

  entry: {
    main: './public/main.js'
  },

  resolve: {
    extensions: ['.js'],
    modules: [root('../public')]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
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
