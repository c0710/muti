const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = (api, options) => {
    if (!isProduction) {
        return;
    }
    options.productionSourceMap = true;
    api.chainWebpack((webpackConfig) => {
        webpackConfig.devtool(false);
        webpackConfig.plugin('SourceMapDevToolPlugin').use(webpack.SourceMapDevToolPlugin, [
            {
                filename: 'sourcemap/your-project/[file].map',
                // 放在测试服务器
                publicPath: 'http://0.0.0.0:3333/'
            }
        ]);
    });
};
