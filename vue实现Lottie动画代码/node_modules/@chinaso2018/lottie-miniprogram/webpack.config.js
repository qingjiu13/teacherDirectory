/*
 * @Author: zhouyuying
 * @Date:   2020-06-30 09:41:17
 * @Last Modified by:   zhouyuying
 * @Last Modified time: 2020-06-30 16:28:09
 */
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

module.exports = {
  entry: './src/index.js',
  output: {
    libraryTarget: 'commonjs',
    filename: 'index.js',
    path: path.resolve(__dirname, 'miniprogram_dist'),
  },
  devtool: '',
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'eslint-loader',
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: `('__LOTTIE_CANVAS__')`,
                  replace: fs.readFileSync(
                    './node_modules/@chinaso2018/lottie-mini/build/player/lottie_canvas.js',
                    { encoding: 'utf8' }
                  ),
                },
                {
                  search: '__[STANDALONE]__',
                  replace: '',
                },
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  amd: false,
  plugins: [
    new webpack.DefinePlugin({
      define: {},
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
}
