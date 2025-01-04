import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';

const envFile = `./.env.${process.env.NODE_ENV || 'development'}`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new Dotenv({
            path: envFile,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.REACT_APP_NODE_ENV': JSON.stringify(process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development'),
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        static: './dist',
        open: true,
        hot: true,
        historyApiFallback: true,
    },
    resolve: {
        fallback: {
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
            buffer: 'buffer',
            os: 'os-browserify/browser',
            path: 'path-browserify',
            vm: 'vm-browserify',
            process: 'process/browser', 
        },
    },
};

console.log(`Loaded envFile: ${envFile}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
