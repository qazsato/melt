const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'electron-main',
  entry: {
    main: './src/main.ts'
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
        use: ['vue-loader']
      },
      {
        test: /\.ts$/,
        use: ['ts-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: ['file-loader']
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src'),
      '@config': path.resolve(__dirname, 'config')
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
