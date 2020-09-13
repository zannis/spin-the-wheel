const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css$/,
            loader: [
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/assets', to: 'assets' }]
        }),
        new HTMLWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            hash: true,
            minify: false
        })
    ]
}
