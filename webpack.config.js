// Библиотека для получения пути с учетом кроссплатформенности
const path = require('path');
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

module.exports = {
  mode: 'development',                      // Режим сборки для разработки
  entry: './src/main.js',                   // Точка входа
  output: {
    filename: 'bundle.js',                  // Файл сборки
    path: path.join(__dirname, 'public'),   // Место расположения сборки (абсолютный путь до директории public)
  },
  devtool: 'source-map',                    // Генерация source-map для быстрой навигации в файле сборки
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    watchContentBase: true,
  },
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        }
    ]
  },
  plugins: [
    new MomentLocalesPlugin()
  ]
};
