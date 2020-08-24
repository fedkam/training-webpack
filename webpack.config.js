const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'; // определение режима сборки
const isProd = !isDev;

console.log('Режим запуска:', isDev)

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
    resolve: {
        extensions: ['.js', '.json', '.png'], //позволяет при import не писать '.js', '.json','.png' и др.
        alias: { //оптимизация описания путей
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        splitChunks: { //оптимизация, если подключается в разные чанки один и тот же плагин. В финальной сборке это выносится в общий фал vendors~nameFile1~nameFil2.... 
            chunks: 'all'
        }
    },
    devServer: { //горячая перезагрузка при изменние благодаря webpack-dev-server. Запуск yarn start.
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {//минификация html
                collapseWhitespace: isProd
            }
        }), //добавление к сборке html с подкл(с [name].[contentHash]) javascript
        new CleanWebpackPlugin(), //очистка папки сборки от неактульных файлов
        new CopyWebpackPlugin({ //копирование определенного файла в папку сборки
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({ //
            filename: '[name].[contentHash].bundle.сss'
        })
    ],
    module: { //лоадеры (доп.конф)
        rules: [
            { //для загрузки css
                test: /\.css$/,
                use: [ //1)добавление в head для html, 2)обработка import style в js файлах
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        },
                    },
                    'css-loader'
                ]
            },
            { //для изображений
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            { //для шрифтов
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            { //ну ты понял...
                test: /\.xml$/,
                use: ['xml-loader']
            },
            { //ну ты понял...
                test: /\.csv$/,
                use: ['csv-loader']
            }
        ]
    }
};