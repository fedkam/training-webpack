const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    context: path.resolve(__dirname, 'src'), //где лежат иходники
    mode: 'development', //тип сбора
    entry: { //файлы (чанки)
        main: './index.js', 
        analytics: './analitics.js'
    },
    output: { //имена файлов и путь к сборке
        filename: '[name].[contentHash].bundle.js', //contentHash для уникальности(связанно с не обновлением кэша)
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({ template: './index.html' }), //добавление к сборке html с подкл(с [name].[contentHash]) javascript
        new CleanWebpackPlugin() //очистка папки сборки от неактульных файлов
    ],
    module:{ //лоадеры (доп.конф)
        rules: [
            { //для загрузки css
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] //1)добавление в head для html, 2)обработка import style в js файлах
            },
            { //для изображений
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            { //для шрифтов
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            }
        ]
    }
};