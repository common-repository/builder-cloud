const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const purify = require("purifycss-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackStrip = require('strip-loader');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  bail: true,
  module: {
    loaders: [
      {
        test: /.json$/,
        loaders: [
          'json-loader'
        ]
      },
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader?-minimize'
          ]
        })
      },
      {
        test: /\.less$/,
        loaders: ExtractTextPlugin.extract({
          loader: [
            'css-loader?-minimize',
            'less-loader?noIeCompat'
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/[^bdapp]/,
        loaders: [
          WebpackStrip.loader('console.log', 'debug', 'console.log.apply'),
          'ng-annotate-loader',
          'babel-loader'
        ]
      },
      {
        test: /.html$/,
        loader: 'html-loader',
        query: {
          minimize: true
        }
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        loader: "file-loader?name=images/[name].[ext]"
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(function handler(percentage, msg) {
      console.log( msg + ' : ' + Math.round(percentage*100) + '%                                       ' + '\033[1A');
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new ImageminPlugin({
      pngquant: {
        quality: '95-100'
      }
    }),
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      minify: {
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: true
      },
      mangle: false
    }),
    new ExtractTextPlugin('global-[contenthash].css'),
    new purify({
        basePath: './src',
        paths: [
            "**/*.html"
        ],
        purifyOptions: {
          info: true,
          minify: true,
          rejected: true,
          whitelist: [
            '*mm-*',
            'mm-*'
          ]
        }
    }),
    new FaviconsWebpackPlugin('./src/images/favicon.png')
  ],
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    filename: 'builderdesigns-[hash].js'
  },
  entry: `./src/index.js`
};
