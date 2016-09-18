const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: './src/vendor',
    app: './src/main',
  },
  output: {
    path: __dirname,
    filename: './dist/[name].bundle.js',
  },
  resolve: {
    extensions: ['', '.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.ts/,
        loaders: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', './dist/vendor.bundle.js'),
  ],
};

