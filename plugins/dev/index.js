const execa = require('execa');
const getRepositoryModule = require('../utils/getRepositoryModule');
const selectModule = require('../utils/selectModule');
const StatFilterPlugin = require('../utils/statFilterPlugin');

module.exports = (api, options) => {
    if (process.env.___devPages) {
        options.pages = formatPages(JSON.parse(process.env.___devPages)); //覆盖vue.config.js中的pages
        api.chainWebpack((webpackConfig) => {
            webpackConfig
                .plugin('statFilterPlugin')
                .use(StatFilterPlugin, [{ ignoreLoaders: ['postcss-loader'], warnings: true, errors: false }]);
        });
    }

    api.registerCommand('muti-dev', async (args) => {
        const { pluginOptions: { 'muti-dev': { sourceSrc, debug } } = {} } = options;

        const modules = await selectModule(getRepositoryModule(sourceSrc), args._);

        execa('vue-cli-service', ['serve'], {
            stdio: 'inherit',
            env: {
                ___devPages: JSON.stringify(modules),
                VUE_APP_DEBUG: debug
            }
        });
    });
};

module.exports.defaultModes = {
    'muti-dev': 'development'
};

function formatPages(pages) {
    return pages.reduce((res, { name, entry, filename }) => {
        return {
            ...res,
            [name]: {
                entry,
                filename
            }
        };
    }, []);
}
