const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.js',
        library: 'the-datepicker',
        libraryTarget: 'amd',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.ts(x*)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.json',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
}
