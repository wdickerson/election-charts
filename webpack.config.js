const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.png$/, 
        loader: 'file-loader' 
      },
    ],
  },
  resolve: {
    extensions: ['.*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // contentBase: "./dist",
    compress: true,
    port: 9000,
  },
};