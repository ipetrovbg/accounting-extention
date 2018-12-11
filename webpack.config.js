const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
    plugins: [
        new HtmlWebpackPlugin({template: './index.html'}),
        new ExtractTextPlugin("styles.scss")
    ],
    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".scss"]
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
                exclude: /node_modules/
            },
            //-------------------- Add SCSS Loaders -------------------------//
            {
                test: /\.scss$/,
                loaders: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    require.resolve('sass-loader')
                ]
            },
            // AllAppActions files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { legacy: true }],
                                ["@babel/plugin-proposal-class-properties", { loose: false }],
                            ]
                        }
                    },
                    {
                        loader: "awesome-typescript-loader"
                    }
                ],
                exclude: /node_modules/
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }

        ]
    }
};