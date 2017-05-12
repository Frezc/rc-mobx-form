var webpackConfig = {
  devtool: 'source-map',
  entry: './example/index.js',

  output: {
    filename: './example/bundle.js'
  },
  module: {
    rules: [{
      test: /\.js?/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }

};

module.exports = webpackConfig;
