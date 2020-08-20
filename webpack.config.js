const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, 'src'), //где лежат иходники
    mode: 'development', //тип сбора
    entry: { //файлы
        main: './index.js', 
        analytics: './analitics.js'
    },
    output: { //имена файлов и путь к сборке
        filename: '[name].[contentHash].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({ template: './index.html' }),
        new CleanWebpackPlugin()
    ],
    module:{
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] //1)добавление в head html, 2)обработка import style
            }
        ]
    }
};