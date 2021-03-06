const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

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
    //[0]-добавление в head для html, [1]-обработка import style в js файлах [2]-препроц для css
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



const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }];

    if(isDev) loaders.push('eslint-loader');

    return loaders;
}


const babelOptions = (preset) => {
    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) options.presets.push(preset);

    return options;
}



const plugins = () => {
    const projectPlugins = [
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
    ];

    if(isProd) projectPlugins.push(new BundleAnalyzerPlugin) //анализ оптимизации финального бандла

    return projectPlugins;
}



module.exports = {
    context: path.resolve(__dirname, 'src'), //где лежат иходники
    mode: 'development', //тип сбора
    entry: { // доп.настройка для babel(для async() etc.) + файлы (чанки)  
        main: ['@babel/polyfill', './index.jsx',],
        analytics: './analitics.ts'
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
    devtool: isDev ? 'source-map' : '',
    devServer: { //горячая перезагрузка при изменние благодаря webpack-dev-server. Запуск yarn start.
        port: 4200,
        hot: isDev
    },
    plugins: plugins(),
    module: {   //лоадеры (доп.конф)
        rules: [
            {   //для загрузки css
                test: /\.css$/,
                use: cssLoaders() //custom func с настройками для css/и др.
            },
            {   //для загрузки less
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {   //для загрузки sass
                test: /\.s[ac]ss$/, //[ac] либо A либо C
                use: cssLoaders('sass-loader')
            },
            {   //для изображений
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {   //для шрифтов
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {    //ну ты понял...
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {   //ну ты понял...
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                //транспилятор для js. В package.json нaстройка для babel browserslist:...
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                //транспилятор для TS. В package.json ностройка для babel browserslist:...
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                //транспилятор для ReactJS. В package.json ностройка для babel browserslist:...
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
};