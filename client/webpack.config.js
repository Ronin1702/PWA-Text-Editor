const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

//Add and configure workbox plugins for a service worker and manifest file.
module.exports = () => {
  return {
    // set mode to development
    mode: 'development',

    entry: {
      // set entry points for main bundle
      main: './src/js/index.js',
      // set entry points for install bundle
      install: './src/js/install.js',
    },

    output: {
      // set the bundled javascript file name with the main entry point name
      filename: '[name].bundle.js',
      // Output the bundled javascript file to the dist folder
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      // Webpack plugin that generates our html file and injects our bundles.
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'J.A.T.E.'
      }),

      // Creates a manifest.json file.
      new WebpackPwaManifest({
        // fingerprints: false allows webpack to not append a hash to the manifest.json file name.
        fingerprints: false,

        // inject: true allows webpack to inject the manifest.json file into the index.html file.
        inject: true,
        name: 'Just Another Text Editor',
        short_name: 'JATE',
        description:
          'JATE is Just Another Text Editor app that serves as a PWA-based text editor which features data persistence and offline support.',
        background_color: '#225ca3',
        theme_color: '#225ca3',

        // start_url: '/' allows webpack to set the start_url property of the manifest.json file to the root of the application.
        start_url: '/',

        // publicPath: '/' allows webpack to set the publicPath property of the manifest.json file to the root of the application.
        publicPath: '/',

        // icons: [] allows webpack to add an array of icons images to the manifest.json file.
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),

      // Injects our custom service worker
      new InjectManifest({
        // the path to the service worker source file
        swSrc: './src-sw.js',
        // the path to the service worker output file
        swDest: 'src-sw.js',
      }),
    ],

    //Add CSS loaders and babel to webpack.
    module: {
      rules: [
        {
          // Test for files with .css extension
          test: /\.css$/i,

          // Use the style-loader to inject the css into the DOM, and css-loader to handle the css imports in JavaScript
          use: ['style-loader', 'css-loader'],
        },

        // Transpile all files ending in .js using babel's transpiler
        {
          // Test for files with .js or .mjs extension
          test: /\.m?js$/,

          // Exclude node_modules directory from transpilation
          exclude: /node_modules/,

          // Use babel-loader in order to use ES6.
          use: {
            loader: 'babel-loader',
            options: {
              // Use @babel/preset-env to transpile based on targeted browser or runtime environments.
              presets: ['@babel/preset-env'],
              plugins: [
                // Use @babel/plugin-proposal-object-rest-spread to transpile object spread into ES6
                '@babel/plugin-proposal-object-rest-spread',

                // Use @babel/plugin-transform-runtime to externalize references to helpers and builtins, automatically poly-filing codes without polluting globals.
                '@babel/plugin-transform-runtime',

                // // Suppresses warnings from deprecated setImmediate polyfill
                // {
                //   apply: (compiler) => {
                //     compiler.hooks.thisCompilation.tap('SuppressDeprecationWarning', (compilation) => {
                //       compilation.warnings = compilation.warnings.filter(
                //         (warning) => !warning.message.includes('DEP_WEBPACK_COMPILATION_ASSETS')
                //       );
                //     });
                //   },
                // },
              ],
            },
          },
        },
      ],
    },
  };
};
