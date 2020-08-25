const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'; // определение режима сборки
const isProd = !isDev;



const optimization = () => {
    const config = {
        splitChunks: { //оптимизация, если подключается в разные чанки один и тот же плагин. В финальной сборке это выносится в общий фал vendors~nameFile1~nameFil2.... 
            chunks: 'all'
        }
    }

    if (isProd) {
        console.log('Минификация css js:', isProd)
        //если прод то минифицируем css - OptimizeCssAssetsWebpackPlugin, js - TerserWebpackPlugin
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}


const filename = ext => (
    //если разработка то не выводить хэши в именах файлов в папке сборки
    isDev ?
        `[name].${ext}` :
        `[name].[hash].${ext}`
)



const cssLoaders = extra => {
    //[0]-добавление в head для html, [1]-обработка import style в js файлах [2]-
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            },
        },
        'css-loader'
    ]

    if (extra) loaders.push(extra);

    return loaders;
}



module.exports = {
    context: path.resolve(__dirname, 'src'), //где лежат иходники
    mode: 'development', //тип сбора
    entry: { //файлы (чанки)
        main: './index.js',
        analytics: './analitics.js'
    },
    output: { //имена файлов и путь к сборке
        filename: filename('js'), //hash для уникальности(связанно с не обновлением кэша)
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'], //позволяет при import не писать '.js', '.json','.png' и др.
        alias: { //оптимизация описания путей
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: optimization(), //вынес в функцию
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
        }), //добавление к сборке html с подкл(с [name].[hash]) javascript
        new CleanWebpackPlugin(), //очистка папки сборки от неактульных файлов
        new CopyWebpackPlugin({ //копирование определенного файла в папку сборки
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: { //лоадеры (доп.конф)
        rules: [
            { //для загрузки css
                test: /\.css$/,
                use: cssLoaders() //custom func с настройками для css/и др.
            },
            { //для загрузки less
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            { //для загрузки sass
                test: /\.s[ac]ss$/, //[ac] либо A либо C
                use: cssLoaders('sass-loader')
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