var webpack = require('webpack')
var config = require('./webpack.npm.base.conf')
var path = require('path')
var utils = require('./utils')

config.vue.loaders = utils.cssLoaders({ sourceMap: false });
config.output.filename = '[name].js'
config.output.chunkFilename = '[id].[chunkhash].js'
config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
])

webpack(config, function(err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n')
})

