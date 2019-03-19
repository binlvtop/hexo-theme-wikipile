 const path = require('path'),
     webpack = require('webpack'),
     MiniCssExtractPlugin = require("mini-css-extract-plugin"),
     CleanPlugin = require('clean-webpack-plugin');

 module.exports = {
     entry: {
         main: './src/scripts/main.js'
     },
     output: {
         path: path.resolve(__dirname, 'source'),
         filename: 'wikipile.bundle.js'
     },
     module: {
         rules: [{
                 test: require.resolve('./src/scripts/jquery'),
                 use: [{
                     loader: 'expose-loader',
                     options: '$'
                 }]
             },
             {
                 test: /\.js$/,
                 exclude: /node_modules/,
                 use: {
                     loader: 'babel-loader',
                     options: {
                         presets: ['@babel/preset-env']
                     }
                 },
             },
             {
                 test: /\.(styl|css)$/,
                 use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        minimize: true
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require("autoprefixer")({
                            browsers: ['last 5 versions']
                        })]
                    }
                },
                'stylus-loader'
            ]
             },
             {
                 test: /\.(png|jpg|gif)$/,
                 use: [{
                     loader: 'url-loader',
                     options: {
                         name: 'img/[name].[hash:4].[ext]',
                         limit: 1024
                     }
                 }]
             },
             {
                 test: /\.(woff|svg|eot|ttf)\??.*$/,
                 use: {
                     loader: 'file-loader',
                     options: {
                         name: 'fonts/[name].[hash:4].[ext]'
                     }
                 }
             }
         ]
     },
     plugins: [
         new MiniCssExtractPlugin('wikipile.min.css'),
         new CleanPlugin('./source', {
            // 一般图标不需要清空
            exclude: ['images', 'fonts']
         }),
         new webpack.optimize.OccurrenceOrderPlugin(),
         new webpack.optimize.UglifyJsPlugin()
     ]
 }