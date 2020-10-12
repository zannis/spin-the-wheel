const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {TsconfigPathsPlugin} = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            options: {
                configFileName: 'tsconfig.prod.json'
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
            test: /\.(woff|woff2|eot|ttf|svg|mp3)$/,
            loader: 'file-loader'
        }]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/assets', to: 'assets' }]
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            filename: 'index.html',
            hash: true,
            minify: false
        })
    ],
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: './tsconfig.prod.json'
            })
        ],
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
