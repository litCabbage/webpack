// 这是最基本的一个配置文件
// 编写配置文件，要有最基本的文件入口和输出文件配置信息等
// 里面还可以加loader和各种插件配置使用
var path = require('path');
var webpack = require('webpack');
// 抽取css的第三方插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// 自动生成index.html页面插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 删除文件夹
var CleanPlugin = require('clean-webpack-plugin');

module.exports = {
     entry: {
        // 这是多入口文件的写法
        app: path.resolve(__dirname, 'src/js/app.js'),
        vendors: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            // 处理jsx语法和ES6语法
            {
                test: /\.jsx?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
                loader: 'babel-loader',// 不能只写babel，而必须写完整
                query: {
                    presets: ['es2015', 'react']
                }
            },
            // 处理在js中引用css文件
            // {
            //     test: /\.css$/, // Only .css files
            //     loader: 'style-loader!css-loader' // 用多个加载器 用!号连接，多个加载器执行顺序是从右往左去执行 
            // },
             // 上面的只是对js文件中插入css进行预处理，然而那些css文件还是在js里面，所以我们用了
            // 一个第三方插件，把这些加载器包裹起来，然后把css就抽离出来了
             {
                test: /\.css$/, // Only .css files
                // loader: ExtractTextPlugin.extract("style-loader", "css-loader")
                //而且上面的写法不行，必须加上fallback和use
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            },
            // {
            //     test: /\.scss$/,
            //     loader: 'style-loader!css-loader!sass-loader'
            // },      
           
            // 这是把sass也抽离出来，而且css-loader必须和sass-loader放在一起
            {
                test: /\.scss$/,
                // loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: "css-loader!sass-loader" })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader?limit=25000&name=images/[name].[ext]' //问号代表可以给加载器传参数,图片大小大于这个值，就是路径，
                //小于就是Base64 25000bit==3kb 1kb = 1024b 1b = 8bit 
            },
            {
                test: /\.(woff|eot|ttf|woff2|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        // 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        // 注意一下, extensions 第一个是空字符串! 对应不需要后缀的情况.
        extensions: ['.js', '.json', '.scss', '.jsx'],
        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址。后续直接 require('AppStore') 即可
        // alias: {
        //     ReactJS:"node_modules/react/react.min.js",
        //    AppStore: 'js/stores/AppStores.js',
        //    ActionType: 'js/actions/ActionType.js',
        //    AppAction: 'js/actions/AppAction.js'
        // }
    },
    // 在这个属性里面定义的包是不会被打包进bundle。js文件中的,如果你要用这个属性，别忘了在index。html中引入cdn
    // externals: {
    //    // 配置了这个属性之后react和react-dom这些第三方的包都不会被构建进js中，那么我们就需要通过cdn进行文件的引用了
    //    // 前边这个名称是在项目中引用用的，相当于import React from  ‘react1’中的react，
    //    //'react1':"react",
    //    'react1':"react",
    //    'react-dom1':"react-dom",
    //     '$1':"jQuery"
    //
    // },
    plugins: [
        // 构建之前先删除dist目录下面的文件夹
        new CleanPlugin(['dist']),
        //分离第三方应用插件，name属性指向entry中vendors属性，filename属性中的文件会自动构建到output的文件夹中
        new webpack.optimize.CommonsChunkPlugin({name: 'vendors', filename: 'vendors.js'}),
        // 用webpack压缩代码，可以忽略代码中的警告
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // 可以新建多个抽离样式的文件，这样就可以有多个css文件了。
        new ExtractTextPlugin("app.css"),
        // compiling our final assets
        new HtmlWebpackPlugin({
            template: './src/template.html',
            htmlWebpackPlugin: {
                "files": {
                    "css": ["app.css"],
                    "js": ["vendors.js","bundle.js"]
                }
            },
            // 效果不大，情怀至上
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new webpack.DefinePlugin({
            //去掉react中的警告，react会自己判断
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
    ]
}