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
    }, {
      test: /\.(css|scss)$/,
      use: ['style-loader', 'css-loader']
    }]
  }

};

module.exports = webpackConfig;
