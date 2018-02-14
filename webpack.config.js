const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const devPath = path.resolve(__dirname, 'dev');
const prodPath = path.resolve(__dirname, 'prod');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
  entry: [
    './src/js/app.js',
    './src/css/main.scss'
  ],
  output: {
    path: prod ? prodPath : devPath,
    filename: '[name].js'

  },
  module: {
    rules: [{
      test: /\.(scss|sass|css)$/i,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: { minimize: prod } },
        { loader: 'sass-loader' }
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/html/index.html'
    }),
    new Dotenv({
      path: prod ? '.env.prod' : '.env.dev',
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: devPath
  }
};
