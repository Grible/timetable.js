const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSASS = new ExtractTextPlugin('../styles/timetable.css');

module.exports = {
  entry: ['./src/scripts/plugin.js', './src/styles/plugin.sass'],
  output: {
    path: path.resolve(__dirname, './public/scripts'),
    filename: 'timetable.js'
  },
  module: {
    rules: [
      { // sass / scss loader for webpack
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        use: extractSASS.extract([ 'css-loader', 'sass-loader' ])
      },

        {
        test: /\.js$/, // include .js files
          enforce: "pre", // preload the jshint loader
          exclude: /node_modules/, // exclude any and all files in the node_modules folder
          use: [{
            loader: "jshint-loader"
          }]
        },
      {
        test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            /*options: {
            presets: ['@babel/preset-env']
          }*/
        }
      }
    ]
  },
  plugins: [
    extractSASS
  ]
};

