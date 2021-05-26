const path = require('path');
const sourceSrc = path.resolve(__dirname, './src/module');
const isProduction = process.env.NODE_ENV === 'production';
const configureWebpack = require('./webpack.config');

module.exports = {
    productionSourceMap: false, //生产环境的 source map
    css: {
        sourceMap: !isProduction,
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 100, // 换算的基数
                        propList: ['*']
                    })
                ]
            },
            sass: {
                prependData: `@import "~public/styles/1px.scss";`
            }
        }
    },
    devServer: {
        clientLogLevel: 'warning'
    },
    configureWebpack,
    chainWebpack(webpackConfig) {
        webpackConfig.plugin('define').tap((options) => {
            options[0] = {
                ...options[0],
            };
            return options;
        });
    },
    pluginOptions: {
        'muti-dev': {
            sourceSrc,
            debug: true
        },
        'muti-build': {
            sourceSrc,
            debug: false,
            report: false, //生成analyzer 报告
            modern: false, //是否启用现代模式（文件数double）
            concurrency: Math.abs(require('os').cpus().length / 2) //多核
        }
    }
};
