const path = require('path');
const webpack = require('webpack'); // Necessário para plugins

module.exports = {
  mode: 'development',
  // O ponto de entrada agora está correto
  entry: './src/App.jsx', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      // Regra para carregar o CSS (agora ele está em src/style.css)
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  // Plugins para injeção automática de variáveis (como o React)
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  devServer: {
    // Aponta para a pasta public/ que tem o index.html
    static: {
      directory: path.join(__dirname, 'Public'), 
    },
    compress: true,
    port: 8080, 
    historyApiFallback: true, 
    hot: true
  }
};