const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const APP_DIR = fs.realpathSync(process.cwd());

const resolveAppPath = relativePath => path.resolve(APP_DIR, relativePath);

module.exports = {
  entry: resolveAppPath('src'),
  output: {
    filename: 'widget-better-tag.js',
    library: ['recogito', 'BetterTag'],
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  performance: {
    hints: false
  },
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/,
        use: { 
          loader: 'babel-loader' ,
          options: {
            "presets": [
              "@babel/preset-env",
            ],
            "plugins": [
              [
                "@babel/plugin-proposal-class-properties"
              ]
            ]
          }
        }
      },
      { test: /\.css$/,  use: [ 'style-loader', 'css-loader'] },
    ]
  },
	devServer: {
    compress: true,
    hot: true,
    host: process.env.HOST || 'localhost',
    port: 3000,
    static: [{
      directory: resolveAppPath('public'),
      publicPath: '/'
    },{
      directory: resolveAppPath('../../assets'),
      publicPath: '/'
    }]
  },
  plugins: [
    new HtmlWebpackPlugin ({
      template: resolveAppPath('public/index.html')
    })
  ]
}