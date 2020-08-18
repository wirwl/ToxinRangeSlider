/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const discardduplicates = require('postcss-discard-duplicates');
const flexbugsfixes = require('postcss-flexbugs-fixes');
const merge = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let devServer;
process.noDeprecation = true;
process.traceDeprecation = true;

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const pathOutput = 'Result';
  const dtValue = isDev ? 'source-map' : 'none';

  function reloadHtml() {
    const cache = {};
    const plugin = { name: 'CustomHtmlReloadPlugin' };
    this.hooks.compilation.tap(plugin, compilation => {
      compilation.hooks.htmlWebpackPluginAfterEmit.tap(plugin, data => {
        const orig = cache[data.outputName];
        const html = data.html.source();
        // plugin seems to emit on any unrelated change?
        if (orig && orig !== html) {
          devServer.sockWrite(devServer.sockets, 'content-changed');
        }
        cache[data.outputName] = html;
      });
    });
  }

  // ------------common values for all configs--------------------------------
  const common = {
    devServer: {
      stats: 'errors-only',
      before(app, server) {
        devServer = server;
      },
    },
    performance: { hints: false },
    devtool: dtValue,
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                attrs: ['img:src'],
              },
            },
            `pug-html-loader?pretty=${isDev}`,
          ],
        },
        {
          test: /\.(css|less)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { sourceMap: true },
            },

            {
              loader: 'css-loader',
              options: {
                import: (parsedImport, resourcePath) => {
                  if (parsedImport.url[0] === '/') {
                    const parsedResoucePath = path.parse(resourcePath);
                    const relativePart = parsedImport.url.substring(1);
                    parsedImport.url = path.relative(parsedResoucePath.dir, relativePart);
                  }
                  return true;
                },
                sourceMap: true,
                url: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                map: true,
                plugins: [
                  autoprefixer(),
                  flexbugsfixes(),
                  pxtorem({
                    rootValue: 14,
                    unitPrecision: 6,
                    propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
                    selectorBlackList: ['html'],
                    replace: true,
                    mediaQuery: true,
                    minPixelValue: 0,
                  }),
                  discardduplicates(),
                ],
                sourceMap: true,
              },
            },
            {
              loader: 'less-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
            },
          ],
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'source-map-loader',
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          include: /(components)/,
          loader: 'file-loader',
          options: {
            context: 'SRC',
            outputPath: 'images',
            name: '[path][name].[ext]',
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          include: /(images)/,
          exclude: /(components)/,
          loader: 'file-loader',
          options: {
            context: 'SRC\\images',
            outputPath: 'images',
            name: '[path][name].[ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          include: /(node_modules)/,
          loader: 'file-loader',
          options: {
            outputPath: 'fonts',
            name: '[path]/[name].[ext]',
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          include: /(fonts)/,
          exclude: /(node_modules)/,
          loader: 'file-loader',
          options: {
            context: 'SRC\\fonts',
            outputPath: 'fonts',
            name: '[path]/[name].[ext]',
          },
        },
      ], // rules
    },
    plugins: [new FriendlyErrorsWebpackPlugin()],
  };

  function AddHTMLPage(data) {
    const commonPath = data.inputPath.substring(data.inputPath.indexOf('/') + 1);
    data.outputPath = data.outputPath ? data.outputPath : commonPath;
    const result = merge({}, common, {
      entry: `./${data.inputPath}/${data.commonFilename}.ts`,
      output: {
        path: path.resolve(__dirname, pathOutput),
        filename: `${data.outputPath}/${data.commonFilename}.js`,
        publicPath: data.publicPath || '',
      },
      plugins: [
        new MiniCssExtractPlugin({ filename: `${data.outputPath}/${data.commonFilename}.css` }),
        new HtmlWebpackPlugin({
          filename: `${data.outputPath}/${data.commonFilename}.html`,
          template: `${data.inputPath}/${data.commonFilename}.pug`,
          inject: false,
        }),
        reloadHtml,
      ],
    });
    return result;
  }
  // ---Site-Pages-----------
  const pluginCFG = merge({}, common, {
    entry: {
      plugin: [
        './SRC/components/toxin-rangeslider/toxin-rangeslider.ts',
        './SRC/components/toxin-rangeslider/toxin-rangeslider.less',
      ],
    },
    output: {
      path: path.resolve(__dirname, `${pathOutput}/jquery-plugins/toxin-rangeslider/`),
      filename: 'toxin-rangeslider.js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: 'toxin-rangeslider.css' }),
      new CopyPlugin([
        {
          from: './node_modules/jquery/dist/jquery.js',
          to: path.resolve(__dirname, `${pathOutput}/jquery/jquery.js`),
        },
      ]),
    ],
  });
  //------------------------
  const indexCFG = AddHTMLPage({ commonFilename: 'index', inputPath: 'SRC/pages/index', outputPath: '.' });
  return [pluginCFG, indexCFG];
};
