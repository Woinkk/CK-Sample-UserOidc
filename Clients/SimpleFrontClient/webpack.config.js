module.exports = {
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'Sample',
    libraryExport: 'default'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '.',
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};