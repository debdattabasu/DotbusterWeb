var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
	  path: './build',
    filename: 'js/bundle.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.ts', '.tsx', '.js']
  },
  plugins: [new HtmlWebpackPlugin({template: './src/index.html'})],
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.png$/, loader: 'file?name=media/images/[hash].[ext]' },
      { test: /\.jpg$/, loader: 'file?name=media/images/[hash].[ext]' },
      { test: /\.ogg/, loader: 'file?name=media/sounds/[hash].[ext]' }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
}
