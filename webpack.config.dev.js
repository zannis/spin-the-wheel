const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: 'dist',
        port: 3000
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
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
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/assets', to: 'assets' }]
        }),
        new HTMLWebpackPlugin({
            template: 'index.html',
            filename: 'index.html'
        })
    ]
}
