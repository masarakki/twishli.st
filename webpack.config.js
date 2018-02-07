const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: [
    './src/js/app.js',
    './src/css/main.scss'
  ],
  output: {
    path: outputPath,
    filename: '[name].js'

  },
  module: {
    rules: [{
      test: /\.(scss|sass|css)$/i,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader', options: { minimize: process.env.NODE_ENV === 'production' } },
//        { loader: 'postcss-loader', options: { sourceMap: true } },
        { loader: 'sass-loader' }
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/html/index.html'
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: outputPath
  }
};
