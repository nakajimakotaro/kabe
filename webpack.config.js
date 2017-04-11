const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        "script": "./src/script.ts",
    },
    output: {
        path: __dirname,
        filename: `public/[name].js`,
    },
    devtool: 'source-map',
    devServer: {
        contentBase: 'public/',
        inline: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'src/index.html', to: 'public/index.html'},
            {from: 'src/style.css',  to: 'public/style.css'},
        ])
    ]
};
