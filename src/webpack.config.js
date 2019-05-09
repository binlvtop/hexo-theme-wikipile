 const path = require('path'),
     webpack = require('webpack'),
     MiniCssExtractPlugin = require("mini-css-extract-plugin"),
     CleanPlugin = require('clean-webpack-plugin'),
     OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

 module.exports = {
    mode: 'production',
    entry: {
        main: './src/scripts/main.js'
    },
    output: {
        /**
         * With zero configuration,
         *   clean-webpack-plugin will remove files inside the directory below
         */
        path: path.resolve(process.cwd(), 'source'),
        filename: 'wikipile.bundle.js'
    },
    module: {
        rules: [{
                test: path.resolve(process.cwd(), 'src/scripts/jquery.js'),
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
                        loader: 'css-loader?modules=false',
                        options: {
                            importLoaders: 1,
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
        new MiniCssExtractPlugin({
            filename: 'wikipile.min.css'
        }),
        new CleanPlugin({
        // 不需要清空
        cleanOnceBeforeBuildPatterns: ['!images/*', '!css', '!js']
        })
    ],
    optimization: {
        minimizer: [
            // 用于优化css文件
            new OptimizeCssAssetsPlugin({
                    assetNameRegExp: /\.css$/g,
                    cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true },
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            }),
        ]
    },
 }