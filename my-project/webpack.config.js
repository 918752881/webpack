'use strict'

const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 压缩html插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 单独打包css
const OptimizeCssAssetsWebpackPlugin =  require('optimize-css-assets-webpack-plugin') //  压缩css
const glob = require('glob')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')


const SetMap = () => {
    const entry = {}
    const HtmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

    // console.log('entryFiles', entryFiles)

    entryFiles.map(item => {
        const pageNameMap =  item.match(/src\/(.*)\/index\.js/)
        const pageName = pageNameMap && pageNameMap[1]
        entry[pageName] = item
        // console.log(entry)
        HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
            template:  path.join(__dirname, `src/${pageName}/index.html`),
            filename:  `${pageName}.html`,
            chunks: [pageName, 'vendors','commons'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }))
    })

    return {
        entry,
        HtmlWebpackPlugins
    }
}
const { entry, HtmlWebpackPlugins } = SetMap()
module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname,'dist'), //必须绝对目录
        filename: 'js/[name].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader' // 解析es6、es7
            },
            {   
                test: /\.css/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader'

                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    // {
                    //     loader: 'postcss-loader',
                    //     options: {
                    //         plugins: () => [
                    //             require('autoprefixer')({
                    //                 browsers: ['last 2 version', '>1%', 'ios 7']
                    //             })
                    //         ]
                    //     }
                    // },
                    // {
                    //     loader: 'px2rem-loader',
                    //     options: {
                    //         remUnit: 75,
                    //         remPrecision: 8
                    //     }
                    // }
                ]
            },
            // {
            //     test: /\.(jpg|png|gif|jpeg)$/, // 解析图片资源
            //     use: 'file-loader'
            // },
            {
                test: /\.(jpg|png|gif|jpeg)$/, // 解析图片资源
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: 'img/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|wpff2|eot|ttf|otf)$/, // 解析字体资源
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'font/[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin()
        new MiniCssExtractPlugin({ //单独打包哦css
            filename: 'css/[name].css',
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessop: require('cssnano')
        }),
        // // 多个html页面压缩，需要配置多个
        // new HtmlWebpackPlugin({
        //     template:  path.join(__dirname,'src/index.html'),
        //     filename: 'index.html',
        //     chunks: ['index'],
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }
        // }),
        // new HtmlWebpackPlugin({
        //     template:  path.join(__dirname,'src/search.html'),
        //     filename: 'search.html',
        //     chunks: ['search'],
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }
        // })
        new CleanWebpackPlugin(),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //       {
        //         module: 'react',
        //         entry: 'http://static.runoob.com/assets/react/react-0.14.7/build/react.min.js',
        //         global: 'React',
        //       },
        //       {
        //         module: 'react-dom',
        //         entry: 'http://static.runoob.com/assets/react/react-0.14.7/build/react-dom.min.js',
        //         global: 'ReactDOM',
        //       },
        //     ],
        //   })

    ].concat(HtmlWebpackPlugins),
    optimization: {
        splitChunks: {
         minSize: 0,
          cacheGroups: {
            vendors: {
                test: /(react|react-dom)/,
                // cacheGroupKey here is `commons` as the key of the cacheGroup
                name: 'vendors',
                chunks: 'all'
              },
              commons: {
                name: 'commons',
                chunks: 'all',
                minChunks: 2
              }
          }
        }
    },
    // optimization: {
    //     splitChunks: {
    //       minSize: 0,
    //       cacheGroups: {
    //         commons: {
    //             name: 'commons',
    //             chunks: 'all',
    //             minChunks: 2
    //           }
    //       }
    //     }
    // },
    devServer: {
        contentBase: './dist',
        hot: true
    }
}