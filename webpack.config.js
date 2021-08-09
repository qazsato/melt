const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'electron-main',
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: './[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
  resolve: {
    extensions: ['.js'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@config': path.resolve(__dirname, 'config'),
      '@scripts': path.resolve(__dirname, 'src/assets/scripts'),
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
