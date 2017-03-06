// 这是最基本的一个配置文件
// 编写配置文件，要有最基本的文件入口和输出文件配置信息等
// 里面还可以加loader和各种插件配置使用
var path = require('path');
// 自动打开浏览器插件
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry:path.resolve(__dirname,'src/js/app.js'),
    //下面是为了实现浏览器自动刷新，然而这种写法会报错，
    //而且上面的最简单写法就可以实现浏览器自动刷新的效果
    // entry:[
    //     'webpack/hot/dev-server',
    //     'webpack-dev-server/client?http://localhost:8080',
    //     path.resolve(__dirname,'src/js/app.js')
    // ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            // 处理jsx语法和ES6语法
            {
                test: /\.jsx?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
                // 这个地方的babel必须要写完整
                loader: 'babel-loader',// 不能只写babel，而必须写完整
                query: {
                    presets: ['es2015', 'react']
                }
            },
            // 处理在js中引用css文件
            {
                test: /\.css$/, // Only .css files
                loader: 'style-loader!css-loader' // 用多个加载器 用!号连接，多个加载器执行顺序是从右往左去执行 
            },
            // 用scss加载器 发现还缺少node-sass，得用npm i node-sass --save-dev
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader?limit=25000' //问号代表可以给加载器传参数,图片大小大于这个值，就是路径，
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
        extensions: ['', '.js', '.json', '.scss', '.jsx']
        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址。后续直接 require('AppStore') 即可
        //alias: {
        //    AppStore: 'js/stores/AppStores.js',
        //    ActionType: 'js/actions/ActionType.js',
        //    AppAction: 'js/actions/AppAction.js'
        //}
    },
    // 不如不要，反而不刷新了
    // plugins: [
    //     new OpenBrowserPlugin({url: 'http://localhost:8080/', browser: 'chrome'})
    // ]
}