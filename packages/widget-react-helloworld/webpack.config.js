const path = require('path');
const fs = require('fs');

const APP_DIR = fs.realpathSync(process.cwd());

const resolveAppPath = relativePath => path.resolve(APP_DIR, relativePath);

module.exports = {
  entry: resolveAppPath('src'),
  output: {
    filename: 'recogito-helloworld-widget.js',
    library: ['recogito', 'HelloWorldWidget'],
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat"
    }
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
              "@babel/preset-react"
            ],
            "plugins": [
              [
                "@babel/plugin-proposal-class-properties"
              ]
            ]
          }
        }
      }
    ]
  }
}