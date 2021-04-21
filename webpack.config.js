const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: `index.js`,
        library: 'LuckyPicker',
        libraryTarget: "umd"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'less-loader',
                    options: {
                        strictMath: true
                    }
                }
            ]
        }, {
            test:/\.(jpg|png|gif|bmp|jpeg)$/,
            use:'url-loader'
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
}