const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const {
  fileToComponentName,
  resolveEntry
} = require('./scripts/multipleEntry')
const args = require('minimist')(process.argv.slice(2))

module.exports = {
  mode: 'development',
  entry: {
    main: resolveEntry({ component: args['component'] })
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: args['production'] ? `${args['component']}.[hash].js` : `${args['component']}.js`,
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.vue', '.styl']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              shadowMode: true
            }
          }
        ]
      },
      {
        test: /\.styl(us)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              shadowMode: true
            }
          },
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|gif|svg|woff2)$/,
        exclude: /node_modules/,
        use: 'url-loader'
      }
    ]
  },
  externals: {
    ...(args['externalize'] ? { vue: 'Vue' } : {})
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      libName: args['libName'],
      tag: fileToComponentName({ component: args['component'] }).kebabName,
      externalize: args['externalize'],
      template: path.resolve(__dirname, './public/demo.html')
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
